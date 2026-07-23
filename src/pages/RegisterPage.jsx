import { useState } from 'react';
import {
  validateAge,
  validateAddress,
  validateCity,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePhone,
  validateState,
  validateZip,
} from '../utils/validation';
import './CartPage.css';
import './RegisterPage.css';

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const initialForm = {
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

const initialTouched = Object.fromEntries(Object.keys(initialForm).map((key) => [key, false]));

const validators = {
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

function RegisterPage({ onCancel, onGoHome, onGoCart }) {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const errors = Object.fromEntries(
    Object.entries(validators).map(([field, validate]) => [field, validate(form[field])]),
  );

  const showError = (field) => (touched[field] || submitted) && errors[field];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return;

    setSuccess(true);
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
              <button type="button" className="btn btn-primary" onClick={onCancel}>
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
                    First name
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="given-name"
                    />
                    {showError('firstName') && (
                      <span className="field-error">{errors.firstName}</span>
                    )}
                  </label>

                  <label className="register-field">
                    Last name
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="family-name"
                    />
                    {showError('lastName') && <span className="field-error">{errors.lastName}</span>}
                  </label>
                </div>

                <div className="register-row">
                  <label className="register-field">
                    Age
                    <input
                      type="number"
                      name="age"
                      placeholder="28"
                      min="13"
                      max="120"
                      value={form.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {showError('age') && <span className="field-error">{errors.age}</span>}
                  </label>

                  <label className="register-field">
                    Phone
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                    />
                    {showError('phone') && <span className="field-error">{errors.phone}</span>}
                  </label>
                </div>

                <label className="register-field">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                  />
                  {showError('email') && <span className="field-error">{errors.email}</span>}
                </label>

                <div className="register-section" aria-hidden="true">
                  <span>Address</span>
                </div>

                <label className="register-field">
                  Address line 1
                  <input
                    type="text"
                    name="address1"
                    placeholder="123 Market Street"
                    value={form.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="address-line1"
                  />
                  {showError('address1') && <span className="field-error">{errors.address1}</span>}
                </label>

                <label className="register-field">
                  Address line 2
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
                    City
                    <input
                      type="text"
                      name="city"
                      placeholder="San Francisco"
                      value={form.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="address-level2"
                    />
                    {showError('city') && <span className="field-error">{errors.city}</span>}
                  </label>

                  <label className="register-field">
                    State
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={!form.state ? 'placeholder' : ''}
                      autoComplete="address-level1"
                      required
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
                    Zip code
                    <input
                      type="text"
                      name="zip"
                      placeholder="94103"
                      value={form.zip}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="postal-code"
                    />
                    {showError('zip') && <span className="field-error">{errors.zip}</span>}
                  </label>
                </div>

                <div className="register-actions">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <footer className="cartly-footer">Data from fakestoreapi.com — internal POC</footer>
    </div>
  );
}

export default RegisterPage;
