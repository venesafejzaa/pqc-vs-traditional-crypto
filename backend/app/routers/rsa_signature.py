from fastapi import APIRouter
from app.models.crypto_models import MessageRequest
from app.services.rsa_signature_service import run_rsa_signature_test

router = APIRouter()


@router.post("/run")
def rsa_signature_run(request: MessageRequest):
    return run_rsa_signature_test(request.message)