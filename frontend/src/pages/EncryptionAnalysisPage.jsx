import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import MetricCard from "../components/MetricCard";
import useCrypto from "../context/useCrypto";

function ChartCard({ title, subtitle, children }) {
  return (
    <Card
      sx={{
        borderRadius: 6,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "white",
        boxShadow: "0 18px 45px rgba(0,0,0,0.20)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", mb: 0.8 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.68)", mb: 2.2 }}>
          {subtitle}
        </Typography>
        <Box sx={{ width: "100%", height: 330 }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function EncryptionAnalysisPage() {
  const { rsaResult, mlkemResult } = useCrypto();

  const timeData =
    rsaResult && mlkemResult
      ? [
          { name: "KeyGen", RSA: rsaResult.keygen_time_ms, MLKEM: mlkemResult.keygen_time_ms },
          { name: "Encrypt", RSA: rsaResult.encrypt_time_ms, MLKEM: mlkemResult.encrypt_time_ms },
          { name: "Decrypt", RSA: rsaResult.decrypt_time_ms, MLKEM: mlkemResult.decrypt_time_ms },
        ]
      : [];

  const sizeData =
    rsaResult && mlkemResult
      ? [
          { name: "Public Key", RSA: rsaResult.public_key_size, MLKEM: mlkemResult.public_key_size },
          { name: "Ciphertext", RSA: rsaResult.ciphertext_size, MLKEM: mlkemResult.ciphertext_size },
          { name: "Shared Secret", RSA: 0, MLKEM: mlkemResult.shared_secret_size },
        ]
      : [];

  const costData =
    rsaResult && mlkemResult
      ? (() => {
          const rsaTime =
            Number(rsaResult.keygen_time_ms || 0) +
            Number(rsaResult.encrypt_time_ms || 0) +
            Number(rsaResult.decrypt_time_ms || 0);

          const mlkemTime =
            Number(mlkemResult.keygen_time_ms || 0) +
            Number(mlkemResult.encrypt_time_ms || 0) +
            Number(mlkemResult.decrypt_time_ms || 0);

          const rsaSize =
            Number(rsaResult.public_key_size || 0) +
            Number(rsaResult.private_key_size || 0) +
            Number(rsaResult.ciphertext_size || 0);

          const mlkemSize =
            Number(mlkemResult.public_key_size || 0) +
            Number(mlkemResult.shared_secret_size || 0) +
            Number(mlkemResult.ciphertext_size || 0);

          const maxTime = Math.max(rsaTime, mlkemTime, 1);
          const maxSize = Math.max(rsaSize, mlkemSize, 1);

          return [
            {
              name: "Cost Score",
              RSA: ((rsaTime / maxTime) * 70) + ((rsaSize / maxSize) * 30),
              MLKEM: ((mlkemTime / maxTime) * 70) + ((mlkemSize / maxSize) * 30),
            },
          ];
        })()
      : [];

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
          Analiza e enkriptimit
        </Typography>

        <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 820 }}>
          Krahasimi i RSA dhe ML-KEM + AES për kohë, madhësi dhe score të kostos.
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 7,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <CardContent sx={{ p: 3.2 }}>
          <Typography variant="h4" fontWeight={900} mb={1}>
            RSA vs ML-KEM + AES
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.72)", mb: 2 }}>
            Analizë vizuale për performancën, madhësinë dhe koston e algoritmeve.
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

          {rsaResult && mlkemResult ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <MetricCard label="RSA Encrypt" value={`${rsaResult.encrypt_time_ms} ms`} />
                <MetricCard label="ML-KEM Encrypt" value={`${mlkemResult.encrypt_time_ms} ms`} />
                <MetricCard label="RSA Ciphertext" value={`${rsaResult.ciphertext_size} bytes`} />
                <MetricCard label="ML-KEM Ciphertext" value={`${mlkemResult.ciphertext_size} bytes`} />
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <ChartCard
                  title="Krahasimi i kohës"
                  subtitle="Koha e gjenerimit të çelësave, enkriptimit dhe dekriptimit."
                >
                  <ResponsiveContainer>
                    <BarChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" />
                      <YAxis stroke="rgba(255,255,255,0.75)" />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "14px",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="RSA" fill="#60a5fa" radius={[10, 10, 0, 0]} />
                      <Bar dataKey="MLKEM" fill="#a78bfa" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Krahasimi i madhësisë"
                  subtitle="Madhësia e public key, ciphertext dhe shared secret."
                >
                  <ResponsiveContainer>
                    <BarChart data={sizeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" />
                      <YAxis stroke="rgba(255,255,255,0.75)" />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "14px",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="RSA" fill="#34d399" radius={[10, 10, 0, 0]} />
                      <Bar dataKey="MLKEM" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>

              <Box sx={{ mt: 3 }}>
                <ChartCard
                  title="Score i kostos"
                  subtitle="Score i llogaritur nga koha dhe madhësia e output-it."
                >
                  <ResponsiveContainer>
                    <BarChart data={costData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" />
                      <YAxis stroke="rgba(255,255,255,0.75)" />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "14px",
                          color: "white",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="RSA" fill="#38bdf8" radius={[12, 12, 0, 0]} />
                      <Bar dataKey="MLKEM" fill="#f472b6" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>
            </>
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
              Ekzekuto krahasimin e enkriptimit që të shfaqet analiza.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default EncryptionAnalysisPage;