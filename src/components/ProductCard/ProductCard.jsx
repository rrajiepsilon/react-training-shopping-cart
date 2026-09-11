import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import StarRating from "../StarRating/StarRating.jsx";
import { useCartStore } from "../../store/useCartStore.js";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef(null);

  const handleAddToCart = (e) => {
    e.preventDefault(); // don't follow the Link when clicking the button
    addItem(product, 1);

    // Button micro-feedback: flip to a confirmed "Added" state briefly
    setJustAdded(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-thumb">
        <img src={product.image} alt={product.title} loading="lazy" />
        <span className="product-card-category">{product.category}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <StarRating rate={product.rating.rate} count={product.rating.count} />
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button
            className={`btn btn-primary product-card-btn ${justAdded ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={justAdded}
            aria-label={justAdded ? `${product.title} added to cart` : `Add ${product.title} to cart`}
          >
            {justAdded ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
