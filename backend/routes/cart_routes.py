from fastapi import APIRouter, Depends, HTTPException, Query, Query
from sqlmodel import Session, select
from models.products import Stock
from models.tokens import TokenData
from dependancies.dependancies import get_current_user
from db.session import get_session
from models.orders import Cart, CartItem, CartItemRead

router : APIRouter = APIRouter( prefix="/cart", tags=["cart"])


@router.get("/", response_model=list[CartItemRead | None])
def get_cart(session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Get the current user's cart items"""
    cart = session.exec(select(Cart).where(Cart.user_id == current_user.user_id)).first()
    if not cart:
        return []
    
    cart_items = session.exec(
        select(CartItem).where(CartItem.cart_id == cart.id)).all()
    return cart_items

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

    if cart_item is not None and cart_item.quantity >= stock.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    if cart_item:
        cart_item.quantity += 1
        session.add(cart_item)
        session.commit()
        session.refresh(cart_item)
    else:
        cart_item = CartItem(cart_id=cart.id, stock_id=stock_id, quantity=1)
        session.add(cart_item)
        session.commit()
        session.refresh(cart_item)
    return cart_item

@router.patch("/{cart_item_id}", response_model=CartItemRead)
def update_cart_item(cart_item_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user), 
                     q : int = Query(default=None, description="New quantity for the cart item")):
    """Update the quantity of a cart item"""
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart = session.get(Cart, cart_item.cart_id)
    if cart.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this cart item")
    
    stock = session.get(Stock, cart_item.stock_id)
    if q > stock.quantity or q < 1:
        raise HTTPException(status_code=400, detail="Not enough stock available")
    
    cart_item.quantity = q
    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return cart_item

@router.delete("/{cart_item_id}", status_code=204)
def delete_cart_item(cart_item_id : int, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Remove an item from the cart"""
    cart_item = session.get(CartItem, cart_item_id)
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    cart = session.get(Cart, cart_item.cart_id)
    if cart.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this cart item")
    session.delete(cart_item)
    session.commit()