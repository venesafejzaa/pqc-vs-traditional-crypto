from fastapi import APIRouter
from app.models.crypto_models import MessageRequest
from app.services.rsa_service import run_rsa_test

router = APIRouter()


@router.post("/run")
def rsa_run(request: MessageRequest):
    return run_rsa_test(request.message)