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

function SignatureAnalysisPage() {
  const { rsaSignatureResult, mldsaSignatureResult } = useCrypto();

  const timeData =
    rsaSignatureResult && mldsaSignatureResult
      ? [
          {
            name: "KeyGen",
            RSA: rsaSignatureResult.keygen_time_ms,
            MLDSA: mldsaSignatureResult.keygen_time_ms,
          },
          {
            name: "Sign",
            RSA: rsaSignatureResult.sign_time_ms,
            MLDSA: mldsaSignatureResult.sign_time_ms,
          },
          {
            name: "Verify",
            RSA: rsaSignatureResult.verify_time_ms,
            MLDSA: mldsaSignatureResult.verify_time_ms,
          },
        ]
      : [];

  const sizeData =
    rsaSignatureResult && mldsaSignatureResult
      ? [
          {
            name: "Signature",
            RSA: rsaSignatureResult.signature_size,
            MLDSA: mldsaSignatureResult.signature_size,
          },
          {
            name: "Public Key",
            RSA: rsaSignatureResult.public_key_size,
            MLDSA: mldsaSignatureResult.public_key_size,
          },
          {
            name: "Private Key",
            RSA: rsaSignatureResult.private_key_size,
            MLDSA: mldsaSignatureResult.private_key_size,
          },
        ]
      : [];

  const costData =
    rsaSignatureResult && mldsaSignatureResult
      ? (() => {
          const rsaTime =
            Number(rsaSignatureResult.keygen_time_ms || 0) +
            Number(rsaSignatureResult.sign_time_ms || 0) +
            Number(rsaSignatureResult.verify_time_ms || 0);

          const mldsaTime =
            Number(mldsaSignatureResult.keygen_time_ms || 0) +
            Number(mldsaSignatureResult.sign_time_ms || 0) +
            Number(mldsaSignatureResult.verify_time_ms || 0);

          const rsaSize =
            Number(rsaSignatureResult.public_key_size || 0) +
            Number(rsaSignatureResult.private_key_size || 0) +
            Number(rsaSignatureResult.signature_size || 0);

          const mldsaSize =
            Number(mldsaSignatureResult.public_key_size || 0) +
            Number(mldsaSignatureResult.private_key_size || 0) +
            Number(mldsaSignatureResult.signature_size || 0);

          const maxTime = Math.max(rsaTime, mldsaTime, 1);
          const maxSize = Math.max(rsaSize, mldsaSize, 1);

          return [
            {
              name: "Cost Score",
              RSA: ((rsaTime / maxTime) * 70) + ((rsaSize / maxSize) * 30),
              MLDSA: ((mldsaTime / maxTime) * 70) + ((mldsaSize / maxSize) * 30),
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
          Analiza e nënshkrimit digjital
        </Typography>

        <Typography sx={{ color: "rgba(255,255,255,0.72)", maxWidth: 820 }}>
          Krahasimi i RSA Signature dhe ML-DSA për kohë, madhësi dhe score të kostos.
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
            RSA Signature vs ML-DSA
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.72)", mb: 2 }}>
            Analizë vizuale për performancën, madhësinë dhe koston e algoritmeve të nënshkrimit.
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2.5 }} />

          {rsaSignatureResult && mldsaSignatureResult ? (
            <>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 2,
                  mb: 3,
                }}
              >
                <MetricCard label="RSA Sign" value={`${rsaSignatureResult.sign_time_ms} ms`} />
                <MetricCard label="ML-DSA Sign" value={`${mldsaSignatureResult.sign_time_ms} ms`} />
                <MetricCard
                  label="RSA Signature"
                  value={`${rsaSignatureResult.signature_size} bytes`}
                />
                <MetricCard
                  label="ML-DSA Signature"
                  value={`${mldsaSignatureResult.signature_size} bytes`}
                />
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
                  subtitle="Koha për gjenerim të çelësave, nënshkrim dhe verifikim."
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
                      <Bar dataKey="MLDSA" fill="#a78bfa" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Krahasimi i madhësisë"
                  subtitle="Madhësia e nënshkrimit dhe e çelësave për secilin algoritëm."
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
                      <Bar dataKey="MLDSA" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>

              <Box sx={{ mt: 3 }}>
                <ChartCard
                  title="Score i kostos"
                  subtitle="Score i llogaritur nga koha dhe madhësia e nënshkrimit."
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
                      <Bar dataKey="MLDSA" fill="#f472b6" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Box>
            </>
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
              Ekzekuto krahasimin e nënshkrimit që të shfaqet analiza.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default SignatureAnalysisPage;