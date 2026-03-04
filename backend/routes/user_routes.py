from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from dependancies.dependancies import get_current_user, allow_admin
from db.session import get_session
from models.users import UserCreate, User, UserRead
from models.tokens import TokenData, TokenBase
from utils import hash_password, verify_password
from oauth2 import create_access_token
from utils import DUMMY_HASH

router : APIRouter = APIRouter( prefix="/users", tags=["users"])

@router.get("/", response_model=list[User] )
def get_users(session: Session = Depends(get_session),  cur_user : TokenData = Depends(allow_admin) ):
    """Get all users"""
    users = session.exec(select(User)).all()
    return users

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
    
@router.post("/login", response_model=TokenBase)
def login( userlogin : OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """Login a user"""
    try:
        user = session.exec(select(User).where(User.email == userlogin.username)).first()
        if not user or not verify_password(userlogin.password, user.password):
            verify_password(userlogin.password, DUMMY_HASH)
            raise HTTPException(status_code=400, detail="Invalid email or password")
        
        access_token = create_access_token(data={"user_id": user.id, "role": user.role})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Login failed")


