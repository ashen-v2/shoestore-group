from sqlmodel import SQLModel

class TokenBase(SQLModel):
    access_token: str
    token_type: str

