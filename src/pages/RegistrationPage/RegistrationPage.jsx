import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { registrationSchema, validateWithYup } from "../../validation/schemas.js";
import "./RegistrationPage.css";

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
      <div className="page-content">
        <Helmet>
          <title>Account created — Cartly</title>
        </Helmet>
        <div className="form-card success-card">
          <h1 className="form-title">You're all set, {form.firstName}!</h1>
          <p className="form-subtitle">Your Cartly account has been created.</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content registration-page">
      <Helmet>
        <title>Create an account — Cartly</title>
        <meta name="description" content="Register for a free Cartly account to check out faster and track your orders." />
      </Helmet>

      <form className="form-card" onSubmit={handleSubmit} noValidate aria-labelledby="register-heading">
        <h1 className="form-title" id="register-heading">
          Create your account
        </h1>
        <p className="form-subtitle">Fill in your details to register with Cartly.</p>

        {apiError && (
          <div className="api-error" role="alert">
            {apiError}
          </div>
        )}

        <div className="form-row">
          <Field label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
          <Field label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
        </div>

        <div className="form-row">
          <Field label="Age" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} />
          <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
        </div>

        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />

        <div className="section-label">Address</div>

        <Field label="Address line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} error={errors.addressLine1} />
        <Field
          label="Address line 2"
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
          placeholder="Apt, suite, etc. (optional)"
        />

        <div className="form-row">
          <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
          <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} />
        </div>

        <div className="form-row">
          <Field label="Zip code" name="zipCode" value={form.zipCode} onChange={handleChange} error={errors.zipCode} />
          <div className="field" aria-hidden="true" />
        </div>

        <div className="section-label">Account</div>

        <Field
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          autoComplete="username"
        />

        <div className="form-row">
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <Field
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, error, type = "text", placeholder, autoComplete }) {
  const errorId = `${name}-error`;
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={error ? "input-error" : ""}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
