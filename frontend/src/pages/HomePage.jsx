import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";

function ActionCard({ icon, title, text, buttonText, onClick, primary = false }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 6,
        background: primary
          ? "linear-gradient(180deg, rgba(139,92,246,0.18), rgba(37,99,235,0.10))"
          : "rgba(255,255,255,0.06)",
        border: primary
          ? "1px solid rgba(167,139,250,0.34)"
          : "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(18px)",
        color: "white",
        boxShadow: primary
          ? "0 24px 60px rgba(99,102,241,0.22)"
          : "0 18px 50px rgba(0,0,0,0.25)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
        },
      }}
    >
      <CardContent sx={{ p: 3.2 }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {icon}
        </Box>

        <Typography sx={{ fontSize: "1.35rem", fontWeight: 900, mb: 1.2 }}>
          {title}
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.74)",
            lineHeight: 1.7,
            mb: 3,
            minHeight: 70,
          }}
        >
          {text}
        </Typography>

        <Button
          fullWidth
          onClick={onClick}
          sx={{
            height: 50,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 900,
            color: "white",
            background: primary
              ? "linear-gradient(90deg, #8b5cf6, #2563eb)"
              : "rgba(255,255,255,0.10)",
            "&:hover": {
              background: primary
                ? "linear-gradient(90deg, #7c3aed, #1d4ed8)"
                : "rgba(255,255,255,0.14)",
            },
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}

function MiniInfo({ icon, title, text }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 5,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        height: "100%",
      }}
    >
      <Box sx={{ mb: 1.5 }}>{icon}</Box>
      <Typography sx={{ color: "white", fontWeight: 900, fontSize: "1.08rem", mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
        {text}
      </Typography>
    </Box>
  );
}

function CompareMiniCard({ title, subtitle }) {
  return (
    <Box
      sx={{
        p: 2.4,
        borderRadius: 5,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography sx={{ color: "white", fontWeight: 900, mb: 0.7 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 15% 20%, rgba(139,92,246,0.26), transparent 22%),
          radial-gradient(circle at 85% 15%, rgba(37,99,235,0.20), transparent 24%),
          linear-gradient(180deg, #081120 0%, #0f172a 52%, #07101f 100%)
        `,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 7 }}>
        <Box
          sx={{
            borderRadius: 8,
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 7 },
            mb: 5,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 230,
              height: 230,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(37,99,235,0.20), transparent 70%)",
            }}
          />

          <Stack spacing={3} alignItems="center" textAlign="center" sx={{ position: "relative", zIndex: 1 }}>
            <Chip
              label="Krahasim i algoritmeve"
              sx={{
                color: "white",
                background: "rgba(255,255,255,0.10)",
                fontWeight: 800,
              }}
            />

            <Typography
              sx={{
                color: "white",
                fontWeight: 900,
                fontSize: { xs: "2.3rem", md: "4.4rem" },
                lineHeight: 1.02,
                maxWidth: 980,
              }}
            >
              Krahasimi i algoritmeve
              <Box
                component="span"
                sx={{
                  display: "block",
                  background: "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                tradicionale dhe post-kuantike
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: { xs: "1rem", md: "1.14rem" },
                maxWidth: 860,
                lineHeight: 1.8,
              }}
            >
              Ky sistem mundëson krahasimin vizual dhe teknik të RSA, ML-KEM,
              RSA Signature dhe ML-DSA për kohë ekzekutimi, madhësi dhe kosto.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                onClick={() => navigate("/encryption")}
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 900,
                  color: "white",
                  background: "linear-gradient(90deg, #8b5cf6, #2563eb)",
                  boxShadow: "0 14px 34px rgba(37,99,235,0.24)",
                }}
              >
                Hape enkriptimin
              </Button>

              <Button
                onClick={() => navigate("/signature-analysis")}
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 900,
                  color: "white",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                Shiko analizën
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 5,
          }}
        >
          <ActionCard
            icon={<LockOutlinedIcon sx={{ color: "white", fontSize: 32 }} />}
            title="Enkriptimi"
            text="Krahaso RSA me ML-KEM + AES për fshehtësi, shpejtësi, madhësi të çelësave dhe ciphertext."
            buttonText="Hape enkriptimin"
            onClick={() => navigate("/encryption")}
          />

          <ActionCard
            icon={<ShieldOutlinedIcon sx={{ color: "white", fontSize: 32 }} />}
            title="Nënshkrimi digjital"
            text="Krahaso RSA Signature me ML-DSA për nënshkrim, verifikim dhe paraqitje vizuale të rezultateve."
            buttonText="Hape nënshkrimin"
            onClick={() => navigate("/signature")}
            primary
          />
        </Box>

        <Box
          sx={{
            borderRadius: 7,
            p: { xs: 3, md: 4 },
            mb: 5,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 900,
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: 1.5,
            }}
          >
            Çfarë krahasohet në këtë projekt?
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.74)", lineHeight: 1.8, mb: 3 }}>
            Krahasimi bëhet në tri drejtime kryesore: performanca, madhësia dhe kostoja.
            Kjo e bën analizën më të qartë dhe më profesionale për prezantim.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            <CompareMiniCard
              title="Performanca"
              subtitle="Sa kohë duhet për gjenerim të çelësave, enkriptim, dekriptim, nënshkrim dhe verifikim."
            />
            <CompareMiniCard
              title="Madhësia"
              subtitle="Madhësia e çelësave, ciphertext-it dhe nënshkrimit digjital për secilin algoritëm."
            />
            <CompareMiniCard
              title="Kostoja"
              subtitle="Kostoja paraqitet si score i kombinuar nga koha dhe madhësia."
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
            gap: 3,
          }}
        >
          <MiniInfo
            icon={<SpeedOutlinedIcon sx={{ color: "white" }} />}
            title="Shpejtësia"
            text="Matet koha e ekzekutimit për secilin hap të algoritmit."
          />
          <MiniInfo
            icon={<AutoGraphOutlinedIcon sx={{ color: "white" }} />}
            title="Grafikë vizuale"
            text="Rezultatet paraqiten me charts moderne dhe të qarta."
          />
          <MiniInfo
            icon={<CompareArrowsOutlinedIcon sx={{ color: "white" }} />}
            title="Krahasim i drejtpërdrejtë"
            text="Algoritmet shihen njëri pranë tjetrit për dallim më të lehtë."
          />
          <MiniInfo
            icon={<WorkspacePremiumOutlinedIcon sx={{ color: "white" }} />}
            title="Prezantim profesional"
            text="Strukturë më e pastër dhe më e bukur për temë dhe demonstrim."
          />
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;