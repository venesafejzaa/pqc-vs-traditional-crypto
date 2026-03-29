from fastapi import APIRouter
from app.models.crypto_models import MessageRequest
from app.services.mlkem_service import run_mlkem_test

router = APIRouter()


@router.post("/run")
def mlkem_run(request: MessageRequest):
    return run_mlkem_test(request.message)