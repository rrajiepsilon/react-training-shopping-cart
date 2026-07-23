import { Link } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  

  const handleAddToCart = (e) => {
    e.preventDefault(); // don't follow the Link when clicking the button
    
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
          <button className="btn btn-primary product-card-btn" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </Link>
  );
}
