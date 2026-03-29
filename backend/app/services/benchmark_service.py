from app.services.rsa_service import run_rsa_test
from app.services.mlkem_service import run_mlkem_test
from app.services.rsa_signature_service import run_rsa_signature_test
from app.services.mldsa_signature_service import run_mldsa_signature_test


def compare_encryption_algorithms(message: str):
    rsa_result = run_rsa_test(message)
    mlkem_result = run_mlkem_test(message)

    rsa_total = rsa_result["performance"]["total_ms"]
    mlkem_total = mlkem_result["performance"]["total_ms"]

    if rsa_total < mlkem_total:
        faster = "RSA-2048 + AES-256-GCM"
    elif mlkem_total < rsa_total:
        faster = "ML-KEM-768 + AES-256-GCM"
    else:
        faster = "Tie"

    return {
        "comparison_type": "encryption",
        "message": message,
        "rsa": rsa_result,
        "mlkem": mlkem_result,
        "summary": {
            "faster_algorithm": faster,
            "rsa_total_ms": rsa_total,
            "mlkem_total_ms": mlkem_total,
            "difference_ms": round(abs(rsa_total - mlkem_total), 3),
        }
    }


def compare_signature_algorithms(message: str):
    rsa_signature_result = run_rsa_signature_test(message)
    mldsa_result = run_mldsa_signature_test(message)

    rsa_total = rsa_signature_result["performance"]["total_ms"]
    mldsa_total = mldsa_result["performance"]["total_ms"]

    if rsa_total < mldsa_total:
        faster = "RSA-2048 Signature"
    elif mldsa_total < rsa_total:
        faster = "ML-DSA-65"
    else:
        faster = "Tie"

    return {
        "comparison_type": "signature",
        "message": message,
        "rsa_signature": rsa_signature_result,
        "mldsa": mldsa_result,
        "summary": {
            "faster_algorithm": faster,
            "rsa_total_ms": rsa_total,
            "mldsa_total_ms": mldsa_total,
            "difference_ms": round(abs(rsa_total - mldsa_total), 3),
        }
    }