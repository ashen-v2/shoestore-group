from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
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