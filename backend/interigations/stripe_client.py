from config.config import settings
import stripe
from models.orders import Order
from models.payments import Payment
from sqlmodel import Session

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