from sqlmodel import SQLModel, Field
from enum import Enum
from datetime import datetime, timezone

class TICKET_STATUS(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class SUBJECTS(str, Enum):
    DELIVERY_ISSUE = "Delivery Issue"
    PRODUCT_ISSUE = "Product Issue"
    PAYMENT_ISSUE = "Payment Issue"
    OTHER = "Other"

class IssueTicket(SQLModel, table=True):
    id : int = Field(default=None, primary_key=True)
    user_id : int = Field(foreign_key="user.id", nullable=False)
    order_id : int = Field(foreign_key="order.id", nullable=False)
    subject : SUBJECTS = Field(default=SUBJECTS.OTHER, nullable=False)
    description : str = Field(nullable=False)
    status : TICKET_STATUS = Field(default=TICKET_STATUS.OPEN, nullable=False)
    created_at : datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at : datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)

class IssueTicketCreate(SQLModel):
    subject : SUBJECTS
    description : str