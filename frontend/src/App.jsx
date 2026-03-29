import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import EncryptionPage from "./pages/EncryptionPage";
import SignaturePage from "./pages/SignaturePage";
import EncryptionAnalysisPage from "./pages/EncryptionAnalysisPage";
import SignatureAnalysisPage from "./pages/SignatureAnalysisPage";

function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, rgba(139,92,246,0.18), transparent 24%),
          radial-gradient(circle at top right, rgba(37,99,235,0.16), transparent 24%),
          linear-gradient(180deg, #081120 0%, #0f172a 48%, #07101f 100%)
        `,
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/encryption" element={<EncryptionPage />} />
        <Route path="/signature" element={<SignaturePage />} />
        <Route path="/encryption-analysis" element={<EncryptionAnalysisPage />} />
        <Route path="/signature-analysis" element={<SignatureAnalysisPage />} />
      </Routes>
    </Box>
  );
}

export default App;