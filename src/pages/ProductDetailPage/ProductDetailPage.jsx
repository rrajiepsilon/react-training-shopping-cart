import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useFetch } from "../../hooks/useFetch.js";
import { useCartStore } from "../../store/useCartStore.js";
import StarRating from "../../components/StarRating/StarRating.jsx";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, loading, error } = useFetch(
    `https://fakestoreapi.com/products/${id}`
  );

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addedTimeoutRef = useRef(null);

  // Reset the "just added" button state if the user navigates to a different product
  useEffect(() => {
    return () => clearTimeout(addedTimeoutRef.current);
  }, [id]);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);

    // Button micro-feedback: flip to a confirmed "Added" state briefly
    setJustAdded(true);
    clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (product) addItem(product, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="page-content">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <p role="alert">Couldn't load product: {error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="page-content">
      <Helmet>
        <title>{`${product.title} — Cartly`}</title>
        <meta name="description" content={product.description.slice(0, 155)} />
      </Helmet>

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span className="capitalize">{product.category}</span> /{" "}
        <span className="current" aria-current="page">
          {product.title}
        </span>
      </nav>

      <div className="detail-layout">
        <div className="gallery">
          <div className="main-img">
            <img src={product.image} alt={product.title} />
          </div>
        </div>

        <div className="detail-info">
          <div className="category-tag">{product.category}</div>
          <h1 className="detail-title">{product.title}</h1>

          <StarRating rate={product.rating.rate} count={product.rating.count} size={14} />

          <p className="detail-price">${product.price.toFixed(2)}</p>

          <h2 className="desc-label">Description</h2>
          <p className="detail-desc">{product.description}</p>

          <div className="qty-row">
            <span className="qty-label" id="qty-label">
              Quantity
            </span>
            <div className="qty-box" role="group" aria-labelledby="qty-label">
              <button onClick={decrement} aria-label="Decrease quantity">
                &minus;
              </button>
              <span className="qty-num" aria-live="polite">
                {quantity}
              </span>
              <button onClick={increment} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <div className="btn-row">
            <button
              className={`btn btn-secondary detail-btn add-to-cart-btn ${justAdded ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={justAdded}
            >
              {justAdded ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{ marginRight: 8 }}
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Added
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginRight: 8 }}
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add to cart
                </>
              )}
            </button>
            <button className="btn btn-primary detail-btn" onClick={handleBuyNow}>
              Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
