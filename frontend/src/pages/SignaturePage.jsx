import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SignatureCanvas from "react-signature-canvas";
import MetricCard from "../components/MetricCard";
import useCrypto from "../context/useCrypto";

function SignatureOnlyPreview({
  title,
  signerName,
  verified,
  mode,
  selectedStyle,
  drawnSignatureUrl,
}) {
  const getFontFamily = () => {
    if (selectedStyle === "style1") return "cursive";
    if (selectedStyle === "style2") return '"Brush Script MT", cursive';
    return '"Segoe Script", cursive';
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 5,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        color: "#111827",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 20px 45px rgba(0,0,0,0.22)",
      }}
    >
      <Typography sx={{ fontWeight: 900, fontSize: "1rem", mb: 2 }}>
        {title}
      </Typography>

      <Box
        sx={{
          minHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          background:
            "radial-gradient(circle at top left, rgba(99,102,241,0.08), rgba(255,255,255,0.7))",
          border: "1px solid rgba(0,0,0,0.06)",
          mb: 3,
          px: 2,
        }}
      >
        {mode === "draw" && drawnSignatureUrl ? (
          <Box
            component="img"
            src={drawnSignatureUrl}
            alt="Drawn signature"
            sx={{
              maxHeight: 120,
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Typography
            sx={{
              fontFamily: getFontFamily(),
              fontSize: { xs: "2.7rem", md: "3.5rem" },
              color: "#111827",
              transform: "rotate(-4deg)",
              lineHeight: 1,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {signerName || "Signature"}
          </Typography>
        )}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: "0.92rem", color: "#6b7280", fontWeight: 700 }}>
          Electronic Signature
        </Typography>

        <Chip
          label={verified ? "Verified ✅" : "Not verified ❌"}
          sx={{
            fontWeight: 800,
            background: verified ? "#dcfce7" : "#fee2e2",
            color: verified ? "#166534" : "#991b1b",
          }}
        />
      </Stack>
    </Box>
  );
}

function TechnicalSignature({ signature, onCopy }) {
  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 3,
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography sx={{ color: "rgba(255,255,255,0.76)", fontWeight: 700 }}>
          Technical Signature
        </Typography>

        <Button
          size="small"
          onClick={() => onCopy(signature)}
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

      <Box
        sx={{
          color: "#00ffcc",
          fontFamily: "monospace",
          fontSize: "12px",
          lineHeight: 1.7,
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
        }}
      >
        {signature}
      </Box>
    </Box>
  );
}

function SignaturePage() {
  const {
    signatureSignerName,
    setSignatureSignerName,
    rsaSignatureResult,
    mldsaSignatureResult,
    loadingSignature,
    error,
    compareSignature,
    resetSignatureResults,
  } = useCrypto();

  const [signatureMode, setSignatureMode] = useState("type");
  const [selectedStyle, setSelectedStyle] = useState("style1");
  const [drawnSignatureUrl, setDrawnSignatureUrl] = useState("");
  const [showRsaTechnical, setShowRsaTechnical] = useState(false);
  const [showMldsaTechnical, setShowMldsaTechnical] = useState(false);

  const sigCanvasRef = useRef(null);

  const cardStyle = {
    borderRadius: 7,
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  };

  const resolvedSignerName = useMemo(() => {
    const value = signatureSignerName.trim();
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }, [signatureSignerName]);

  const handleModeChange = (_, newMode) => {
    if (!newMode) return;

    setSignatureMode(newMode);

    if (newMode === "draw") {
      setSignatureSignerName("");
    } else {
      setDrawnSignatureUrl("");
      sigCanvasRef.current?.clear();
    }
  };

  const handleStyleChange = (_, newStyle) => {
    if (newStyle) setSelectedStyle(newStyle);
  };

  const handleSaveDrawnSignature = () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) return;
    const url = sigCanvasRef.current.toDataURL("image/png");
    setDrawnSignatureUrl(url);
  };

  const handleClearDrawnSignature = () => {
    sigCanvasRef.current?.clear();
    setDrawnSignatureUrl("");
  };

  const handleCompare = async () => {
    if (signatureMode === "draw") {
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
        return;
      }

      const drawnUrl = sigCanvasRef.current.toDataURL("image/png");
      setDrawnSignatureUrl(drawnUrl);

      await compareSignature("Drawn Signature");
      return;
    }

    await compareSignature();
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
            fontSize: { xs: "2rem", md: "3.1rem" },
            mb: 1,
          }}
        >
          Signature Studio
        </Typography>

        <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 760 }}>
          Krijo firmën vizuale, zgjidh stilin ose vizato me dorë, pastaj krahaso performancën mes RSA Signature dhe ML-DSA Signature.
        </Typography>
      </Box>

      <Card sx={{ ...cardStyle, mb: 5 }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography sx={{ color: "white", fontWeight: 800, mb: 1.5 }}>
                Signature method
              </Typography>

              <ToggleButtonGroup
                value={signatureMode}
                exclusive
                onChange={handleModeChange}
                sx={{
                  "& .MuiToggleButton-root": {
                    color: "white",
                    borderColor: "rgba(255,255,255,0.15)",
                    textTransform: "none",
                    px: 2,
                    borderRadius: "14px",
                  },
                }}
              >
                <ToggleButton value="type">
                  <EditOutlinedIcon sx={{ mr: 1 }} />
                  Type
                </ToggleButton>
                <ToggleButton value="draw">
                  <DrawOutlinedIcon sx={{ mr: 1 }} />
                  Draw
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {signatureMode === "type" ? (
              <>
                <TextField
                  fullWidth
                  value={signatureSignerName}
                  onChange={(e) => setSignatureSignerName(e.target.value)}
                  label="Signer name"
                  placeholder="Shkruaj emrin që do të duket si firmë"
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.7)" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      borderRadius: "18px",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                    },
                  }}
                />

                <Box>
                  <Typography sx={{ color: "white", fontWeight: 800, mb: 1.5 }}>
                    Choose style
                  </Typography>

                  <ToggleButtonGroup
                    value={selectedStyle}
                    exclusive
                    onChange={handleStyleChange}
                    sx={{
                      flexWrap: "wrap",
                      gap: 1,
                      "& .MuiToggleButton-root": {
                        color: "white",
                        borderColor: "rgba(255,255,255,0.15)",
                        textTransform: "none",
                        px: 2,
                        borderRadius: "14px",
                      },
                    }}
                  >
                    <ToggleButton value="style1" sx={{ fontFamily: "cursive", fontSize: "1.2rem" }}>
                      {resolvedSignerName || "Signature"}
                    </ToggleButton>
                    <ToggleButton value="style2" sx={{ fontFamily: '"Brush Script MT", cursive', fontSize: "1.2rem" }}>
                      {resolvedSignerName || "Signature"}
                    </ToggleButton>
                    <ToggleButton value="style3" sx={{ fontFamily: '"Segoe Script", cursive', fontSize: "1.2rem" }}>
                      {resolvedSignerName || "Signature"}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </>
            ) : (
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ color: "white", fontWeight: 800, mb: 1.5 }}>
                    Draw your signature
                  </Typography>

                  <Box
                    sx={{
                      background: "white",
                      borderRadius: 4,
                      p: 1,
                      display: "inline-block",
                      maxWidth: "100%",
                      overflowX: "auto",
                    }}
                  >
                    <SignatureCanvas
                      ref={sigCanvasRef}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 180,
                        style: {
                          borderRadius: 12,
                          display: "block",
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={handleSaveDrawnSignature}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.2)",
                      textTransform: "none",
                      borderRadius: 999,
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleClearDrawnSignature}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.2)",
                      textTransform: "none",
                      borderRadius: 999,
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>
            )}

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Button
                variant="contained"
                onClick={handleCompare}
                disabled={loadingSignature}
                startIcon={
                  loadingSignature ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <CompareArrowsIcon />
                  )
                }
                sx={{
                  minWidth: 240,
                  height: 56,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 900,
                  background: "linear-gradient(90deg, #8b5cf6, #2563eb)",
                }}
              >
                {loadingSignature ? "Comparing..." : "Compare Signatures"}
              </Button>

              <Button
                variant="outlined"
                onClick={resetSignatureResults}
                sx={{
                  minWidth: 140,
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
              <Typography sx={{ color: "#fca5a5", fontWeight: 700 }}>
                {error}
              </Typography>
            )}
          </Stack>
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
                <ShieldOutlinedIcon sx={{ fontSize: 38 }} />
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    RSA Signature
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
                    Traditional
                  </Typography>
                </Box>
              </Stack>
              <Chip label={rsaSignatureResult?.is_valid ? "Verified" : "RSA"} sx={{ color: "white" }} />
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

            {rsaSignatureResult ? (
              <Stack spacing={2}>
                <SignatureOnlyPreview
                  title="RSA Visual Signature"
                  signerName={resolvedSignerName}
                  verified={rsaSignatureResult.is_valid}
                  mode={signatureMode}
                  selectedStyle={selectedStyle}
                  drawnSignatureUrl={drawnSignatureUrl}
                />

                <MetricCard label="Verification" value={rsaSignatureResult.is_valid ? "Valid ✅" : "Invalid ❌"} />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                  <MetricCard label="KeyGen" value={`${rsaSignatureResult.keygen_time_ms} ms`} />
                  <MetricCard label="Sign" value={`${rsaSignatureResult.sign_time_ms} ms`} />
                  <MetricCard label="Verify" value={`${rsaSignatureResult.verify_time_ms} ms`} />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                  <MetricCard label="Public Key Size" value={`${rsaSignatureResult.public_key_size} bytes`} />
                  <MetricCard label="Private Key Size" value={`${rsaSignatureResult.private_key_size} bytes`} />
                  <MetricCard label="Signature Size" value={`${rsaSignatureResult.signature_size} bytes`} />
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => setShowRsaTechnical((prev) => !prev)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    color: "white",
                    borderColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  {showRsaTechnical ? "Hide Technical Signature" : "Show Technical Signature"}
                </Button>

                <Collapse in={showRsaTechnical}>
                  <TechnicalSignature signature={rsaSignatureResult.signature} onCopy={handleCopy} />
                </Collapse>
              </Stack>
            ) : (
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                Rezultati i RSA Signature do të shfaqet këtu.
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={cardStyle}>
          <CardContent sx={{ p: 3.2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <VerifiedOutlinedIcon sx={{ fontSize: 38 }} />
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    ML-DSA Signature
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
                    Post-Quantum
                  </Typography>
                </Box>
              </Stack>
              <Chip label={mldsaSignatureResult?.is_valid ? "Verified" : "ML-DSA"} sx={{ color: "white" }} />
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

            {mldsaSignatureResult ? (
              <Stack spacing={2}>
                <SignatureOnlyPreview
                  title="ML-DSA Visual Signature"
                  signerName={resolvedSignerName}
                  verified={mldsaSignatureResult.is_valid}
                  mode={signatureMode}
                  selectedStyle={selectedStyle}
                  drawnSignatureUrl={drawnSignatureUrl}
                />

                <MetricCard label="Verification" value={mldsaSignatureResult.is_valid ? "Valid ✅" : "Invalid ❌"} />

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                  <MetricCard label="KeyGen" value={`${mldsaSignatureResult.keygen_time_ms} ms`} />
                  <MetricCard label="Sign" value={`${mldsaSignatureResult.sign_time_ms} ms`} />
                  <MetricCard label="Verify" value={`${mldsaSignatureResult.verify_time_ms} ms`} />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2 }}>
                  <MetricCard label="Public Key Size" value={`${mldsaSignatureResult.public_key_size} bytes`} />
                  <MetricCard label="Private Key Size" value={`${mldsaSignatureResult.private_key_size} bytes`} />
                  <MetricCard label="Signature Size" value={`${mldsaSignatureResult.signature_size} bytes`} />
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => setShowMldsaTechnical((prev) => !prev)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    color: "white",
                    borderColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  {showMldsaTechnical ? "Hide Technical Signature" : "Show Technical Signature"}
                </Button>

                <Collapse in={showMldsaTechnical}>
                  <TechnicalSignature signature={mldsaSignatureResult.signature} onCopy={handleCopy} />
                </Collapse>
              </Stack>
            ) : (
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                Rezultati i ML-DSA Signature do të shfaqet këtu.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default SignaturePage;