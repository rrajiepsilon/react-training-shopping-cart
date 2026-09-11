import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

export default function ErrorPage({ onRetry }) {
  const navigate = useNavigate();

  return (
    <div className="page-content error-page">
      <Helmet>
        <title>Something went wrong — Cartly</title>
      </Helmet>

      <div className="error-card" role="alert">
        <h1 className="error-title">Something went wrong</h1>
        <p className="error-message">Some error occurred, please contact admin.</p>
        <div className="error-actions">
          {onRetry && (
            <button type="button" className="btn btn-secondary" onClick={onRetry}>
              Try again
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
