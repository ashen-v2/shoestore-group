from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from dependancies.dependancies import get_current_user
from models.reviews import Review, ReviewRead, ReviewUpdate
from models.products import Product

router : APIRouter = APIRouter( prefix="/reviews", tags=["reviews"])

@router.get("/products/{product_id}", response_model=list[ReviewRead])
def get_product_reviews(product_id : int, session : Session = Depends(get_session), limit : int = 50, skip : int = 0):
    product : Product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="product not found")
    product_reviews : list[Review] = session.exec(select(Review).where(Review.product_id == product_id, Review.is_reviewed == True )).all()
    return product_reviews

