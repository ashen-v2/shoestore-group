from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from models.products import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["admin"])

@router.post("/", response_model=Product, status_code=201) #previously POST/products
def create_product(product: ProductCreate, session : Session = Depends(get_session)):
    """Create a new product"""
    try:
        db_product = Product.model_validate(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=400, detail="Product creation failed")

@router.delete("/{product_id}", status_code=204) #previously DELETE/products/{product_id}
def delete_product(product_id: int, session : Session = Depends(get_session)):
    """Delete a product by ID"""
    product = session.get(Product,product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return

@router.patch("/{product_id}", response_model=Product, status_code=200) #previously PATCH/products/{product_id}
def update_product(product_id: int, product: ProductUpdate, session: Session = Depends(get_session)):
    """Update a product by ID"""
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = product.model_dump(exclude_unset=True)
    for key, value in updated_product.items():
        setattr(db_product, key, value)
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product