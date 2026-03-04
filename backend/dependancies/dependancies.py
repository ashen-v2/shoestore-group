from fastapi import Depends, HTTPException
from models.tokens import TokenData
from oauth2.oauth2 import verify_access_token
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    """Get the current user from the JWT access token."""
    try:
        payload = verify_access_token(token)
        user_id : int = payload.user_id
        role : int = payload.role
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")