from fastapi import APIRouter, Query
from app.services.mlkem_service import run_mlkem_test

router = APIRouter()

@router.post("/run")
def mlkem_run(message: str = Query(..., min_length=1)):
    return run_mlkem_test(message)