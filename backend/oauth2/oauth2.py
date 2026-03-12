from fastapi import HTTPException
import jwt
from config import settings
from models.tokens import TokenData

SECRET_KEY : str  = settings.secret_key
ALGORITHEM : str = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES : int = settings.access_token_expire_minutes


def create_access_token(data : dict):
    """Create a JWT access token."""
    to_encode : dict = data.copy()
    encoded_jwt : str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHEM)
    return encoded_jwt

def verify_access_token(token: str) -> TokenData:
    """Verify the JWT access token and return the payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHEM])
        return TokenData(user_id=payload.get("user_id"), role=payload.get("role"))
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token") from e
    

