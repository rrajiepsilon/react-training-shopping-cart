import { Link } from 'react-router-dom';
import type { Product } from '../../../shared/types';
import StarRating from '../../../shared/components/StarRating';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-thumb">
        {/* loading/fetchPriority must precede src: React assigns props in
            order, and the browser starts the fetch as soon as src lands. */}
        <img
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          src={product.image}
          alt={product.title}
          width="640"
          height="640"
        />
        <span className="product-card-category">{product.category}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <StarRating rate={product.rating.rate} count={product.rating.count} />
        <div className="product-card-footer">
          <span className="product-card-price">
            ${product.price.toFixed(2)}
          </span>
          {/* <button className="btn btn-primary product-card-btn">
            Add to cart
          </button> */}
        </div>
      </div>
    </Link>
  );
}
