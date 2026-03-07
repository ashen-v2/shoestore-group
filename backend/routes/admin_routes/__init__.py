from fastapi import APIRouter, Depends, HTTPException
from dependancies.dependancies import allow_admin
from routes.admin_routes.ad_product_routes import router as ad_product_router
from routes.admin_routes.ad_user_routes import router as ad_user_router
from routes.admin_routes.ad_cart_routes import router as ad_cart_router
from routes.admin_routes.ad_order_routes import router as ad_order_router
from routes.admin_routes.ad_payment_routes import router as ad_payment_router

from routes.admin_routes.ad_review_routes import router as ad_review_router

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(allow_admin)])
router.include_router(ad_product_router)
router.include_router(ad_user_router)
router.include_router(ad_cart_router)
router.include_router(ad_order_router)
router.include_router(ad_payment_router)
router.include_router(ad_review_router)
