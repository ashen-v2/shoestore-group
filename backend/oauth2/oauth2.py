from fastapi import Depends, HTTPException
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError
from config import settings

SECRET_KEY : str  = settings.secret_key
ALGORITHEM : str = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES : int = settings.access_token_expire_minutes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_scess_token(data : dict):
    """Create a JWT access token."""
    to_encode : dict = data.copy()
    encoded_jwt : str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHEM)
    return encoded_jwt

def verify_access_token(token: str):
    """Verify the JWT access token and return the payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHEM])
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e
    
def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from the JWT access token."""
    try:
        payload = verify_access_token(token)
        user_id : str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
