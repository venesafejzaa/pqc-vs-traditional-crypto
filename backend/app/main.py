from fastapi import FastAPI

from app.routes import mlkem
from app.routes import rsa
from app.routes import benchmark

app = FastAPI(
    title="Crypto Comparison API",
    docs_url="/swagger",  
    redoc_url=None       
)

app.include_router(rsa.router, prefix="/api/rsa", tags=["RSA"])
app.include_router(mlkem.router, prefix="/api/mlkem", tags=["ML-KEM"])
app.include_router(benchmark.router, prefix="/api/benchmark", tags=["Benchmark"])

@app.get("/")
def root():
    return {"message": "API is running"}