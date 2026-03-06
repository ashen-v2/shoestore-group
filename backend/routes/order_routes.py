from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.tokens import TokenData
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Order, OrderItem


router : APIRouter = APIRouter( prefix="/orders", tags=["orders"])

@router.get("/", response_model=list[Order] | None)
def get_orders(session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user), limit : int = 20, skip : int = 0):
    """Get the current user's orders"""
    db_orders = session.exec(select(Order).where(Order.user_id == current_user.user_id).offset(skip).limit(limit)).all()
    return db_orders
