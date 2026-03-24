import time
import os
import base64
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes


def run_mlkem_test(message: str) -> dict:
    message_bytes = message.encode("utf-8")

    # 🔐 Step 1: ML-KEM (simulated shared secret)
    start = time.perf_counter()
    time.sleep(0.002)
    shared_secret = get_random_bytes(16)  # 128-bit key
    keygen_time = (time.perf_counter() - start) * 1000

    # 🔐 Step 2: AES Encryption
    start = time.perf_counter()
    cipher = AES.new(shared_secret, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(message_bytes)
    encrypt_time = (time.perf_counter() - start) * 1000

    # 🔐 Step 3: AES Decryption
    start = time.perf_counter()
    decipher = AES.new(shared_secret, AES.MODE_EAX, nonce=cipher.nonce)
    decrypted = decipher.decrypt(ciphertext)
    decrypt_time = (time.perf_counter() - start) * 1000

    return {
        "algorithm": "ML-KEM + AES (simulated)",
        "input_message": message,
        "encrypted_message": base64.b64encode(ciphertext).decode(),
        "recovered_message": decrypted.decode("utf-8"),
        "keygen_time_ms": round(keygen_time, 4),
        "encrypt_time_ms": round(encrypt_time, 4),
        "decrypt_time_ms": round(decrypt_time, 4),
        "shared_secret_size": len(shared_secret),
        "ciphertext_size": len(ciphertext)
    }