import base64
import time
import oqs


def run_mldsa_signature_test(message: str):
    started = time.perf_counter()
    sig_alg = "ML-DSA-65"
    message_bytes = message.encode("utf-8")

    keygen_start = time.perf_counter()
    with oqs.Signature(sig_alg) as signer:
        public_key = signer.generate_keypair()
        keygen_ms = (time.perf_counter() - keygen_start) * 1000

        sign_start = time.perf_counter()
        signature = signer.sign(message_bytes)
        sign_ms = (time.perf_counter() - sign_start) * 1000

        verify_start = time.perf_counter()
        verified = signer.verify(message_bytes, signature, public_key)
        verify_ms = (time.perf_counter() - verify_start) * 1000

    total_ms = (time.perf_counter() - started) * 1000

    return {
        "algorithm": sig_alg,
        "type": "signature",
        "message": message,
        "verified": bool(verified),
        "performance": {
            "keygen_ms": round(keygen_ms, 3),
            "sign_ms": round(sign_ms, 3),
            "verify_ms": round(verify_ms, 3),
            "total_ms": round(total_ms, 3),
        },
        "sizes": {
            "public_key_bytes": len(public_key),
            "signature_bytes": len(signature),
        },
        "artifacts_preview": {
            "signature_b64": base64.b64encode(signature).decode()
        },
    }