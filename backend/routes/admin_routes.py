from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from db.session import get_session
from models.users import User
from models.products import Product, ProductCreate
from dependancies.dependancies import allow_admin
from models.tokens import TokenData

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(allow_admin)])



@router.get("/users", response_model=list[User], status_code=200) #previously GET/users
def get_users(session: Session = Depends(get_session), limit: int = 50, skip: int = 0 ):
    """Get all users"""
    users = session.exec(select(User).offset(skip).limit(limit)).all() 
    return users

@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, session: Session = Depends(get_session)):
    """Delete a user"""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    session.delete(user)
    session.commit()
    return {"message": "User deleted successfully"}

@router.post("/products", response_model=Product, status_code=201) #previously POST/products
def create_product(product: ProductCreate, session=Depends(get_session)):
    """Create a new product"""
    try:
        db_product = Product.model_validate(product)
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        return db_product
    except Exception as e:
        raise HTTPException(status_code=400, detail="Product creation failed")

@router.delete("/products/{product_id}", status_code=204) #previously DELETE/products/{product_id}
def delete_product(product_id: int, session : Session = Depends(get_session)):
    """Delete a product by ID"""
    product = session.get(Product,product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return
