from typing import List

from sqlmodel import Enum, Relationship, SQLModel, Field
from datetime import datetime, timezone

class ProductCategory(str, Enum):
    CASUAL = "casual"
    FORMAL = "formal"
    SPORTS = "sports"
    UNCATEGORIZED = "uncategorized"
    

class Product(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    brand: str = Field(nullable=False)
    category: str = Field(default=ProductCategory.UNCATEGORIZED, nullable=False)
    price: float = Field(nullable=False)
    image_url: str = Field(default="https://placehold.co/600x400", nullable=False)
    created_at: datetime = Field(default_factory=lambda : datetime.now(timezone.utc), nullable=False)
    

class ProductCreate(SQLModel):
    name: str 
    brand: str
    category: str = Field(default=ProductCategory.UNCATEGORIZED, nullable=False)
    price: float 
    image_url: str | None = Field(default="https://placehold.co/600x400", nullable=True)

class ProductRead(Product):
    pass

class ProductUpdate(SQLModel):
    name: str | None = None
    brand: str | None = None
    category: str | None = None
    price: float | None = None
    image_url: str | None = None


"""Stock models"""

class StockBase(SQLModel):
    size : float = Field(nullable=False)
    quantity : int = Field(default = 0, nullable=False)

class Stock(StockBase, table=True):
    id : int = Field(default=None, primary_key=True)
    product_id : int = Field(foreign_key="product.id", nullable=False, ondelete="CASCADE")
    created_at : datetime = Field(default_factory=lambda : datetime.now(timezone.utc), nullable=False)

class StockRead(StockBase):
    id : int
    product_id : int

class StockCreate(StockBase):
    pass

class StockUpdate(SQLModel):
    size : float | None = None
    quantity : int | None = None

class wishlist(SQLModel, table=True):
    id : int = Field(default=None, primary_key=True)
    user_id : int = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    product_id : int = Field(foreign_key="product.id", nullable=False, ondelete="CASCADE")
    created_at : datetime = Field(default_factory=lambda : datetime.now(timezone.utc), nullable=False)
    
