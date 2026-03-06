from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.tokens import TokenData
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Order, OrderItem, OrderItemRead, OrderCreate, Cart, CartItem, ReadOrderOrderItems
from models.products import Product, Stock



router : APIRouter = APIRouter( prefix="/orders", tags=["orders"])

@router.get("/", response_model=list[Order] | None)
def get_orders(session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user), limit : int = 20, skip : int = 0):
    """Get the current user's orders"""
    db_orders = session.exec(select(Order).where(Order.user_id == current_user.user_id).offset(skip).limit(limit)).all()
    return db_orders

@router.get("/{order_id}", status_code=200, response_model=ReadOrderOrderItems)
def get_order(order_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Get an order by ID"""
    order = session.get(Order, order_id)
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this order")
    order_items = session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    return ReadOrderOrderItems(order=order, order_items=order_items)

@router.post("/", status_code=200)
def create_order( session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Create an order"""
    cart = session.exec(select(Cart).where(Cart.user_id == current_user.user_id)).first()
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    order = Order(user_id=current_user.user_id)
    session.add(order)
    session.commit()
    session.refresh(order)

    total_price = 0.0
    cart_items : list[CartItem] = session.exec(select(CartItem).where(CartItem.cart_id == cart.id)).all()
    for cart_item in cart_items:
        if cart_item.quantity < 1 :
            continue
        stock : Stock = session.get(Stock,cart_item.stock_id) # stock should exist because of foreign key constraint
        price_at_purchase = session.exec(select(Product.price).where(Product.id == stock.product_id)).first()
        order_item = OrderItem(order_id=order.id, stock_id=cart_item.stock_id, quantity=cart_item.quantity, price_locked=price_at_purchase)
        total_price += price_at_purchase * cart_item.quantity
        session.add(order_item)
        stock.quantity -= order_item.quantity
        session.add(stock)
        session.delete(cart_item)
    
    order.total_price = total_price
    session.commit()
    session.refresh(order)
    return order

@router.delete("/{order_id}", status_code=204)
def delete_order(order_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Delete an order by ID"""
    order : Order = session.get(Order, order_id)
    if not order or order.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.payment_status != "pending" and order.delivery_status != "pending":
        raise HTTPException(status_code=400, detail="Only pending orders can be deleted")
    
    order_items : list[OrderItem] = session.exec(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    for order_item in order_items :
        stock : Stock = session.get(Stock, order_item.stock_id)
        stock.quantity += order_item.quantity
        session.add(stock)
    
    session.delete(order)
    session.commit()
    return
    
    
