from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from models.users import User, UserUpdate, UserRead

router = APIRouter(prefix="/users", tags=["admin"])

@router.get("/", response_model=list[User], status_code=200) #previously GET/users
def get_users(session: Session = Depends(get_session), limit: int = 50, skip: int = 0 ):
    """Get all users"""
    users = session.exec(select(User).offset(skip).limit(limit)).all() 
    return users

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, session: Session = Depends(get_session)):
    """Delete a user"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return

@router.patch("/{user_id}", response_model=UserRead)
def user_update(user_id : int, user_update : UserUpdate, session : Session = Depends(get_session)):
    """Update any  user's information"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_update.model_dump(exclude_unset=True)  
    for key, value in user_data.items():
        setattr(user, key, value)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

