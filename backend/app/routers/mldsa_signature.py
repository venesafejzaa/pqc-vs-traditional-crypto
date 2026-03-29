from fastapi import APIRouter
from app.models.crypto_models import MessageRequest
from app.services.mldsa_signature_service import run_mldsa_signature_test

router = APIRouter()


@router.post("/run")
def mldsa_signature_run(request: MessageRequest):
    return run_mldsa_signature_test(request.message)