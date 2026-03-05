from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from db.session import get_session
from models.products import Product, ProductCreate
from models.tokens import TokenData
from dependancies.dependancies import get_current_user, allow_admin


router : APIRouter = APIRouter( prefix="/products", tags=["products"])

@router.get("/", response_model=list[Product])
def get_products(session : Session = Depends(get_session), 
                 q : str = Query(default=None, description="Search query for product name or brand"),
                 limit : int = 20, skip : int = 0):
    """Get all products
    - **q**: Optional search query to filter products by name or brand
    - **limit**: Maximum number of products to return (default: 20)
    - **skip**: Number of products to skip (default: 0)"""
    if q:
        products = session.exec(
            select(Product).where(
                (Product.name.ilike(f"%{q}%")) | (Product.brand.ilike(f"%{q}%"))
            ).offset(skip).limit(limit)
        ).all()
        return products
    products = session.exec(select(Product).offset(skip).limit(limit)).all()
    return products

    
   

@router.post("/", response_model=Product, status_code=201)
def create_product(product: ProductCreate, session=Depends(get_session), current_user : TokenData = Depends(allow_admin)):
    """Create a new product"""
    try:
        db_product = Product.model_validate(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=400, detail="Product creation failed")
    
    
