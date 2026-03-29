import base64
import hashlib
import time
from Crypto.Cipher import AES
import oqs


def _derive_aes_key(shared_secret: bytes) -> bytes:
    return hashlib.sha256(shared_secret).digest()


def run_mlkem_test(message: str):
    started = time.perf_counter()
    kem_alg = "ML-KEM-768"

    keygen_start = time.perf_counter()
    with oqs.KeyEncapsulation(kem_alg) as client:
        public_key = client.generate_keypair()
        keygen_ms = (time.perf_counter() - keygen_start) * 1000

        encrypt_start = time.perf_counter()
        with oqs.KeyEncapsulation(kem_alg) as server:
            kem_ciphertext, shared_secret_server = server.encap_secret(public_key)

        aes_key = _derive_aes_key(shared_secret_server)
        aes_cipher = AES.new(aes_key, AES.MODE_GCM)
        encrypted_payload, tag = aes_cipher.encrypt_and_digest(message.encode("utf-8"))
        encrypt_ms = (time.perf_counter() - encrypt_start) * 1000

        decrypt_start = time.perf_counter()
        shared_secret_client = client.decap_secret(kem_ciphertext)
        aes_key_client = _derive_aes_key(shared_secret_client)

        aes_dec_cipher = AES.new(aes_key_client, AES.MODE_GCM, nonce=aes_cipher.nonce)
        decrypted_message = aes_dec_cipher.decrypt_and_verify(encrypted_payload, tag).decode("utf-8")
        decrypt_ms = (time.perf_counter() - decrypt_start) * 1000

    total_ms = (time.perf_counter() - started) * 1000

    return {
        "algorithm": "ML-KEM-768 + AES-256-GCM",
        "type": "encryption",
        "original_message": message,
        "decrypted_message": decrypted_message,
        "success": decrypted_message == message,
        "performance": {
            "keygen_ms": round(keygen_ms, 3),
            "encrypt_ms": round(encrypt_ms, 3),
            "decrypt_ms": round(decrypt_ms, 3),
            "total_ms": round(total_ms, 3),
        },
        "sizes": {
            "public_key_bytes": len(public_key),
            "kem_ciphertext_bytes": len(kem_ciphertext),
            "shared_secret_bytes": len(shared_secret_server),
            "nonce_bytes": len(aes_cipher.nonce),
            "tag_bytes": len(tag),
            "payload_ciphertext_bytes": len(encrypted_payload),
        },
        "artifacts_preview": {
            "kem_ciphertext_b64": base64.b64encode(kem_ciphertext).decode(),
            "nonce_b64": base64.b64encode(aes_cipher.nonce).decode(),
            "tag_b64": base64.b64encode(tag).decode(),
            "payload_ciphertext_b64": base64.b64encode(encrypted_payload).decode(),
        },
    }