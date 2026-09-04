import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from '../shared/components/Footer';
import Header from '../shared/components/Header';
import ProductListPage from '../features/products/ProductList/ProductListPage';

// The landing route stays eager so it costs no extra round trip. Every other
// route splits out of the initial bundle, which also splits their CSS.
const ProductDetailsPage = lazy(
  () => import('../features/products/ProductDetails/ProductDetailsPage'),
);
const CartPage = lazy(() => import('../features/cart/CartPage'));
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage'));
const RegisterPage = lazy(() => import('../features/register/RegisterPage'));

function RouteFallback() {
  return (
    <p className="page-content" role="status">
      Loading...
    </p>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Suspense>

      <Footer />
    </div>
  );
}
