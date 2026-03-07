from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from db.session import get_session
from models.orders import Order, OrderItem, OrderUpdate

router = APIRouter(prefix="/orders", tags=["admin"])

@router.get("/", response_model=list[Order])
def get_orders(session: Session = Depends(get_session), limit: int = 50, skip: int = 0):
    """Get all orders"""
    orders = session.exec(select(Order).offset(skip).limit(limit)).all()
    return orders

@router.get("/{order_id}", response_model=list[OrderItem])
def get_order_items(order_id: int, session: Session = Depends(get_session)):
    """Get order items for a specific order"""
    order_items = session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    if not order_items:
        raise HTTPException(status_code=404, detail="Order not found")
    return order_items

@router.patch("/{order_id}", response_model=Order)
def update_order(order_id: int, order_update: OrderUpdate, session: Session = Depends(get_session)):
    """update order payment, delivery Status"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order_data = order_update.model_dump(exclude_unset=True)  
    for key, value in order_data.items():
        setattr(order, key, value)
    
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

@router.delete("/{order_id}", status_code=204)
def delete_order(order_id: int, session: Session = Depends(get_session)):
    """Delete an order"""
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    session.delete(order)
    session.commit()

@router.delete("/orderitems/{order_item_id}", status_code=204)
def delete_order_item(order_item_id: int, session: Session = Depends(get_session)):
    """Delete an order item"""
    order_item = session.get(OrderItem, order_item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    session.delete(order_item)
    session.commit()