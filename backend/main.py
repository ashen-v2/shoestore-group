from fastapi import Depends, FastAPI
from fastapi.concurrency import asynccontextmanager
from db.session import engine, get_session
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes


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

@app.get("/")
async def root():
    return {"message": "Hello World"}