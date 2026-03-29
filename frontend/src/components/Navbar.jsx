import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ShieldMoonOutlinedIcon from "@mui/icons-material/ShieldMoonOutlined";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Encryption", path: "/encryption" },
    { label: "Signature", path: "/signature" },
    { label: "Encryption Analysis", path: "/encryption-analysis" },
    { label: "Signature Analysis", path: "/signature-analysis" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(8, 15, 32, 0.72)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 78,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(139,92,246,0.28), rgba(37,99,235,0.22))",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <ShieldMoonOutlinedIcon sx={{ color: "white" }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 900,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.1,
                }}
              >
                Crypto Compare
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.58)",
                  fontSize: "0.78rem",
                  lineHeight: 1.1,
                }}
              >
                Traditional vs Post-Quantum
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              display: { xs: "none", lg: "flex" },
              flexWrap: "wrap",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  px: 2.2,
                  py: 1.1,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  color: "white",
                  background: isActive(item.path)
                    ? "linear-gradient(90deg, rgba(139,92,246,0.95), rgba(37,99,235,0.95))"
                    : "transparent",
                  border: isActive(item.path)
                    ? "1px solid rgba(255,255,255,0.14)"
                    : "1px solid transparent",
                  "&:hover": {
                    background: isActive(item.path)
                      ? "linear-gradient(90deg, rgba(139,92,246,0.95), rgba(37,99,235,0.95))"
                      : "rgba(255,255,255,0.06)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;