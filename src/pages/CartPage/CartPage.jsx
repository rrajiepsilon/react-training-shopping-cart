import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCartStore } from "../../store/useCartStore.js";
import "./CartPage.css";

const SHIPPING = 4.99;
const TAX_RATE = 0.08;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const navigate = useNavigate();

  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="page-content">
        <Helmet>
          <title>Your cart — Cartly</title>
        </Helmet>
        <h1 className="cart-title">Your cart</h1>
        <p className="empty-cart">
          Your cart is empty. <Link to="/">Continue shopping</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Helmet>
        <title>{`Your cart (${items.length}) — Cartly`}</title>
        <meta name="description" content="Review the items in your Cartly shopping cart before checkout." />
      </Helmet>

      <h1 className="cart-title">Your cart</h1>
      <p className="cart-subtitle">{items.length} items</p>

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => (
            <li className="cart-item" key={item.id}>
              <div className="cart-item-img">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>

              <div className="cart-item-info">
                <div className="cart-item-name">{item.title}</div>
                <div className="cart-item-cat">{item.category}</div>
                <div className="cart-item-price">${item.price.toFixed(2)} each</div>
              </div>

              <div className="qty-box" role="group" aria-label={`Quantity for ${item.title}`}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label={`Decrease quantity of ${item.title}`}
                >
                  &minus;
                </button>
                <span className="qty-num" aria-live="polite">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label={`Increase quantity of ${item.title}`}
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.title} from cart`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <div className="summary-card">
            <h2 className="summary-title">Order summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary summary-btn" onClick={handleCheckout}>
              Checkout
            </button>
            <button className="btn btn-secondary summary-btn" onClick={() => navigate("/")}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
