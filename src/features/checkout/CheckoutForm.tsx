import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import type { CheckoutFormData } from '../../shared/types';
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePhone,
} from '../../shared/utils/validation';

type CheckoutField = keyof CheckoutFormData;
type TouchedFields = Record<CheckoutField, boolean>;

interface CheckoutFormProps {
  onClose: () => void;
}

const initialForm: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
};

const initialTouched: TouchedFields = {
  fullName: false,
  email: false,
  phone: false,
  address: false,
};

const validators: Record<CheckoutField, (value: string) => string> = {
  fullName: validateName,
  email: validateEmail,
  phone: validatePhone,
  address: validateAddress,
};

function isCheckoutField(name: string): name is CheckoutField {
  return Object.hasOwn(initialForm, name);
}

function CheckoutForm({ onClose }: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [touched, setTouched] = useState<TouchedFields>(initialTouched);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const errors: Record<CheckoutField, string> = {
    fullName: validators.fullName(form.fullName),
    email: validators.email(form.email),
    phone: validators.phone(form.phone),
    address: validators.address(form.address),
  };

  const showError = (field: CheckoutField): string | false =>
    (touched[field] || submitted) && errors[field];

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (!isCheckoutField(name)) return;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = event.target;
    if (!isCheckoutField(name)) return;
    setTouched((current) => ({ ...current, [name]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
