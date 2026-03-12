from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from utils.other_utils import ReviewTools
from models.payments import Payment, PaymentUpdate
from models.orders import Order
from db.session import get_session

router = APIRouter(prefix="/payments", tags=["admin"])

@router.get("/", response_model=list[Payment])
def get_payments(session: Session = Depends(get_session), limit: int = 50, skip: int = 0):
    """Get all payments"""
    payments = session.exec(select(Payment).offset(skip).limit(limit)).all()
    return payments

@router.patch("/{payment_id}", response_model=Payment)
def update_payment(payment_id: int, payment_update: PaymentUpdate, session: Session = Depends(get_session)):
    """Update a specific payment"""
    payment = session.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment_data = payment_update.model_dump(exclude_unset=True)
    for key, value in payment_data.items():
        setattr(payment, key, value)
        if key == "status":
            try:
                order : Order = session.get(Order, payment.order_id)
                order.payment_status = value
                session.add(order)
                session.flush()
                reviewtools : ReviewTools = ReviewTools(order.id, order.user_id, session) # create instance of a class to create review templates
                reviewtools.autoReviews()
            except Exception as e:
                session.rollback()
                raise HTTPException(status_code=500, detail="Failed to update order payment status") from e

    
    session.add(payment)
    session.commit()
    session.refresh(payment)
    return payment

@router.delete("/{payment_id}", status_code=204)
def delete_payment(payment_id: int, session: Session = Depends(get_session)):
    """Delete a specific payment"""
    payment = session.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    session.delete(payment)
    session.commit()
