from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PQC vs Traditional Crypto API",
    docs_url="/swagger",  
    redoc_url=None       
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/algorithms")
def algorithms():
    return {
        "traditional": ["RSA", "ECDSA"],
        "post_quantum": ["ML-KEM", "ML-DSA"]
    }