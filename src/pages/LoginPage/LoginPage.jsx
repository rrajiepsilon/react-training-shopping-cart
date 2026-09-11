import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { loginSchema, validateWithYup } from "../../validation/schemas.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import "./LoginPage.css";

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
      // Expected shape: { user: { username, firstName, lastName, email }, token }
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
    <div className="page-content login-page">
      <Helmet>
        <title>Sign in — Cartly</title>
        <meta name="description" content="Sign in to your Cartly account to check out faster and track your orders." />
      </Helmet>

      <form className="form-card" onSubmit={handleSubmit} noValidate aria-labelledby="login-heading">
        <h1 className="form-title" id="login-heading">
          Welcome back
        </h1>
        <p className="form-subtitle">Sign in to your Cartly account.</p>

        {apiError && (
          <div className="api-error" role="alert">
            {apiError}
          </div>
        )}

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="johndoe"
            value={form.username}
            onChange={handleChange}
            className={errors.username ? "input-error" : ""}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <span className="field-error" id="username-error" role="alert">
              {errors.username}
            </span>
          )}
        </div>

        <div className="field">
          <div className="field-label-row">
            <label htmlFor="password">Password</label>
            {/* POC placeholder — no forgot-password flow built yet */}
            <button type="button" className="forgot-link">
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span className="field-error" id="password-error" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        <label className="remember-row">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </label>

        <button type="submit" className="btn btn-primary signin-btn" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="signup-note">
          New to Cartly? <Link to="/register"><b>Create an account</b></Link>
        </p>
      </form>
    </div>
  );
}
