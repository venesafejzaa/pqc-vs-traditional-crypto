from fastapi import APIRouter, Query
from app.services.benchmark_service import run_kem_benchmark

router = APIRouter()


@router.get("/kem")
def kem_benchmark(iterations: int = Query(10)):
    return run_kem_benchmark(iterations)