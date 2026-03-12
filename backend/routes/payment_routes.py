from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlmodel import Session, select
from models.users import User
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Order
from models.payments import Payment, PaymentRequest, PAYMENT_METHOD, PAYMENT_STATUS, StripeSecrets
from models.tokens import TokenData
from interigations.stripe_client import StripeClient
from template_engine.ordertemplates import render_order_email
from interigations.emails.mailtrap_client import MailtrapClient


router : APIRouter = APIRouter( prefix="/payments", tags=["payments"])

stripe_client : StripeClient = StripeClient()
mailtrap_client : MailtrapClient = MailtrapClient()


@router.post("/webhook")
async def stripe_webhook(request: Request, 
stripe_signature = Header(None), session: Session = Depends(get_session)):
    """Stripe webhook endpoint to handle payment events"""
    payload = await request.body()
    status : dict = stripe_client.verify_payment(payload, stripe_signature,session)
    return status

@router.post("/{order_id}",status_code=201)
def create_payment(order_id : int, payment_method : PaymentRequest, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Create payment for order"""
    order : Order = session.get(Order, order_id)
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Invalid Order")
    
    user : User = session.get(User, current_user.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_email : str = user.email
    user_name : str = user.name

    # order_email template data
    email_data : dict = {"customer_name": user_name, 
                         "order_id": order_id, "amount": order.total_price, 
                         "date": order.created_at,
                         "order_url": f"http://localhost:5173/orders"}
    
    match payment_method.payment_type:
        case PAYMENT_METHOD.CASH_ON_DELIVERY:
            payment : Payment = Payment(order_id=order_id, amount=order.total_price, method=payment_method.payment_type, status=PAYMENT_STATUS.COD_PENDING)
            session.add(payment)
            order.payment_status = PAYMENT_STATUS.COD_PENDING
            session.add(order)
            session.commit()
            session.refresh(payment)

            #send email
            mailtrap_client.send_email(to_email=user_email, 
                                       subject="Payment Successfull",
                                       html_content=render_order_email(email_data), 
                                       text_content=f"Dear {user_name},\n\nThank you for your order #{order_id}. Your order total is ${order.total_price} and it will be delivered to you soon.\n\nBest regards,\nElased Team"  )
            return payment
        case PAYMENT_METHOD.STRIPE:
            
            payment : Payment = Payment(order_id=order_id, amount=order.total_price, method=payment_method.payment_type, status=PAYMENT_STATUS.PENDING)
            # client_secret, payment_intent_id = stripe_client.create_payment_intent(order.total_price, payment, session)
            stripe_response = stripe_client.create_payment_intent(order.total_price, payment, session)
            client_secret = stripe_response["client_secret"]
            payment_intent_id = stripe_response["payment_intent_id"]
            stripe_secrets : StripeSecrets = StripeSecrets(client_secret=client_secret, payment_intent_id=payment_intent_id)
            order.payment_status = PAYMENT_STATUS.PENDING
            session.add(order)
            session.commit()
            session.refresh(payment)
        
            return stripe_secrets
        
   

    
