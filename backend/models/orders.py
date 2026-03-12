from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from enum import Enum

class DELIVERY_STATUS(str, Enum):
    PENDING = "pending"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PAYMENT_STATUS(str,Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    COD_PENDING = "cod_pending"

"""Cart models"""

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

"""Order models"""

class Order(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    user_id : int = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    total_price : float = Field(default=0.0, nullable=False)
    delivery_status : str = Field(default=DELIVERY_STATUS.PENDING, nullable=False)
    payment_status : str = Field(default=PAYMENT_STATUS.PENDING, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class OrderUpdate(SQLModel):
    delivery_status : DELIVERY_STATUS | None = None
    payment_status : PAYMENT_STATUS | None = None


class OrderCreate(SQLModel):
    user_id : int
    total_price : float
    

class OrderItem(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    order_id : int = Field(foreign_key="order.id", nullable=False, ondelete="CASCADE")
    stock_id : int = Field(foreign_key="stock.id", nullable=False, ondelete="CASCADE")
    quantity : int = Field(default=1, nullable=False)
    price_locked : float = Field(default=0.0, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class OrderItemCreate(SQLModel):
    order_id : int
    stock_id : int
    quantity : int

class OrderItemRead(SQLModel):
    id : int
    order_id : int
    stock_id : int
    quantity : int
    price_locked : float

class ReadOrderOrderItems(SQLModel):
    order : Order
    order_items : list[OrderItemRead]