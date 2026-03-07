from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from enum import Enum

class PAYMENT_METHOD(str, Enum):
    STRIPE = "stripe"
    PAYPAL = "paypal"
    CASH_ON_DELIVERY = "cash_on_delivery"

class PAYMENT_STATUS(str,Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    COD_PENDING = "cod_pending"

class Payment(SQLModel, table=True):
    id : int = Field(primary_key=True, nullable=False)
    order_id : int = Field(foreign_key="order.id", nullable=False, ondelete="CASCADE")
    amount : float = Field(nullable=False)
    method : str = Field(default=PAYMENT_METHOD.CASH_ON_DELIVERY, nullable=False)
    status : str = Field(default=PAYMENT_STATUS.PENDING, nullable=False)
    transaction_id : str | None = Field(default=None, nullable=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class PaymentRequest(SQLModel):
    payment_type : PAYMENT_METHOD

class StripeSecrets(SQLModel):
    client_secret: str
    payment_intent_id: str