from fastapi import APIRouter, Depends, HTTPException

router : APIRouter = APIRouter( prefix="/products", tags=["products"])

@router.get("/")
def get_products():
    return {"message": "Get all products"}