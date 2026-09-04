import { useCallback, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { SHIPPING_COST, useCartStore } from '../../store/useCartStore';
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const tax = useCartStore((state) => state.tax);
  const discount = useCartStore((state) => state.discount);
  const couponCode = useCartStore((state) => state.couponCode);
  const totalItems = useCartStore((state) => state.totalItems);
  const grandTotal = useCartStore((state) => state.grandTotal);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const applyCoupon = useCartStore((state) => state.applyCoupon);

  const [search, setSearch] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }, [items, search]);

  const handleIncrease = useCallback(
    (id: number) => increaseQuantity(id),
    [increaseQuantity],
  );

  const handleDecrease = useCallback(
    (id: number) => decreaseQuantity(id),
    [decreaseQuantity],
  );

  const handleRemove = useCallback(
    (id: number) => removeItem(id),
    [removeItem],
  );

  const handleApplyCoupon = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponMessage('Enter a coupon code.');
      return;
    }

    if (code !== 'SAVE10' && code !== 'FLAT20') {
      setCouponMessage('Invalid coupon. Try SAVE10 or FLAT20.');
      return;
    }

    applyCoupon(code);
    setCouponMessage(
      code === 'SAVE10' ? '10% discount applied.' : '$20 discount applied.',
    );
  };

  const itemLabel = totalItems === 1 ? '1 item' : `${totalItems} items`;

  return (
    <div className="cartly">
      <main className="cartly-main">
        {items.length === 0 && (
          <div className="cartly-state">
            <h2>Your cart is empty</h2>
            <p>Add items to get started.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        )}

        {items.length > 0 && (
          <div className="cartly-layout">
            <section className="cartly-items">
              <div className="cartly-items__heading">
                <h1>Your cart</h1>
                <p>{itemLabel}</p>
              </div>

              <input
                type="search"
                className="cartly-search"
                aria-label="Search cart items"
                placeholder="Search items..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {filteredItems.length === 0 ? (
                <p className="cartly-empty-search">
                  No items match your search.
                </p>
              ) : (
                <div className="cartly-item-list">
                  {filteredItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </section>

            <aside className="cartly-summary">
              <h2>Order summary</h2>

              <dl className="summary-rows">
                <div className="summary-row">
                  <dt>Subtotal</dt>
                  <dd>${subtotal.toFixed(2)}</dd>
                </div>
                {discount > 0 && (
                  <div className="summary-row summary-row--discount">
                    <dt>Discount{couponCode ? ` (${couponCode})` : ''}</dt>
                    <dd>−${discount.toFixed(2)}</dd>
                  </div>
                )}
                <div className="summary-row">
                  <dt>Shipping</dt>
                  <dd>${SHIPPING_COST.toFixed(2)}</dd>
                </div>
                <div className="summary-row">
                  <dt>Tax</dt>
                  <dd>${tax.toFixed(2)}</dd>
                </div>
                <div className="summary-row summary-row--total">
                  <dt>Total</dt>
                  <dd>${grandTotal.toFixed(2)}</dd>
                </div>
              </dl>

              <form className="coupon-form" onSubmit={handleApplyCoupon}>
                <input
                  type="text"
                  aria-label="Coupon code"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                />
                <button type="submit" className="btn btn-secondary">
                  Apply
                </button>
              </form>
              {couponMessage && (
                <p className="coupon-message">{couponMessage}</p>
              )}

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;
