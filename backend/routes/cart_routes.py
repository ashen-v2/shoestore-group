from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.products import Stock
from models.tokens import TokenData
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Cart, CartItem, CartItemRead

router : APIRouter = APIRouter( prefix="/cart", tags=["cart"])

@router.post("/{stock_id}", response_model=CartItemRead, status_code=201)
def add_to_cart(stock_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Add an item to the current user's cart"""
    cart = session.exec(select(Cart).where(Cart.user_id == current_user.user_id)).first()
    if not cart:
        # Creates a cart if user don't have a one
        cart = Cart(user_id=current_user.user_id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
    # Check if stock is valid
    stock = session.get(Stock, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock item not found")
    # if cart item already exists, increase quantity, otherwise create a new cart item
    cart_item = session.exec(select(CartItem).where(CartItem.cart_id==cart.id, CartItem.stock_id==stock_id)).first()
    if cart_item:
        cart_item.quantity += 1
    else:
        cart_item = CartItem(cart_id=cart.id, stock_id=stock_id, quantity=1)
        session.add(cart_item)
        session.commit()
        session.refresh(cart_item)
    return cart_item