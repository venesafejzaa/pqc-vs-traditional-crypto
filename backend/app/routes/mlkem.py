from fastapi import APIRouter
from app.services.mlkem_service import run_mlkem_test

router = APIRouter()


@router.post("/run")
def mlkem_run():
    return run_mlkem_test()