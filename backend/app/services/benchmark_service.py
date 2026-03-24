from app.services.rsa_service import run_rsa_test
from app.services.mlkem_service import run_mlkem_test


def run_kem_benchmark(iterations: int = 10):
    rsa_results = []
    mlkem_results = []

    for _ in range(iterations):
        rsa = run_rsa_test("test")
        mlkem = run_mlkem_test()

        rsa_results.append(rsa)
        mlkem_results.append(mlkem)

    def avg(data, key):
        return sum(d[key] for d in data) / len(data)

    return {
        "iterations": iterations,
        "rsa": {
            "avg_keygen": avg(rsa_results, "keygen_time_ms"),
            "avg_encrypt": avg(rsa_results, "encrypt_time_ms"),
            "avg_decrypt": avg(rsa_results, "decrypt_time_ms"),
            "public_key_size": rsa_results[0]["public_key_size"],
        },
        "mlkem": {
            "avg_keygen": avg(mlkem_results, "keygen_time_ms"),
            "avg_encapsulation": avg(mlkem_results, "encapsulation_time_ms"),
            "avg_decapsulation": avg(mlkem_results, "decapsulation_time_ms"),
            "public_key_size": mlkem_results[0]["public_key_size"],
        }
    }