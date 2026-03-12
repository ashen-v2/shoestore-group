from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from db.session import get_session
from models.products import Product, wishlist, wishlistRead, ProductRead
from dependancies.dependancies import get_current_user
from models.tokens import TokenData

router : APIRouter = APIRouter( prefix="/wishlist", tags=["wishlist"])

@router.get("/", response_model=list[ProductRead])
def get_wishlist(session : Session = Depends(get_session), current_user: TokenData = Depends(get_current_user), limit : int = 20, skip : int = 0):
    """Get the current user's wishlist items"""
    wishlist_items = session.exec(
        select(wishlist).where(wishlist.user_id == current_user.user_id)
    ).all()
    
    products = []
    for item in wishlist_items:
        product = session.get(Product, item.product_id)
        if product:
            products.append(product)
    
    return products

@router.post("/{product_id}", status_code=201, response_model = wishlistRead)
def add_to_wishlist(product_id: int, session: Session = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    """Add a product to the current user's wishlist"""
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    existing_wishlist_item = session.exec(
        select(wishlist).where(wishlist.user_id == current_user.user_id, wishlist.product_id == product_id)
    ).first()
    if existing_wishlist_item:
        raise HTTPException(status_code=400, detail="Product already in wishlist")
    
    wishlist_item = wishlist(user_id=current_user.user_id, product_id=product_id)
    session.add(wishlist_item)
    session.commit()
    session.refresh(wishlist_item)
    return wishlist_item

@router.delete("/{product_id}", status_code=204)
def remove_from_wishlist(product_id: int, session: Session = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    """Remove a product from the current user's wishlist"""
    wishlist_item = session.exec(
        select(wishlist).where(wishlist.user_id == current_user.user_id, wishlist.product_id == product_id)
    ).first()
    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Product not in wishlist")
    
    session.delete(wishlist_item)
    session.commit()