import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import UserMenu from "../UserMenu/UserMenu.jsx";
import "./Header.css";

export default function Header() {
  const itemCount = useCartStore((state) => state.itemCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          Cartly
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <span>Deals</span>
          <span>About</span>
        </nav>

        <div className="header-right">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="header-link">
                Login
              </Link>
              <Link to="/register" className="header-link">
                Register
              </Link>
            </>
          )}

          <Link to="/cart" className="cart-link" aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
