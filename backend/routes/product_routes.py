from fastapi import APIRouter, Depends, HTTPException
from db.session import get_session
from models.products import Product, ProductCreate
from dependancies.dependancies import get_current_user, allow_admin


router : APIRouter = APIRouter( prefix="/products", tags=["products"])

@router.get("/")
def get_products():
    return {"message": "Get all products"}

@router.post("/", response_model=Product, status_code=201)
def create_product(product: ProductCreate, Session=Depends(get_session), current_user = Depends(allow_admin)):
    """Create a new product"""
    try:
        db_product = Product.model_validate(product)
        Session.add(db_product)
        Session.commit()
        Session.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=400, detail="Product creation failed")
