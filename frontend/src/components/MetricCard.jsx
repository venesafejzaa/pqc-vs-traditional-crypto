import { Box, Typography } from "@mui/material";

function MetricCard({ label, value, minHeight = 96 }) {
  return (
    <Box
      sx={{
        minHeight,
        p: 2.2,
        borderRadius: 4,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <Typography
        sx={{
          color: "rgba(255,255,255,0.66)",
          fontSize: "0.92rem",
          fontWeight: 700,
          mb: 1,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "white",
          fontSize: "1.08rem",
          fontWeight: 900,
          lineHeight: 1.45,
          wordBreak: "break-word",
        }}
      >
        {value ?? "-"}
      </Typography>
    </Box>
  );
}

export default MetricCard;