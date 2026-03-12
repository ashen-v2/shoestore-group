from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from models.products import Stock
from db.session import get_session
from models.orders import Cart, CartItem, CartItemRead

router = APIRouter(prefix="/cart", tags=["admin"])

@router.get("/", response_model=list[Cart | None])
def get_cart(session : Session = Depends(get_session), limit : int = 50, skip : int = 0):
    """Get the current user's cart items"""
    cart = session.exec(select(Cart).offset(skip).limit(limit)).all()
    if not cart:
        return []
    
    return cart

@router.get("/{cart_id}", response_model=list[CartItemRead | None])
def get_cart(cart_id : int ,session : Session = Depends(get_session)):
    """Get the current user's cart items"""
    cart = session.get(Cart, cart_id)
    if not cart:
        return []
    
    cart_items = session.exec(
        select(CartItem).where(CartItem.cart_id == cart.id)).all()
    return cart_items

@router.patch("/cartitems/{cart_item_id}", response_model=CartItemRead)
def update_cart_item(cart_item_id : int, session : Session = Depends(get_session), 
                     q : int = Query(default=None, description="New quantity for the cart item")):
    """Update the quantity of a cart item"""
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    stock = session.get(Stock, cart_item.stock_id)
    if q > stock.quantity or q < 1:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    
    cart_item.quantity = q
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return cart_item

@router.delete("/cartitems/{cart_item_id}", status_code=204)
def delete_cart_item(cart_item_id : int, session : Session = Depends(get_session)):
    """Remove an item from the cart"""
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    session.delete(cart_item)
    session.commit()