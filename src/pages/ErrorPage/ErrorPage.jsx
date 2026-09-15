import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ErrorPage({ onRetry }) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Helmet>
        <title>Something went wrong — Cartly</title>
      </Helmet>

      <Paper sx={{ p: 4 }} role="alert">
        <Typography variant="h5" component="h1" gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Some error occurred, please contact admin.
        </Typography>
        <Stack direction="row" spacing={2}>
          {onRetry && (
            <Button variant="outlined" onClick={onRetry}>
              Try again
            </Button>
          )}
          <Button variant="contained" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
