from fastapi import APIRouter, Depends, HTTPException
from dependancies.dependancies import allow_admin
from routes.admin_routes.ad_product_routes import router as ad_product_router
from routes.admin_routes.ad_user_routes import router as ad_user_router

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(allow_admin)])
router.include_router(ad_product_router)
router.include_router(ad_user_router)