import { useMemo, useState } from "react";
import CryptoContext from "./CryptoContext";
import {
  runRSA,
  runMLKEM,
  runRSASignature,
  runMLDSASignature,
} from "../api/cryptoApi";

function mapRsaEncryptionResult(data) {
  return {
    algorithm: data.algorithm,
    input_message: data.original_message,
    encrypted_message: data.artifacts_preview?.encrypted_key_b64 || "N/A",
    recovered_message: data.decrypted_message,
    success: data.success,

    keygen_time_ms: data.performance?.keygen_ms ?? 0,
    encrypt_time_ms: data.performance?.encrypt_ms ?? 0,
    decrypt_time_ms: data.performance?.decrypt_ms ?? 0,
    total_time_ms: data.performance?.total_ms ?? 0,

    public_key_size: data.sizes?.public_key_bytes ?? 0,
    private_key_size: data.sizes?.private_key_bytes ?? 0,
    ciphertext_size:
      (data.sizes?.encrypted_key_bytes ?? 0) +
      (data.sizes?.ciphertext_bytes ?? 0) +
      (data.sizes?.nonce_bytes ?? 0) +
      (data.sizes?.tag_bytes ?? 0),

    encrypted_key_b64: data.artifacts_preview?.encrypted_key_b64 || "",
    nonce_b64: data.artifacts_preview?.nonce_b64 || "",
    tag_b64: data.artifacts_preview?.tag_b64 || "",
    payload_ciphertext_b64: data.artifacts_preview?.ciphertext_b64 || "",
  };
}

function mapMlkemEncryptionResult(data) {
  return {
    algorithm: data.algorithm,
    input_message: data.original_message,
    encrypted_message: data.artifacts_preview?.kem_ciphertext_b64 || "N/A",
    recovered_message: data.decrypted_message,
    success: data.success,

    keygen_time_ms: data.performance?.keygen_ms ?? 0,
    encrypt_time_ms: data.performance?.encrypt_ms ?? 0,
    decrypt_time_ms: data.performance?.decrypt_ms ?? 0,
    total_time_ms: data.performance?.total_ms ?? 0,

    public_key_size: data.sizes?.public_key_bytes ?? 0,
    private_key_size: 0,
    shared_secret_size: data.sizes?.shared_secret_bytes ?? 0,
    ciphertext_size:
      (data.sizes?.kem_ciphertext_bytes ?? 0) +
      (data.sizes?.payload_ciphertext_bytes ?? 0) +
      (data.sizes?.nonce_bytes ?? 0) +
      (data.sizes?.tag_bytes ?? 0),

    kem_ciphertext_b64: data.artifacts_preview?.kem_ciphertext_b64 || "",
    nonce_b64: data.artifacts_preview?.nonce_b64 || "",
    tag_b64: data.artifacts_preview?.tag_b64 || "",
    payload_ciphertext_b64: data.artifacts_preview?.payload_ciphertext_b64 || "",
  };
}

function mapRsaSignatureResult(data) {
  return {
    algorithm: data.algorithm,
    message: data.message,
    signature: data.artifacts_preview?.signature_b64 || "",
    is_valid: data.verified,

    keygen_time_ms: data.performance?.keygen_ms ?? 0,
    sign_time_ms: data.performance?.sign_ms ?? 0,
    verify_time_ms: data.performance?.verify_ms ?? 0,
    total_time_ms: data.performance?.total_ms ?? 0,

    public_key_size: data.sizes?.public_key_bytes ?? 0,
    private_key_size: data.sizes?.private_key_bytes ?? 0,
    signature_size: data.sizes?.signature_bytes ?? 0,
  };
}

function mapMldsaSignatureResult(data) {
  return {
    algorithm: data.algorithm,
    message: data.message,
    signature: data.artifacts_preview?.signature_b64 || "",
    is_valid: data.verified,

    keygen_time_ms: data.performance?.keygen_ms ?? 0,
    sign_time_ms: data.performance?.sign_ms ?? 0,
    verify_time_ms: data.performance?.verify_ms ?? 0,
    total_time_ms: data.performance?.total_ms ?? 0,

    public_key_size: data.sizes?.public_key_bytes ?? 0,
    private_key_size: data.sizes?.private_key_bytes ?? 0,
    signature_size: data.sizes?.signature_bytes ?? 0,
  };
}

export default function CryptoProvider({ children }) {
  const [encryptionMessage, setEncryptionMessage] = useState("");
  const [signatureSignerName, setSignatureSignerName] = useState("");

  const [rsaResult, setRsaResult] = useState(null);
  const [mlkemResult, setMlkemResult] = useState(null);
  const [rsaSignatureResult, setRsaSignatureResult] = useState(null);
  const [mldsaSignatureResult, setMldsaSignatureResult] = useState(null);

  const [loadingEncryption, setLoadingEncryption] = useState(false);
  const [loadingSignature, setLoadingSignature] = useState(false);
  const [error, setError] = useState("");

  const resetEncryptionResults = () => {
    setRsaResult(null);
    setMlkemResult(null);
    setError("");
  };

  const resetSignatureResults = () => {
    setRsaSignatureResult(null);
    setMldsaSignatureResult(null);
    setError("");
  };

  const resetAllResults = () => {
    resetEncryptionResults();
    resetSignatureResults();
  };

  const compareEncryption = async () => {
    const trimmed = encryptionMessage.trim();

    if (!trimmed) {
      setError("Shkruaj mesazhin për encryption.");
      return;
    }

    try {
      setLoadingEncryption(true);
      setError("");

      const [rsaData, mlkemData] = await Promise.all([
        runRSA(trimmed),
        runMLKEM(trimmed),
      ]);

      setRsaResult(mapRsaEncryptionResult(rsaData));
      setMlkemResult(mapMlkemEncryptionResult(mlkemData));
    } catch (err) {
      console.error("Encryption compare error:", err);
      setError(err.message || "Gabim gjatë krahasimit të encryption.");
    } finally {
      setLoadingEncryption(false);
    }
  };

  const compareSignature = async (customSignerName = "") => {
    const finalSignerName = (customSignerName || signatureSignerName).trim();

    if (!finalSignerName) {
      setError("Shkruaj emrin për nënshkrim.");
      return;
    }

    try {
      setLoadingSignature(true);
      setError("");

      const [rsaSignData, mldsaSignData] = await Promise.all([
        runRSASignature(finalSignerName),
        runMLDSASignature(finalSignerName),
      ]);

      setRsaSignatureResult(mapRsaSignatureResult(rsaSignData));
      setMldsaSignatureResult(mapMldsaSignatureResult(mldsaSignData));
    } catch (err) {
      console.error("Signature compare error:", err);
      setError(err.message || "Gabim gjatë krahasimit të nënshkrimit digjital.");
    } finally {
      setLoadingSignature(false);
    }
  };

  const value = useMemo(
    () => ({
      encryptionMessage,
      setEncryptionMessage,
      signatureSignerName,
      setSignatureSignerName,

      rsaResult,
      mlkemResult,
      rsaSignatureResult,
      mldsaSignatureResult,

      loadingEncryption,
      loadingSignature,
      error,
      setError,

      resetEncryptionResults,
      resetSignatureResults,
      resetAllResults,

      compareEncryption,
      compareSignature,
    }),
    [
      encryptionMessage,
      signatureSignerName,
      rsaResult,
      mlkemResult,
      rsaSignatureResult,
      mldsaSignatureResult,
      loadingEncryption,
      loadingSignature,
      error,
    ]
  );

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}