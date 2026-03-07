from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from db.session import get_session
from models.products import Product, ProductCreate, ProductUpdate
from models.tokens import TokenData
from dependancies.dependancies import get_current_user, allow_admin, allow_admin_moderator


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

    
@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, session: Session = Depends(get_session)):
    """Get a product by ID"""
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product