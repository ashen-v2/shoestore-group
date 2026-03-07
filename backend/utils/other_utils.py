from fastapi import HTTPException
from sqlmodel import Session, select
from models.products import Stock
from models.payments import Payment
from models.users import User
from models.orders import OrderItem, Order
from models.reviews import Review

class ReviewTools:
    def __init__(self,order_id, user_id, session : Session):
        self.session = session
        self.order_id = order_id
        self.user_id = user_id
        self.order : Order = self.session.get(Order, self.order_id)
        self.user : User = self.session.get(User, self.user_id)

        if not self.order:
            raise HTTPException(status_code=404, detail="Order not found")

        if not self.user:
            raise HTTPException(status_code=404, detail="User not found")

    def autoReviews(self):
        if self.order.payment_status == "completed":
            order_items : list[OrderItem] = self.session.exec(select(OrderItem).where(OrderItem.order_id == self.order_id)).all()

            for item in order_items:
                product_id = self.session.exec(select(Stock.product_id).where(Stock.id == item.stock_id)).first()
                existing_review = self.session.exec(select(Review).where(Review.order_id == self.order_id, Review.product_id == product_id)).first()
                
                if existing_review:
                    continue
                review = Review (
                    user_id=self.user_id,
                    product_id= product_id,
                    rating=5,
                    order_id=self.order_id
                )
                self.session.add(review)
            self.session.flush()

