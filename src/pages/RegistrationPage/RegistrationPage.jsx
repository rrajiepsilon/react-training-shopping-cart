import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { registrationSchema, validateWithYup } from "../../validation/schemas.js";

const REGISTER_API_URL = "http://localhost:5000/api/register";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function RegistrationPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const validationErrors = await validateWithYup(registrationSchema, form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          age: Number(form.age),
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
          },
          username: form.username,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || "Registration failed. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setApiError(
        err.message === "Failed to fetch"
          ? "Couldn't reach the server. Make sure the API is running at " + REGISTER_API_URL
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setApiError("");
    navigate("/");
  };

  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Helmet>
          <title>Account created — Cartly</title>
        </Helmet>
        <Paper variant="outlined" sx={{ p: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your Cartly account has been created.
          </Alert>
          <Typography variant="h4" component="h1" gutterBottom>
            You're all set, {form.firstName}!
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")} sx={{ mt: 2 }}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Helmet>
        <title>Create an account — Cartly</title>
        <meta name="description" content="Register for a free Cartly account to check out faster and track your orders." />
      </Helmet>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="register-heading"
        variant="outlined"
        sx={{ p: { xs: 3, sm: 4 } }}
      >
        <Typography variant="h4" component="h1" id="register-heading" gutterBottom>
          Create your account
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Fill in your details to register with Cartly.
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
          </Grid>
          <Grid size={12}>
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1.5 }}>
          Address
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Field label="Address line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} error={errors.addressLine1} />
          </Grid>
          <Grid size={12}>
            <Field
              label="Address line 2"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              placeholder="Apt, suite, etc. (optional)"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Zip code" name="zipCode" value={form.zipCode} onChange={handleChange} error={errors.zipCode} />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1.5 }}>
          Account
        </Typography>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Field
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
              autoComplete="username"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </Grid>
        </Grid>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={22} color="inherit" /> : "Register"}
          </Button>
          <Button type="button" variant="outlined" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

function Field({ label, name, value, onChange, error, type = "text", placeholder, autoComplete }) {
  return (
    <TextField
      id={name}
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      error={Boolean(error)}
      helperText={error}
      fullWidth
    />
  );
}
