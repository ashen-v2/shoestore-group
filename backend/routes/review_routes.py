from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from dependancies.dependancies import get_current_user
from models.reviews import Review, ReviewRead, ReviewUpdate
from models.products import Product
from models.tokens import TokenData

router : APIRouter = APIRouter( prefix="/reviews", tags=["reviews"])

@router.get("/products/{product_id}", response_model=list[ReviewRead])
def get_product_reviews(product_id : int, session : Session = Depends(get_session), limit : int = 50, skip : int = 0):
    """Get reviews for a product"""
    product : Product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="product not found")
    product_reviews : list[Review] = session.exec(select(Review).where(Review.product_id == product_id, Review.is_reviewed == True )).all()
    return product_reviews

@router.get("/me", response_model=list[ReviewRead])
def get_user_reviews(session : Session = Depends(get_session),current_user : TokenData = Depends(get_current_user), 
                     limit : int = 50, skip : int = 0):
    """Get reviews by the current user"""
    user_reviews : list[Review] = session.exec(select(Review).where(Review.user_id == current_user.user_id)).all()
    return user_reviews
