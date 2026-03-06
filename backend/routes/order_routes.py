from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.tokens import TokenData
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Order, OrderItem, OrderItemRead


router : APIRouter = APIRouter( prefix="/orders", tags=["orders"])

@router.get("/", response_model=list[Order] | None)
def get_orders(session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user), limit : int = 20, skip : int = 0):
    """Get the current user's orders"""
    db_orders = session.exec(select(Order).where(Order.user_id == current_user.user_id).offset(skip).limit(limit)).all()
    return db_orders

@router.get("/{order_id}", status_code=200)
def get_order(order_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Get an order by ID"""
    order = session.get(Order, order_id)
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this order")
    order_items = session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    return order, order_items

@router.post("/", status_code=200)
def create_order(order_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Create an order"""
    pass
    
