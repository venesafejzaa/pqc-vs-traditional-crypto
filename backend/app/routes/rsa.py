from fastapi import APIRouter, Query
from app.services.rsa_service import run_rsa_test

router = APIRouter()


@router.post("/run")
def rsa_run(message: str = Query(..., min_length=1)):
    return run_rsa_test(message)