import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, fetchProducts } from '../api';
import CartItem from '../components/CartItem';
import CheckoutForm from '../components/CheckoutForm';
import {
  applyCoupon,
  decreaseQuantity,
  hydrateCart,
  increaseQuantity,
  removeItem,
  SHIPPING_COST,
} from '../store/cartSlice';
import './CartPage.css';

function CartPage({ onReturnHome }) {
  const dispatch = useDispatch();
  const { items, subtotal, tax, discount, couponCode, totalItems, grandTotal } = useSelector(
    (state) => state.cart,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [cartData, products] = await Promise.all([fetchCart(), fetchProducts()]);
      const productMap = Object.fromEntries(products.map((product) => [product.id, product]));

      const hydratedItems = cartData.products
        .map(({ productId, quantity }) => {
          const product = productMap[productId];
          if (!product) return null;
          return { ...product, quantity };
        })
        .filter(Boolean);

      dispatch(hydrateCart(hydratedItems));
    } catch (err) {
      setError(err.message || 'Failed to load cart data.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

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
    (id) => dispatch(increaseQuantity(id)),
    [dispatch],
  );

  const handleDecrease = useCallback(
    (id) => dispatch(decreaseQuantity(id)),
    [dispatch],
  );

  const handleRemove = useCallback(
    (id) => dispatch(removeItem(id)),
    [dispatch],
  );

  const handleApplyCoupon = (event) => {
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

    dispatch(applyCoupon(code));
    setCouponMessage(
      code === 'SAVE10' ? '10% discount applied.' : '$20 discount applied.',
    );
  };

  const itemLabel = totalItems === 1 ? '1 item' : `${totalItems} items`;

  return (
    <div className="cartly">
      <main className="cartly-main">
        {loading && (
          <div className="cartly-state">
            <p>Loading your cart...</p>
          </div>
        )}

        {!loading && error && (
          <div className="cartly-state">
            <p>{error}</p>
            <button type="button" className="btn btn-primary" onClick={loadCart}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="cartly-state">
            <h2>Your cart is empty</h2>
            <p>Add items to get started.</p>
            <button type="button" className="btn btn-secondary" onClick={onReturnHome}>
              Return to Home
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="cartly-layout">
            <section className="cartly-items">
              <div className="cartly-items__heading">
                <h1>Your cart</h1>
                <p>{itemLabel}</p>
              </div>

              <input
                type="search"
                className="cartly-search"
                placeholder="Search items..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {filteredItems.length === 0 ? (
                <p className="cartly-empty-search">No items match your search.</p>
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
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                />
                <button type="submit" className="btn btn-secondary">
                  Apply
                </button>
              </form>
              {couponMessage && <p className="coupon-message">{couponMessage}</p>}

              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
              <button type="button" className="btn btn-secondary btn-block" onClick={onReturnHome}>
                Return to Home
              </button>
            </aside>
          </div>
        )}
      </main>
      {showCheckout && <CheckoutForm onClose={() => setShowCheckout(false)} />}
    </div>
  );
}

export default CartPage;
