import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MetricCard from "../components/MetricCard";
import useCrypto from "../context/useCrypto";

function EncryptionPage() {
  const {
    encryptionMessage,
    setEncryptionMessage,
    rsaResult,
    mlkemResult,
    loadingEncryption,
    error,
    compareEncryption,
    resetEncryptionResults,
  } = useCrypto();

  const cardStyle = {
    borderRadius: 6,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  };

  const codeBlockStyle = {
    p: 2,
    borderRadius: 3,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "white",
    fontFamily: "monospace",
    fontSize: "12px",
    lineHeight: 1.7,
    wordBreak: "break-all",
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  };

  const handleCopy = async (text) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box mb={4}>
        <Typography
          sx={{
            color: "white",
            fontWeight: 900,
            fontSize: { xs: "2rem", md: "3rem" },
            mb: 1,
          }}
        >
          Encryption Comparison
        </Typography>

        <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
          Krahasimi i RSA dhe ML-KEM + AES për fshehtësinë e mesazhit.
        </Typography>
      </Box>

      <Card sx={{ ...cardStyle, mb: 5 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <input
              value={encryptionMessage}
              onChange={(e) => setEncryptionMessage(e.target.value)}
              placeholder="Shkruaj mesazhin për enkriptim"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                outline: "none",
                fontSize: "16px",
              }}
            />

            <Button
              variant="contained"
              onClick={compareEncryption}
              disabled={loadingEncryption}
              startIcon={
                loadingEncryption ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <CompareArrowsIcon />
                )
              }
              sx={{
                minWidth: { xs: "100%", md: 220 },
                height: 56,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
                background: "linear-gradient(90deg, #7c3aed, #2563eb)",
              }}
            >
              {loadingEncryption ? "Comparing..." : "Compare Encryption"}
            </Button>

            <Button
              variant="outlined"
              onClick={resetEncryptionResults}
              sx={{
                minWidth: { xs: "100%", md: 140 },
                height: 56,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
                color: "white",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              Reset
            </Button>
          </Stack>

          {error && (
            <Typography sx={{ color: "#fca5a5", mt: 2, fontWeight: 700 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 4,
        }}
      >
        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3.2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LockOutlinedIcon sx={{ fontSize: 38 }} />
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    RSA
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
                    Traditional Encryption
                  </Typography>
                </Box>
              </Stack>
              <Chip label="RSA-2048" sx={{ color: "white" }} />
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

            {rsaResult ? (
              <Stack spacing={2}>
                <MetricCard label="Input Message" value={rsaResult.input_message} />

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
                      Encrypted Message
                    </Typography>

                    <Button
                      size="small"
                      onClick={() =>
                        handleCopy(
                          `Encrypted AES Key: ${rsaResult.encrypted_key_b64}

Nonce: ${rsaResult.nonce_b64}

Tag: ${rsaResult.tag_b64}

Ciphertext: ${rsaResult.payload_ciphertext_b64}`
                        )
                      }
                      startIcon={<ContentCopyIcon />}
                      sx={{
                        color: "white",
                        textTransform: "none",
                        borderRadius: 999,
                        minWidth: "auto",
                        px: 1.5,
                      }}
                    >
                      Copy
                    </Button>
                  </Stack>

                  <Box sx={codeBlockStyle}>
                    {`Encrypted AES Key: ${rsaResult.encrypted_key_b64}

Nonce: ${rsaResult.nonce_b64}

Tag: ${rsaResult.tag_b64}

Ciphertext: ${rsaResult.payload_ciphertext_b64}`}
                  </Box>
                </Box>

                <MetricCard label="Recovered Message" value={rsaResult.recovered_message} />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <MetricCard label="KeyGen" value={`${rsaResult.keygen_time_ms} ms`} />
                  <MetricCard label="Encrypt" value={`${rsaResult.encrypt_time_ms} ms`} />
                  <MetricCard label="Decrypt" value={`${rsaResult.decrypt_time_ms} ms`} />
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <MetricCard label="Public Key Size" value={`${rsaResult.public_key_size} bytes`} />
                  <MetricCard label="Private Key Size" value={`${rsaResult.private_key_size} bytes`} />
                  <MetricCard label="Ciphertext Size" value={`${rsaResult.ciphertext_size} bytes`} />
                </Box>
              </Stack>
            ) : (
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                Rezultati i RSA do të shfaqet këtu.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3.2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AutoAwesomeIcon sx={{ fontSize: 38 }} />
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    ML-KEM + AES
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
                    Post-Quantum Encryption
                  </Typography>
                </Box>
              </Stack>
              <Chip label="ML-KEM + AES" sx={{ color: "white" }} />
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

            {mlkemResult ? (
              <Stack spacing={2}>
                <MetricCard label="Input Message" value={mlkemResult.input_message} />

                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
                      Encrypted Message
                    </Typography>

                    <Button
                      size="small"
                      onClick={() =>
                        handleCopy(
                          `KEM Ciphertext: ${mlkemResult.kem_ciphertext_b64}

Nonce: ${mlkemResult.nonce_b64}

Tag: ${mlkemResult.tag_b64}

Payload Ciphertext: ${mlkemResult.payload_ciphertext_b64}`
                        )
                      }
                      startIcon={<ContentCopyIcon />}
                      sx={{
                        color: "white",
                        textTransform: "none",
                        borderRadius: 999,
                        minWidth: "auto",
                        px: 1.5,
                      }}
                    >
                      Copy
                    </Button>
                  </Stack>

                  <Box sx={codeBlockStyle}>
                    {`KEM Ciphertext: ${mlkemResult.kem_ciphertext_b64}

Nonce: ${mlkemResult.nonce_b64}

Tag: ${mlkemResult.tag_b64}

Payload Ciphertext: ${mlkemResult.payload_ciphertext_b64}`}
                  </Box>
                </Box>

                <MetricCard label="Recovered Message" value={mlkemResult.recovered_message} />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <MetricCard label="KeyGen" value={`${mlkemResult.keygen_time_ms} ms`} />
                  <MetricCard label="Encrypt" value={`${mlkemResult.encrypt_time_ms} ms`} />
                  <MetricCard label="Decrypt" value={`${mlkemResult.decrypt_time_ms} ms`} />
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <MetricCard label="Public Key Size" value={`${mlkemResult.public_key_size} bytes`} />
                  <MetricCard label="Shared Secret Size" value={`${mlkemResult.shared_secret_size} bytes`} />
                  <MetricCard label="Ciphertext Size" value={`${mlkemResult.ciphertext_size} bytes`} />
                </Box>
              </Stack>
            ) : (
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                Rezultati i ML-KEM + AES do të shfaqet këtu.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default EncryptionPage;