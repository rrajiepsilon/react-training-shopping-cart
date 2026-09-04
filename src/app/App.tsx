import { Route, Routes } from 'react-router-dom';
import Footer from '../shared/components/Footer';
import Header from '../shared/components/Header';
import CartPage from '../features/cart/CartPage';
import CheckoutPage from '../features/checkout/CheckoutPage';
import { ProductDetailsPage, ProductListPage } from '../features/products';
import RegisterPage from '../features/register/RegisterPage';

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

      <Footer />
    </div>
  );
}
