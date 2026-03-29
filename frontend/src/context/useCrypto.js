import { useContext } from "react";
import CryptoContext from "./CryptoContext";

export default function useCrypto() {
  const context = useContext(CryptoContext);

  if (!context) {
    throw new Error("useCrypto must be used inside CryptoProvider.");
  }

  return context;
}