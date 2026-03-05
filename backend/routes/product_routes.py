from fastapi import APIRouter, Depends, HTTPException
from db.session import get_session
from models.products import Product, ProductCreate


router : APIRouter = APIRouter( prefix="/products", tags=["products"])

@router.get("/")
def get_products():
    return {"message": "Get all products"}

@router.post("/", response_model=Product, status_code=201)
def create_product(product: ProductCreate, Session=Depends(get_session)):
    """Create a new product"""
    try:
        db_product = Product.model_validate(product)
        Session.add(db_product)
        Session.commit()
        Session.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=400, detail="Product creation failed")
