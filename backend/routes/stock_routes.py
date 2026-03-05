from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from models.tokens import TokenData
from dependancies.dependancies import allow_admin_moderator
from db.session import get_session
from models.products import Product, Stock, StockCreate, StockRead


router : APIRouter = APIRouter( prefix="/stocks", tags=["stock"])

@router.post("/{product_id}", response_model=StockRead, status_code=201)
def create_stock(product_id: int, stock : StockCreate, session : Session = Depends(get_session), current_user : TokenData = Depends(allow_admin_moderator)):
    """Create a new stock item for a product"""
    
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    stock_db = stock.model_dump()
    stock_db["product_id"] = product_id
    db_stock = Stock.model_validate(stock_db)
    session.add(db_stock)
    session.commit()
    session.refresh(db_stock)
    return db_stock

