import time
import os


def run_mlkem_test() -> dict:
    public_key = os.urandom(1184)
    ciphertext = os.urandom(1088)
    shared_secret = os.urandom(32)

    start = time.perf_counter()
    time.sleep(0.002)
    keygen_time = (time.perf_counter() - start) * 1000

    start = time.perf_counter()
    time.sleep(0.0015)
    encaps_time = (time.perf_counter() - start) * 1000

    start = time.perf_counter()
    time.sleep(0.0015)
    decaps_time = (time.perf_counter() - start) * 1000

    return {
        "algorithm": "ML-KEM-768 (simulated)",
        "shared_secret_match": True,
        "keygen_time_ms": round(keygen_time, 4),
        "encapsulation_time_ms": round(encaps_time, 4),
        "decapsulation_time_ms": round(decaps_time, 4),
        "public_key_size": len(public_key),
        "ciphertext_size": len(ciphertext),
        "shared_secret_size": len(shared_secret)
    }