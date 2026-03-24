import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { runRSA, runMLKEM } from "./api/cryptoApi";

function App() {
  const [message, setMessage] = useState("");
  const [rsaResult, setRsaResult] = useState(null);
  const [mlkemResult, setMlkemResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Shkruaj një mesazh fillimisht.");
      setRsaResult(null);
      setMlkemResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [rsaData, mlkemData] = await Promise.all([
        runRSA(trimmedMessage),
        runMLKEM(trimmedMessage),
      ]);

      setRsaResult(rsaData);
      setMlkemResult(mlkemData);
    } catch (err) {
      console.error("Compare error:", err);
      setError("Ndodhi një gabim gjatë krahasimit. Kontrollo backend-in.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    borderRadius: 6,
    minHeight: 620,
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  };

  const resultBoxStyle = {
    p: 1.5,
    borderRadius: 3,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    wordBreak: "break-word",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 7 },
        background:
          "radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 25%), radial-gradient(circle at top right, rgba(37,99,235,0.18), transparent 25%), linear-gradient(135deg, #081120 0%, #0b1730 40%, #111827 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Box textAlign="center" mb={6}>
          <Typography
            sx={{
              fontSize: { xs: "2.2rem", md: "4rem" },
              fontWeight: 900,
              color: "white",
              lineHeight: 1.05,
              mb: 1.5,
            }}
          >
            RSA vs ML-KEM + AES
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.76)",
              fontSize: { xs: "1rem", md: "1.15rem" },
              maxWidth: 820,
              mx: "auto",
            }}
          >
            Shkruaje një mesazh dhe krahasoji të dy qasjet e enkriptimit side-by-side.
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 6,
            mb: 5,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <TextField
                fullWidth
                label="Shkruaj mesazhin"
                placeholder="P.sh. pershendetje"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.05)",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.18)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.35)",
                  },
                }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CompareArrowsIcon />
                  )
                }
                onClick={handleCompare}
                disabled={loading}
                sx={{
                  minWidth: { xs: "100%", md: 240 },
                  height: 56,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                  boxShadow: "0 14px 30px rgba(37,99,235,0.35)",
                }}
              >
                {loading ? "Duke krahasuar..." : "Compare Algorithms"}
              </Button>
            </Stack>

            {error && (
              <Typography sx={{ color: "#fca5a5", mt: 2, fontWeight: 700 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Typography
          textAlign="center"
          mb={3}
          sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}
        >
          Krahasimi i algoritmeve me të njëjtin mesazh
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3.2, height: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    }}
                  >
                    <LockOutlinedIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      RSA
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
                      Traditional Cryptography
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label="RSA-2048"
                  sx={{
                    color: "white",
                    background: "rgba(37,99,235,0.18)",
                    border: "1px solid rgba(37,99,235,0.35)",
                  }}
                />
              </Stack>

              <Divider
                sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }}
              />

              {rsaResult ? (
                <Stack spacing={2}>
                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={0.5}>
                      Input Message
                    </Typography>
                    <Typography>{rsaResult.input_message}</Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={0.5}>
                      Encrypted Message
                    </Typography>
                    <Typography sx={{ fontSize: "0.92rem", opacity: 0.92 }}>
                      {rsaResult.encrypted_message}
                    </Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={0.5}>
                      Recovered Message
                    </Typography>
                    <Typography>{rsaResult.recovered_message}</Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={1}>
                      Performance
                    </Typography>
                    <Typography>
                      <b>KeyGen:</b> {rsaResult.keygen_time_ms} ms
                    </Typography>
                    <Typography>
                      <b>Encrypt:</b> {rsaResult.encrypt_time_ms} ms
                    </Typography>
                    <Typography>
                      <b>Decrypt:</b> {rsaResult.decrypt_time_ms} ms
                    </Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={1}>
                      Sizes
                    </Typography>
                    <Typography>
                      <b>Public Key:</b> {rsaResult.public_key_size} bytes
                    </Typography>
                    <Typography>
                      <b>Private Key:</b> {rsaResult.private_key_size} bytes
                    </Typography>
                    <Typography>
                      <b>Ciphertext:</b> {rsaResult.ciphertext_size} bytes
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Box
                  sx={{
                    minHeight: 420,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={800} mb={1}>
                      RSA result will appear here
                    </Typography>
                    <Typography>
                      Shkruaj një mesazh dhe kliko Compare Algorithms.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={cardStyle}>
            <CardContent sx={{ p: 3.2, height: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, #9333ea, #c026d3)",
                    }}
                  >
                    <AutoAwesomeIcon />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      ML-KEM + AES
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
                      Post-Quantum Approach
                    </Typography>
                  </Box>
                </Stack>

                <Chip
                  label="ML-KEM + AES"
                  sx={{
                    color: "white",
                    background: "rgba(168,85,247,0.18)",
                    border: "1px solid rgba(168,85,247,0.35)",
                  }}
                />
              </Stack>

              <Divider
                sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }}
              />

              {mlkemResult ? (
                <Stack spacing={2}>
                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={0.5}>
                      Input Message
                    </Typography>
                    <Typography>{mlkemResult.input_message}</Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={0.5}>
                      Encrypted Message
                    </Typography>
                    <Typography sx={{ fontSize: "0.92rem", opacity: 0.92 }}>
                      {mlkemResult.encrypted_message}
                    </Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={0.5}>
                      Recovered Message
                    </Typography>
                    <Typography>{mlkemResult.recovered_message}</Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={1}>
                      Performance
                    </Typography>
                    <Typography>
                      <b>KeyGen:</b> {mlkemResult.keygen_time_ms} ms
                    </Typography>
                    <Typography>
                      <b>Encrypt:</b> {mlkemResult.encrypt_time_ms} ms
                    </Typography>
                    <Typography>
                      <b>Decrypt:</b> {mlkemResult.decrypt_time_ms} ms
                    </Typography>
                  </Box>

                  <Box sx={resultBoxStyle}>
                    <Typography fontWeight={800} mb={1}>
                      Sizes
                    </Typography>
                    <Typography>
                      <b>Shared Secret:</b> {mlkemResult.shared_secret_size} bytes
                    </Typography>
                    <Typography>
                      <b>Ciphertext:</b> {mlkemResult.ciphertext_size} bytes
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Box
                  sx={{
                    minHeight: 420,
                    display: "grid",
                    placeItems: "center",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={800} mb={1}>
                      ML-KEM + AES result will appear here
                    </Typography>
                    <Typography>
                      I njëjti mesazh do të testohet edhe këtu për krahasim.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default App;