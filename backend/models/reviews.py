from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Review(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    user_id : int = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    product_id : int = Field(foreign_key="product.id", nullable=False, ondelete="CASCADE")
    rating : int = Field(default=5, nullable=False)
    description : str | None = Field(default=None, nullable=True, max_length=300)
    created_at : datetime = Field(default_factory=lambda : datetime.now(timezone.utc), nullable=False)
    order_id : int = Field(foreign_key="order.id", nullable=False, ondelete="CASCADE")
    is_reviewed : bool = Field(default=False, nullable=False)

class ReviewAutoCreate(SQLModel):
    product_id : int
    order_id : int

class ReviewRead(SQLModel):
    id : int
    user_id : int
    product_id : int
    rating : int
    description : str | None
    created_at : datetime
    is_reviewed : bool

class ReviewUpdate(SQLModel):
    rating : int | None = 5
    description : str | None = Field(default=None, nullable=True, max_length=300)
    created_at : datetime = Field(default_factory=lambda : datetime.now(timezone.utc), nullable=False)

class ReviewReadWithProduct(Review):
    user_name : str | None = None
    profile_image_url : str | None = None