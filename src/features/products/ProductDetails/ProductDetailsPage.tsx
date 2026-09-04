import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StarRating from '../../../shared/components/StarRating';
import { useFetch } from '../../../shared/hooks/useFetch';
import { useCartStore } from '../../../store/useCartStore';
import type { Product } from '../../../shared/types';
import './ProductDetailsPage.css';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const {
    data: product,
    loading,
    error,
  } = useFetch<Product>(id ? `https://fakestoreapi.com/products/${id}` : null);

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const decrement = () =>
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  const increment = () => setQuantity((currentQuantity) => currentQuantity + 1);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity);
    setIsAdded(true);

    // Reset after 1.5 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  if (!id)
    return (
      <div className="page-content error-banner">Couldn't load product.</div>
    );
  if (loading) return <div className="page-content">Loading...</div>;
  if (error || !product) {
    return (
      <div className="page-content error-banner">Couldn't load product.</div>
    );
  }

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

          <div className="qty-row">
            <span className="qty-label">Quantity</span>
            <div className="qty-box">
              <button onClick={decrement} aria-label="Decrease quantity">
                &minus;
              </button>
              <span className="qty-num">{quantity}</span>
              <button onClick={increment} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <button
            className={`btn btn-primary ${isAdded ? 'btn-added' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? '✓ Added to cart!' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
