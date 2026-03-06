from sqlmodel import SQLModel, Field
from datetime import datetime, timezone

class Cart(SQLModel, table=True):
    id: int = Field(primary_key=True, nullable=False)
    user_id: int = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)


class CartItem(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    cart_id : int = Field(foreign_key="cart.id", nullable=False, ondelete="CASCADE")
    stock_id : int = Field(foreign_key="stock.id", nullable=False, ondelete="CASCADE")
    quantity : int = Field(default=1, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class CartItemRead(SQLModel):
    id : int
    cart_id : int
    stock_id : int
    quantity : int

class Order(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    user_id : int = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    total_price : float = Field(default=0.0, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class OrderItem(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    order_id : int = Field(foreign_key="order.id", nullable=False, ondelete="CASCADE")
    stock_id : int = Field(foreign_key="stock.id", nullable=False, ondelete="CASCADE")
    quantity : int = Field(default=1, nullable=False)
    price_locked : float = Field(default=0.0, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)