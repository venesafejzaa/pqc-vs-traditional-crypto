import time
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes


def run_rsa_test(message: str) -> dict:
    message_bytes = message.encode("utf-8")

    start = time.perf_counter()
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()
    keygen_time = (time.perf_counter() - start) * 1000

    public_key_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    private_key_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    start = time.perf_counter()
    ciphertext = public_key.encrypt(
        message_bytes,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    encrypt_time = (time.perf_counter() - start) * 1000

    start = time.perf_counter()
    decrypted = private_key.decrypt(
        ciphertext,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    decrypt_time = (time.perf_counter() - start) * 1000

    return {
        "algorithm": "RSA-2048",
        "input_message": message,
        "decrypted_message": decrypted.decode("utf-8"),
        "keygen_time_ms": round(keygen_time, 4),
        "encrypt_time_ms": round(encrypt_time, 4),
        "decrypt_time_ms": round(decrypt_time, 4),
        "public_key_size": len(public_key_bytes),
        "private_key_size": len(private_key_bytes),
        "ciphertext_size": len(ciphertext)
    }