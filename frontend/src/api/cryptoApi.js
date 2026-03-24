import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const runRSA = async (message) => {
  const res = await api.post(`/api/rsa/run?message=${encodeURIComponent(message)}`);
  return res.data;
};

export const runMLKEM = async (message) => {
  const res = await api.post(`/api/mlkem/run?message=${encodeURIComponent(message)}`);
  return res.data;
};

export default api;