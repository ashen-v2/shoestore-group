from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from db.session import get_session
from models.users import UserCreate, User, UserRead
from utils import hash_password

router : APIRouter = APIRouter( prefix="/users", tags=["users"])

@router.get("/")
def get_users():
    return {"message": "Get all users"}

@router.post("/", response_model=UserRead, status_code=201)
def register(user : UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    try:
        db_user = User.model_validate(user)
        db_user.password = hash_password(db_user.password)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail="User registration failed")