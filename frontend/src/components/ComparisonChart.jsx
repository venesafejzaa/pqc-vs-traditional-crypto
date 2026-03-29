import { Box, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function ComparisonChart({ title, data, bars = [] }) {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography sx={{ color: "white", fontWeight: 800, mb: 1 }}>{title}</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.68)" }}>
          Nuk ka të dhëna ende për chart.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography sx={{ color: "white", fontWeight: 800, mb: 2 }}>{title}</Typography>

      <Box sx={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "white",
              }}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default ComparisonChart;