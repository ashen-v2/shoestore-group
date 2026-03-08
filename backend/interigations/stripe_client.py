from config.config import settings
import stripe
from models.orders import Order
from models.payments import Payment
from sqlmodel import Session, select
from utils.other_utils import ReviewTools

stripe.api_key = settings.stripe_secret_key

class StripeClient:
    def create_payment_intent(self,order_amount: float, payment : Payment, session: Session, currency: str = "usd", description: str = "") -> dict:
        """Create a Stripe Payment Intent"""
        try:
            order_amount : int = int(order_amount * 100.0)  
            intent = stripe.PaymentIntent.create(
                amount= order_amount,
                currency=currency,
                description=description,

                automatic_payment_methods={
                    "enabled": True,
                    "allow_redirects": "never"
                }
            )
            payment.transaction_id = intent.id
            session.add(payment)
            session.flush()
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
            }
        except Exception as e:
            raise Exception(f"Stripe Payment Intent creation failed: {str(e)}")
    
    def verify_payment(self, payload, stripe_signature, session: Session):
        """Verify Stripe webhook signature"""
        try:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, settings.stripe_web_hook_secret
            )
        except ValueError as e:
            raise Exception(f"Invalid payload: {str(e)}")
        except stripe.error.SignatureVerificationError as e:
            raise Exception(f"Invalid signature: {str(e)}")
    
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            transaction_id = payment_intent['id']
            print(f"Payment Intent Succeeded: {transaction_id}")
            payment = session.exec(select(Payment).where(Payment.transaction_id == transaction_id)).first()
            payment.status = "completed"
            session.add(payment)
            order = session.get(Order, payment.order_id)
            order.payment_status = "completed"
            session.add(order)
            session.flush()
            reviewtools : ReviewTools = ReviewTools(order.id, order.user_id, session) # create instance of a class to create review templates
            reviewtools.autoReviews()
            session.commit()
            return {"message": "Payment verified and order updated"}
        else:
            return {"message": f"Unhandled event type: {event['type']}"}
        

