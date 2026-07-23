import { useState } from 'react';
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePhone,
} from '../utils/validation';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
};

const initialTouched = {
  fullName: false,
  email: false,
  phone: false,
  address: false,
};

const validators = {
  fullName: validateName,
  email: validateEmail,
  phone: validatePhone,
  address: validateAddress,
};

function CheckoutForm({ onClose }) {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const errors = {
    fullName: validators.fullName(form.fullName),
    email: validators.email(form.email),
    phone: validators.phone(form.phone),
    address: validators.address(form.address),
  };

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

  if (success) {
    return (
      <div className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-success">
        <div className="checkout-modal__panel">
          <h2 id="checkout-success">Order placed!</h2>
          <p>Thank you, {form.fullName}. Your order has been submitted successfully.</p>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="checkout-modal__panel">
        <div className="checkout-modal__header">
          <h2 id="checkout-title">Checkout</h2>
          <button type="button" className="checkout-modal__close" onClick={onClose} aria-label="Close checkout">
            ×
          </button>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <label className="checkout-field">
            Full Name
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('fullName') && <span className="field-error">{errors.fullName}</span>}
          </label>

          <label className="checkout-field">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('email') && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="checkout-field">
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('phone') && <span className="field-error">{errors.phone}</span>}
          </label>

          <label className="checkout-field">
            Address
            <textarea
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {showError('address') && <span className="field-error">{errors.address}</span>}
          </label>

          <button type="submit" className="btn btn-primary">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutForm;
