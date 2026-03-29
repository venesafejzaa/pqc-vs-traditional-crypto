const API_BASE_URL = "http://localhost:8000";

async function postJson(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Request failed.");
  }

  return data;
}

export async function runRSA(message) {
  return postJson("/api/rsa/run", { message });
}

export async function runMLKEM(message) {
  return postJson("/api/mlkem/run", { message });
}

export async function runRSASignature(message) {
  return postJson("/api/rsa-signature/run", { message });
}

export async function runMLDSASignature(message) {
  return postJson("/api/mldsa-signature/run", { message });
}

export async function runEncryptionBenchmark(message) {
  return postJson("/api/benchmark/encryption", { message });
}

export async function runSignatureBenchmark(message) {
  return postJson("/api/benchmark/signature", { message });
}