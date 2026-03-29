import base64
import time
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from Crypto.Hash import SHA256


def run_rsa_test(message: str):
    started = time.perf_counter()

    # Key generation
    keygen_start = time.perf_counter()
    key = RSA.generate(2048)
    private_key = key
    public_key = key.publickey()
    keygen_ms = (time.perf_counter() - keygen_start) * 1000

    # Hybrid encryption: RSA encrypts AES key, AES encrypts payload
    aes_key = get_random_bytes(32)

    encrypt_start = time.perf_counter()
    rsa_cipher = PKCS1_OAEP.new(public_key, hashAlgo=SHA256)
    encrypted_aes_key = rsa_cipher.encrypt(aes_key)

    aes_cipher = AES.new(aes_key, AES.MODE_GCM)
    ciphertext, tag = aes_cipher.encrypt_and_digest(message.encode("utf-8"))
    encrypt_ms = (time.perf_counter() - encrypt_start) * 1000

    decrypt_start = time.perf_counter()
    rsa_dec_cipher = PKCS1_OAEP.new(private_key, hashAlgo=SHA256)
    decrypted_aes_key = rsa_dec_cipher.decrypt(encrypted_aes_key)

    aes_dec_cipher = AES.new(decrypted_aes_key, AES.MODE_GCM, nonce=aes_cipher.nonce)
    decrypted_message = aes_dec_cipher.decrypt_and_verify(ciphertext, tag).decode("utf-8")
    decrypt_ms = (time.perf_counter() - decrypt_start) * 1000

    total_ms = (time.perf_counter() - started) * 1000

    return {
        "algorithm": "RSA-2048 + AES-256-GCM",
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
            "public_key_bytes": len(public_key.export_key()),
            "private_key_bytes": len(private_key.export_key()),
            "encrypted_key_bytes": len(encrypted_aes_key),
            "nonce_bytes": len(aes_cipher.nonce),
            "tag_bytes": len(tag),
            "ciphertext_bytes": len(ciphertext),
        },
        "artifacts_preview": {
            "encrypted_key_b64": base64.b64encode(encrypted_aes_key).decode(),
            "nonce_b64": base64.b64encode(aes_cipher.nonce).decode(),
            "tag_b64": base64.b64encode(tag).decode(),
            "ciphertext_b64": base64.b64encode(ciphertext).decode(),
        },
    }