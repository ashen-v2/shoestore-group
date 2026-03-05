from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.tokens import TokenData
from dependancies.dependancies import allow_admin_moderator
from db.session import get_session
from models.products import Product, Stock, StockCreate, StockRead, StockUpdate


router : APIRouter = APIRouter( prefix="/stocks", tags=["stock"])

@router.post("/{product_id}", response_model=StockRead, status_code=201)
def create_stock(product_id: int, stock : StockCreate, session : Session = Depends(get_session), current_user : TokenData = Depends(allow_admin_moderator)):
    """Create a new stock item for a product"""
    
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    statement = select(Stock).where(Stock.product_id == product_id, Stock.size == stock.size)
    existing_stock = session.exec(statement).first()
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock item with this size already exists for the product")
    
    stock_db = stock.model_dump()
    stock_db["product_id"] = product_id
    db_stock = Stock.model_validate(stock_db)
    session.add(db_stock)
    session.commit()
    session.refresh(db_stock)
    return db_stock

@router.get("/{product_id}", response_model=list[StockRead])
def get_stock(product_id: int, session : Session = Depends(get_session)):
    """Get stock items for a product"""
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    stock_items = session.exec(
        select(Stock).where(Stock.product_id == product_id)
    ).all()
    return stock_items

@router.patch("/{stock_id}", response_model=StockRead)
def update_stock(stock_id: int, stock : StockUpdate, session : Session = Depends(get_session), current_user : TokenData = Depends(allow_admin_moderator)):
    """Update a stock item"""
    db_stock = session.get(Stock, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock item not found")
    
    stock_data = stock.model_dump(exclude_unset=True)
    for key, value in stock_data.items():
        setattr(db_stock, key, value)
    
    session.add(db_stock)
    session.commit()
    session.refresh(db_stock)
    return db_stock

