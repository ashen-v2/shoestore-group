from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from dependancies.dependancies import get_current_user, allow_admin
from db.session import get_session
from models.users import UserCreate, User, UserRead, UserUpdate
from models.tokens import TokenData, TokenBase
from utils import hash_password, verify_password
from oauth2 import create_access_token
from utils import DUMMY_HASH

router : APIRouter = APIRouter( prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def get_current_user_info(session: Session = Depends(get_session), current_user: TokenData = Depends(get_current_user)):
    """Get the current user's information"""
    user = session.get(User, current_user.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

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
    
@router.patch("/me", response_model=UserRead)
def user_update(user_update : UserUpdate, session : Session = Depends(get_session), current_user : TokenData = Depends(get_current_user)):
    """Update the current user's information"""
    user = session.get(User, current_user.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_update.model_dump(exclude_unset=True)  
    for key, value in user_data.items():
        setattr(user, key, value)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

