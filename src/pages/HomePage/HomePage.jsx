import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useFetch } from "../../hooks/useFetch.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "./HomePage.css";

const PAGE_SIZE = 10;

function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-thumb" />
      <div className="skeleton-line" style={{ width: "80%" }} />
      <div className="skeleton-line" style={{ width: "50%" }} />
      <div className="skeleton-line" style={{ width: "35%" }} />
    </div>
  );
}

export default function HomePage() {
  const { data: products, loading, error } = useFetch("https://fakestoreapi.com/products");
  const { data: categories } = useFetch("https://fakestoreapi.com/products/categories");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  // Reset back to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-content">
      <Helmet>
        <title>Cartly — Shop all products</title>
        <meta
          name="description"
          content="Browse Cartly's full product catalog with search and category filters — electronics, clothing, jewelery, and more."
        />
      </Helmet>

      <h1 className="home-title">All products</h1>
      <p className="home-subtitle">
        {loading ? "Loading products..." : `${filteredProducts.length} items`}
      </p>

      <div className="toolbar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <label htmlFor="product-search" className="visually-hidden">
            Search products
          </label>
          <input
            id="product-search"
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <label htmlFor="category-select" className="visually-hidden">
          Filter by category
        </label>
        <select
          id="category-select"
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          Couldn't load products: {error}
        </div>
      )}

      {!error && (
        <div className="product-grid">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductCardSkeleton key={i} />)
            : pagedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="empty-state">No products match your search.</p>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className="pagination" aria-label="Product pages">
          <button
            className="pg-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            &#8249;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pg-num ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          ))}
          <button
            className="pg-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            &#8250;
          </button>
        </nav>
      )}
    </div>
  );
}
