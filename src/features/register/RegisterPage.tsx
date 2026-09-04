import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './api';
import { US_STATES } from '../../shared/constants/states';
import type { RegisterFormData } from '../../shared/types';
import {
  validateAddress,
  validateAge,
  validateCity,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateState,
  validateZip,
} from '../../shared/utils/validation';
import '../cart/CartPage.css';
import './RegisterPage.css';

type RegisterField = keyof RegisterFormData;
type TouchedFields = Record<RegisterField, boolean>;

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
}

const initialForm: RegisterFormData = {
  firstName: '',
  lastName: '',
  age: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};

const initialTouched: TouchedFields = {
  firstName: false,
  lastName: false,
  age: false,
  phone: false,
  email: false,
  address1: false,
  address2: false,
  city: false,
  state: false,
  zip: false,
};

const validators: Record<RegisterField, (value: string) => string> = {
  firstName: validateFirstName,
  lastName: validateLastName,
  age: validateAge,
  phone: validatePhone,
  email: validateEmail,
  address1: validateAddress,
  address2: () => '',
  city: validateCity,
  state: validateState,
  zip: validateZip,
};

function isRegisterField(name: string): name is RegisterField {
  return Object.hasOwn(initialForm, name);
}

function FieldLabel({ children, required = true }: FieldLabelProps) {
  return (
    <span className="register-field__label">
      {children}
      {required && (
        <span className="register-field__required" aria-hidden="true">
          *
        </span>
      )}
    </span>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormData>(initialForm);
  const [touched, setTouched] = useState<TouchedFields>(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const errors: Record<RegisterField, string> = {
    firstName: validators.firstName(form.firstName),
    lastName: validators.lastName(form.lastName),
    age: validators.age(form.age),
    phone: validators.phone(form.phone),
    email: validators.email(form.email),
    address1: validators.address1(form.address1),
    address2: validators.address2(form.address2),
    city: validators.city(form.city),
    state: validators.state(form.state),
    zip: validators.zip(form.zip),
  };

  const showError = (field: RegisterField): string | false =>
    (touched[field] || submitted) && errors[field];

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (!isRegisterField(name)) return;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = event.target;
    if (!isRegisterField(name)) return;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await registerUser(form);
      setSuccess(true);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cartly">
      <main className="cartly-main register-main">
        <div className="register-card">
          {success ? (
            <div className="register-success">
              <h2>Account created</h2>
              <p>
                Welcome, {form.firstName}. Your Cartly account has been registered successfully.
              </p>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
                Continue
              </button>
            </div>
          ) : (
            <>
              <h1 className="register-card__title">Create your account</h1>
              <p className="register-card__subtitle">Fill in your details to register with Cartly.</p>

              <form className="register-form" onSubmit={handleSubmit} noValidate>
                <div className="register-row">
                  <label className="register-field">
                    <FieldLabel>First name</FieldLabel>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="given-name"
                      aria-required="true"
                    />
                    {showError('firstName') && (
                      <span className="field-error">{errors.firstName}</span>
                    )}
                  </label>

                  <label className="register-field">
                    <FieldLabel>Last name</FieldLabel>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="family-name"
                      aria-required="true"
                    />
                    {showError('lastName') && <span className="field-error">{errors.lastName}</span>}
                  </label>
                </div>

                <div className="register-row">
                  <label className="register-field">
                    <FieldLabel>Age</FieldLabel>
                    <input
                      type="number"
                      name="age"
                      placeholder="28"
                      min="13"
                      max="120"
                      value={form.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-required="true"
                    />
                    {showError('age') && <span className="field-error">{errors.age}</span>}
                  </label>

                  <label className="register-field">
                    <FieldLabel>Phone</FieldLabel>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                      aria-required="true"
                    />
                    {showError('phone') && <span className="field-error">{errors.phone}</span>}
                  </label>
                </div>

                <label className="register-field">
                  <FieldLabel>Email</FieldLabel>
                  <input
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                    aria-required="true"
                  />
                  {showError('email') && <span className="field-error">{errors.email}</span>}
                </label>

                <div className="register-section" aria-hidden="true">
                  <span>Address</span>
                </div>

                <label className="register-field">
                  <FieldLabel>Address line 1</FieldLabel>
                  <input
                    type="text"
                    name="address1"
                    placeholder="123 Market Street"
                    value={form.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="address-line1"
                    aria-required="true"
                  />
                  {showError('address1') && <span className="field-error">{errors.address1}</span>}
                </label>

                <label className="register-field">
                  <FieldLabel required={false}>Address line 2</FieldLabel>
                  <input
                    type="text"
                    name="address2"
                    placeholder="Apt 4B (optional)"
                    value={form.address2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="address-line2"
                  />
                </label>

                <div className="register-row">
                  <label className="register-field">
                    <FieldLabel>City</FieldLabel>
                    <input
                      type="text"
                      name="city"
                      placeholder="San Francisco"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="address-level2"
                      aria-required="true"
                    />
                    {showError('city') && <span className="field-error">{errors.city}</span>}
                  </label>

                  <label className="register-field">
                    <FieldLabel>State</FieldLabel>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={!form.state ? 'placeholder' : ''}
                      autoComplete="address-level1"
                      required
                      aria-required="true"
                    >
                      <option value="" disabled>
                        California
                      </option>
                      {US_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {showError('state') && <span className="field-error">{errors.state}</span>}
                  </label>
                </div>

                <div className="register-row register-row--half">
                  <label className="register-field">
                    <FieldLabel>Zip code</FieldLabel>
                    <input
                      type="text"
                      name="zip"
                      placeholder="94103"
                      value={form.zip}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="postal-code"
                      aria-required="true"
                    />
                    {showError('zip') && <span className="field-error">{errors.zip}</span>}
                  </label>
                </div>

                {submitError && (
                  <p className="register-submit-error" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="register-actions">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Registering…' : 'Register'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
