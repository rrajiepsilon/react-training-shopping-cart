import { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { loginSchema, validateWithYup } from "../../validation/schemas.js";
import { useAuthStore } from "../../store/useAuthStore.js";

const LOGIN_API_URL = "http://localhost:5000/api/login";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = await validateWithYup(loginSchema, form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Invalid username or password.");
      }

      const data = await response.json();
      login(data.user, data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(
        err.message === "Failed to fetch"
          ? "Couldn't reach the server. Make sure the API is running at " + LOGIN_API_URL
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Helmet>
        <title>Sign in — Cartly</title>
        <meta name="description" content="Sign in to your Cartly account to check out faster and track your orders." />
      </Helmet>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="login-heading"
        variant="outlined"
        sx={{ p: { xs: 3, sm: 4 } }}
      >
        <Typography variant="h4" component="h1" id="login-heading" gutterBottom>
          Welcome back
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Sign in to your Cartly account.
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <TextField
          id="username"
          name="username"
          label="Username"
          autoComplete="username"
          placeholder="johndoe"
          value={form.username}
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}>
          <Button type="button" size="small">
            Forgot password?
          </Button>
        </Box>
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          fullWidth
          sx={{ mb: 1 }}
        />

        <FormControlLabel
          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
          label="Remember me"
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth disabled={submitting} sx={{ mb: 2 }}>
          {submitting ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          New to Cartly?{" "}
          <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
