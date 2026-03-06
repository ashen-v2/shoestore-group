from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Order
from models.payments import Payment, PaymentRequest, PAYMENT_METHOD, PAYMENT_STATUS
from models.tokens import TokenData

router : APIRouter = APIRouter( prefix="/payments", tags=["payments"])

@router.post("/{order_id}",status_code=201)
def create_payment(order_id : int, payment_method : PaymentRequest, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Create payment for order"""
    order : Order = session.get(Order, order_id)
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Invalid Order")
    
    match payment_method.payment_type:
        case PAYMENT_METHOD.CASH_ON_DELIVERY:
            payment : Payment = Payment(order_id=order_id, amount=order.total_price, method=payment_method.payment_type, status=PAYMENT_STATUS.COD_PENDING)
            session.add(payment)
            order.payment_status = PAYMENT_STATUS.COD_PENDING
            session.add(order)
            session.commit()
            session.refresh(payment)
            return payment
        case PAYMENT_METHOD.STRIPE:
            pass

    
