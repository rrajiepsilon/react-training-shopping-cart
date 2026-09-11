import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuthStore } from "../../store/useAuthStore.js";
import "./AccountPage.css";

// POC placeholder data — a real app would fetch this from an orders API
const RECENT_ORDERS = [
  { id: "CART-100482", date: "28 Aug 2026", items: 3, status: "transit", total: 304.32 },
  { id: "CART-100455", date: "14 Aug 2026", items: 1, status: "delivered", total: 64.5 },
  { id: "CART-100431", date: "02 Aug 2026", items: 2, status: "delivered", total: 121.98 },
];

const STATS = [
  { label: "Total orders", value: 12 },
  { label: "In transit", value: 2 },
  { label: "Wishlist items", value: 7 },
];

const DEFAULT_ADDRESS = {
  name: "John Doe",
  line: "123 Market Street, San Francisco, CA 94103",
};

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = getInitials(user?.firstName, user?.lastName, user?.username);
  const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || "there";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="page-content">
      <Helmet>
        <title>My account — Cartly</title>
        <meta name="description" content="View your recent orders and manage your Cartly account." />
      </Helmet>

      <h1 className="account-title">My account</h1>
      <p className="account-subtitle">Manage your orders and profile.</p>

      <div className="account-layout">
        <aside className="side-col" aria-label="Account navigation">
          <div className="profile-card">
            <div className="profile-row">
              <span className="avatar" aria-hidden="true">
                {initials}
              </span>
              <div>
                <div className="profile-name">{displayName}</div>
                <div className="profile-email">{user?.email}</div>
              </div>
            </div>
            <nav>
              <button className="menu-item active" type="button" aria-current="page">
                Dashboard
              </button>
              <button className="menu-item" type="button">
                Profile
              </button>
              <button className="menu-item logout" type="button" onClick={handleLogout}>
                Logout
              </button>
            </nav>
          </div>
        </aside>

        <div className="main-col">
          <div className="stat-row">
            {STATS.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <section className="card" aria-labelledby="recent-orders-heading">
            <div className="card-header">
              <h2 className="card-title" id="recent-orders-heading">
                Recent orders
              </h2>
              <button className="view-all" type="button">
                View all
              </button>
            </div>

            <ul className="order-list">
              {RECENT_ORDERS.map((order) => (
                <li className="order-row" key={order.id}>
                  <div className="order-thumb" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <path d="M21 15l-5-5L5 21"></path>
                    </svg>
                  </div>
                  <div className="order-info">
                    <div className="order-id">#{order.id}</div>
                    <div className="order-meta">
                      {order.date} · {order.items} item{order.items === 1 ? "" : "s"}
                    </div>
                  </div>
                  <span className={`order-status ${order.status}`}>
                    <span className="dot" aria-hidden="true"></span>
                    {order.status === "transit" ? "In transit" : "Delivered"}
                  </span>
                  <div className="order-price">${order.total.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card" aria-labelledby="default-address-heading">
            <div className="addr-label" id="default-address-heading">
              Default address
            </div>
            <div className="addr-row">
              <div>
                <div className="addr-name">{DEFAULT_ADDRESS.name}</div>
                <div className="addr-text">{DEFAULT_ADDRESS.line}</div>
              </div>
              <button className="edit-btn" type="button">
                Edit
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function getInitials(firstName, lastName, username) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  if (username) return username.slice(0, 2).toUpperCase();
  return "U";
}
