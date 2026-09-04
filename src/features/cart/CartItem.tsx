import { memo } from 'react';
import type { CartItem as CartItemType } from '../../shared/types';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
}

function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <article className="cart-item">
      <div className="cart-item__image-wrap">
        <img src={item.image} alt={item.title} className="cart-item__image" />
      </div>

      <div className="cart-item__info">
        <h3 className="cart-item__title">{item.title}</h3>
        <p className="cart-item__category">{item.category}</p>
        <p className="cart-item__unit-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item__qty">
        <button
          type="button"
          className="qty-btn"
          onClick={() => onDecrease(item.id)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          type="button"
          className="qty-btn"
          onClick={() => onIncrease(item.id)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <p className="cart-item__total">${lineTotal}</p>

      <button
        type="button"
        className="cart-item__remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.title}`}
      >
        ×
      </button>
    </article>
  );
}

export default memo(CartItem);
