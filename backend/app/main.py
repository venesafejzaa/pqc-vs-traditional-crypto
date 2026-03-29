from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import rsa, mlkem, rsa_signature, mldsa_signature, benchmark

app = FastAPI(
    title="PQC vs Traditional Crypto API",
    version="1.0.0",
    docs_url="/swagger",
    redoc_url=None,
    description="Backend API for comparing traditional cryptography and post-quantum cryptography."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rsa.router, prefix="/api/rsa", tags=["RSA Encryption"])
app.include_router(mlkem.router, prefix="/api/mlkem", tags=["ML-KEM Encryption"])
app.include_router(rsa_signature.router, prefix="/api/rsa-signature", tags=["RSA Signature"])
app.include_router(mldsa_signature.router, prefix="/api/mldsa-signature", tags=["ML-DSA Signature"])
app.include_router(benchmark.router, prefix="/api/benchmark", tags=["Benchmark"])


@app.get("/")
def root():
    return {
        "message": "PQC vs Traditional Crypto backend is running"
    }