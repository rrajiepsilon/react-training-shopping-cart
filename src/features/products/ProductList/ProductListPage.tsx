import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { useFetch } from '../../../shared/hooks/useFetch';
import type { Product } from '../../../shared/types';
import './ProductListPage.css';

const PAGE_SIZE = 10;

function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-thumb" />
      <div className="skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton-line" style={{ width: '50%' }} />
      <div className="skeleton-line" style={{ width: '35%' }} />
    </div>
  );
}

export default function ProductListPage() {
  const { data: products, loading, error } = useFetch<Product[]>(
    'https://fakestoreapi.com/products',
  );
  const { data: categories } = useFetch<string[]>(
    'https://fakestoreapi.com/products/categories',
  );

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  // Reset back to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-content">
      <h1 className="home-title">All products</h1>
      <p className="home-subtitle">
        {loading ? 'Loading products...' : `${filteredProducts.length} items`}
      </p>

      <div className="toolbar">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="category-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories?.map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">Couldn't load products: {error}</div>}

      {!error && (
        <div className="product-grid">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, index) => <ProductCardSkeleton key={index} />)
            : pagedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="empty-state">No products match your search.</p>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pg-btn"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            &#8249;
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`pg-num ${pageNumber === page ? 'active' : ''}`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="pg-btn"
            onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
