from fastapi import Depends, FastAPI
from fastapi.concurrency import asynccontextmanager
from db.session import engine, get_session
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes, product_routes, stock_routes, cart_routes, issueticket_routes
from routes import order_routes, payment_routes, admin_routes,wishlist_routes, review_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with engine.connect() as conn:
            print("Connection to PostgreSQL database successful!")
    except Exception as e:
        print(f"Error connecting to PostgreSQL database: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router)
app.include_router(product_routes.router)
app.include_router(stock_routes.router)
app.include_router(cart_routes.router)
app.include_router(order_routes.router)
app.include_router(payment_routes.router)
app.include_router(admin_routes.router)
app.include_router(wishlist_routes.router)
app.include_router(review_routes.router)
app.include_router(issueticket_routes.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
