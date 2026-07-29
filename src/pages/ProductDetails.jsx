import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import StarRating from "../components/StarRating.jsx";
import { useCartStore } from "../store/useCartStore.js";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { data: product, loading, error } = useFetch(
    `https://fakestoreapi.com/products/${id}`
  );

  if (loading) return <div className="page-content">Loading...</div>;
  if (error) return <div className="page-content error-banner">Couldn't load product.</div>;

  return (
    <div className="page-content product-details">
      <Link to="/">← Back to products</Link>
      <div className="product-details-grid">
        <img src={product.image} alt={product.title} />
        <div>
          <span className="product-category">{product.category}</span>
          <h1>{product.title}</h1>
          <StarRating rate={product.rating.rate} count={product.rating.count} />
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          <button className="btn btn-primary" onClick={() => addItem(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}