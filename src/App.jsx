import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";

const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage/ProductDetailPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage/CheckoutPage.jsx"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage/OrderConfirmationPage.jsx"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage/RegistrationPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage.jsx"));
const AccountPage = lazy(() => import("./pages/AccountPage/AccountPage.jsx"));

function RouteFallback() {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", py: 8, color: "text.secondary" }}
      role="status"
      aria-label="Loading"
    >
      Loading...
    </Box>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Box className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1 }}>
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Box>

      <Footer />
    </Box>
  );
}
