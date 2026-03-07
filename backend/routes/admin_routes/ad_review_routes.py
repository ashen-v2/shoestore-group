from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from models.users import User
from models.reviews import Review

router = APIRouter(prefix="/reviews", tags=["admin"])

@router.get("/users/{user_id}", response_model=list[Review], status_code=200)
def get_user_reviews(user_id : int , session : Session = Depends(get_session), limit : int = 50, skip : int = 0):
    """Get any user's reviews"""
    user : User = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user_not_found")
    user_reviews : list[Review] = session.exec(select(Review).where(Review.user_id == user_id)).all()
    return user_reviews

@router.delete("/{review_id}", status_code=201)
def delete_reviews(review_id : int, session : Session = Depends(get_session)):
    """Delete any review"""
    review : Review = session.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="review not found")
    session.delete(review)
    session.commit()
    return