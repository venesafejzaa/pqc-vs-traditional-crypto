from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import mlkem
from app.routes import rsa

app = FastAPI(
    title="Crypto Comparison API",
    docs_url="/swagger",
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rsa.router, prefix="/api/rsa", tags=["RSA"])
app.include_router(mlkem.router, prefix="/api/mlkem", tags=["ML-KEM"])


@app.get("/")
def root():
    return {"message": "API is running"}