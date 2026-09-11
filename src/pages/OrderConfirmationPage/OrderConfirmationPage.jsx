import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    // Direct navigation with no order in state — nothing to confirm
    return (
      <div className="page-content">
        <Helmet>
          <title>Order confirmation — Cartly</title>
        </Helmet>
        <div className="confirm-empty">
          <h1>No recent order found</h1>
          <p>
            Looks like there's no order to show. <Link to="/">Go back to shopping</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Helmet>
        <title>Order confirmed — Cartly</title>
        <meta name="description" content="Your Cartly order has been placed successfully." />
      </Helmet>

      <div className="confirm-card">
        <div className="confirm-icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="confirm-title">Order placed!</h1>
        <p className="confirm-subtitle">
          Thanks for shopping with Cartly. A confirmation has been sent for order{" "}
          <strong>#{order.orderId}</strong>.
        </p>

        <div className="confirm-meta-row">
          <div className="confirm-meta-item">
            <span className="confirm-meta-label">Order number</span>
            <span className="confirm-meta-value">#{order.orderId}</span>
          </div>
          <div className="confirm-meta-item">
            <span className="confirm-meta-label">Estimated delivery</span>
            <span className="confirm-meta-value">{order.deliveryDate}</span>
          </div>
          <div className="confirm-meta-item">
            <span className="confirm-meta-label">Total paid</span>
            <span className="confirm-meta-value">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="confirm-section">
          <h2 className="confirm-section-title">Shipping to</h2>
          <address className="confirm-address">
            {order.address.name}
            <br />
            {order.address.line1}
            <br />
            {order.address.cityStateZip}
            <br />
            {order.address.country}
          </address>
        </div>

        <div className="confirm-section">
          <h2 className="confirm-section-title">Items ({order.items.length})</h2>
          <ul className="confirm-items">
            {order.items.map((item) => (
              <li className="confirm-item" key={item.id}>
                <div className="confirm-item-img">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="confirm-item-info">
                  <div className="confirm-item-name">{item.title}</div>
                  <div className="confirm-item-qty">Qty {item.quantity}</div>
                </div>
                <div className="confirm-item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="confirm-btn-row">
          <button className="btn btn-primary confirm-btn" onClick={() => navigate("/")}>
            Continue shopping
          </button>
          <button className="btn btn-secondary confirm-btn" onClick={() => navigate("/account")}>
            View my orders
          </button>
        </div>
      </div>
    </div>
  );
}
