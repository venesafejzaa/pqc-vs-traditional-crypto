from fastapi import APIRouter
from app.models.crypto_models import MessageRequest
from app.services.benchmark_service import (
    compare_encryption_algorithms,
    compare_signature_algorithms
)

router = APIRouter()


@router.post("/encryption")
def benchmark_encryption(request: MessageRequest):
    return compare_encryption_algorithms(request.message)


@router.post("/signature")
def benchmark_signature(request: MessageRequest):
    return compare_signature_algorithms(request.message)