import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import type { PaymentMethod, ShippingAddress } from '../../shared/types';
import './CheckoutPage.css';

const SHIPPING = 4.99;
const TAX_RATE = 0.08;

// In a real app this would come from the user's saved profile / addresses
const SHIPPING_ADDRESS: ShippingAddress = {
  label: 'Home',
  name: 'John Doe',
  line1: '123 Market Street, Apt 4B',
  cityStateZip: 'San Francisco, California 94103',
  country: 'United States',
  phone: '+1 (555) 123-4567',
};

function getEstimatedDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 6);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + tax + shipping;
  const deliveryDate = getEstimatedDeliveryDate();

  const handlePlaceOrder = () => {
    // POC placeholder — wire this up to a real order-creation API later
    alert('Order placed! Thanks for shopping with Cartly.');
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="page-content">
        <h1 className="checkout-title">Checkout</h1>
        <p className="empty-checkout">
          Your cart is empty. <Link to="/">Continue shopping</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="breadcrumb">
        <Link to="/cart">Cart</Link> / <span className="current">Checkout</span>
      </div>
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="main-col">
          {/* Shipping address */}
          <div className="card">
            <div className="card-title-row">
              <div className="card-title">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Shipping address
              </div>
              <button className="edit-link">Change</button>
            </div>
            <span className="addr-tag">{SHIPPING_ADDRESS.label}</span>
            <div className="addr-name">{SHIPPING_ADDRESS.name}</div>
            <div className="addr-line">
              {SHIPPING_ADDRESS.line1}
              <br />
              {SHIPPING_ADDRESS.cityStateZip}
              <br />
              {SHIPPING_ADDRESS.country}
              <br />
              {SHIPPING_ADDRESS.phone}
            </div>
          </div>

          {/* Delivery date */}
          <div className="card">
            <div className="card-title-row">
              <div className="card-title">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                Delivery date
              </div>
            </div>
            <div className="delivery-option">
              <div className="radio-dot" />
              <div className="delivery-info">
                <div className="delivery-date">
                  {deliveryDate} — Standard delivery
                </div>
                <div className="delivery-sub">
                  Arrives within 3–5 business days
                </div>
              </div>
              <div className="delivery-price">Free</div>
            </div>
          </div>

          {/* Payment method */}
          <div className="card">
            <div className="card-title-row">
              <div className="card-title">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Payment method
              </div>
            </div>

            <button
              className={`pay-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <span
                className={`pay-radio ${paymentMethod === 'card' ? 'selected' : ''}`}
              />
              <span className="pay-label">
                Credit / Debit card · ending in 4242
              </span>
            </button>

            <button
              className={`pay-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cod')}
            >
              <span
                className={`pay-radio ${paymentMethod === 'cod' ? 'selected' : ''}`}
              />
              <span className="pay-label">Cash on delivery</span>
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="side-col">
          <div className="summary-card">
            <h2 className="summary-title">Order summary</h2>

            {items.map((item) => (
              <div className="mini-item" key={item.id}>
                <div className="mini-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="mini-info">
                  <div className="mini-name">{item.title}</div>
                  <div className="mini-qty">Qty {item.quantity}</div>
                </div>
                <div className="mini-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="divider" />

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place order
            </button>

            <div className="secure-note">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
