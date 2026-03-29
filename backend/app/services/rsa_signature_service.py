import base64
import time
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256


def run_rsa_signature_test(message: str):
    started = time.perf_counter()

    keygen_start = time.perf_counter()
    key = RSA.generate(2048)
    private_key = key
    public_key = key.publickey()
    keygen_ms = (time.perf_counter() - keygen_start) * 1000

    sign_start = time.perf_counter()
    digest = SHA256.new(message.encode("utf-8"))
    signature = pkcs1_15.new(private_key).sign(digest)
    sign_ms = (time.perf_counter() - sign_start) * 1000

    verify_start = time.perf_counter()
    verified = True
    try:
        pkcs1_15.new(public_key).verify(digest, signature)
    except Exception:
        verified = False
    verify_ms = (time.perf_counter() - verify_start) * 1000

    total_ms = (time.perf_counter() - started) * 1000

    return {
        "algorithm": "RSA-2048 Signature",
        "type": "signature",
        "message": message,
        "verified": verified,
        "performance": {
            "keygen_ms": round(keygen_ms, 3),
            "sign_ms": round(sign_ms, 3),
            "verify_ms": round(verify_ms, 3),
            "total_ms": round(total_ms, 3),
        },
        "sizes": {
            "public_key_bytes": len(public_key.export_key()),
            "private_key_bytes": len(private_key.export_key()),
            "signature_bytes": len(signature),
        },
        "artifacts_preview": {
            "signature_b64": base64.b64encode(signature).decode()
        },
    }