from datetime import datetime, timezone
from sqlmodel import SQLModel, Field
from pydantic import EmailStr

class UserBase(SQLModel):
    name: str = Field(max_length=100, nullable=False)
    email: EmailStr = Field(max_length=100 , nullable=False, unique=True)
    profile_image_url: str = Field(default="https://api.dicebear.com/9.x/multiavatar/svg?seed=ANY_RANDOM_STRING", nullable=True)

class UserRead(UserBase):
    address: str = Field(max_length=200, nullable=False)

class UserCreate(UserRead):
    password: str = Field(max_length=100, nullable=False)
    
class User(UserCreate, table=True):
    id: int = Field(default=None, primary_key=True)
    role: int = Field(default=1,nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class UserLogin(SQLModel):
    email: EmailStr = Field(max_length=100 , nullable=False)
    password: str = Field(max_length=100, nullable=False)

class Userupdate(UserBase):
    pass


