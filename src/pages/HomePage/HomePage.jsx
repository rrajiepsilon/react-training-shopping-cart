import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";

const PAGE_SIZE = 10;
const PRODUCTS_URL = "https://fakestoreapi.com/products";
const CATEGORIES_URL = "https://fakestoreapi.com/products/categories";

function startJsonFetch(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  });
}

const productsPromise = startJsonFetch(PRODUCTS_URL);
const categoriesPromise = startJsonFetch(CATEGORIES_URL);

function usePreloaded(promise) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    promise
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [promise]);

  return { data, loading, error };
}

function ProductCardSkeleton() {
  return (
    <Card aria-hidden="true" sx={{ height: "100%", minHeight: 400 }}>
      <Skeleton variant="rectangular" height={212} />
      <CardContent>
        <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="90%" />
        <Skeleton width="70%" />
        <Skeleton width="50%" />
      </CardContent>
      <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={64} height={32} />
        <Skeleton width={104} height={36} />
      </Box>
    </Card>
  );
}

export default function HomePage() {
  const { data: products, loading, error } = usePreloaded(productsPromise);
  const { data: categories } = usePreloaded(categoriesPromise);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

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
    <Container maxWidth="lg" sx={{ py: 3.5 }}>
      <Helmet>
        <title>Cartly — Shop all products</title>
        <meta
          name="description"
          content="Browse Cartly's full product catalog with search and category filters — electronics, clothing, jewelery, and more."
        />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        All products
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        {loading ? "Loading products..." : `${filteredProducts.length} items`}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          id="product-search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          slotProps={{
            htmlInput: { "aria-label": "Search products" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          id="category-select"
          label="Filter by category"
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="all">All categories</MenuItem>
          {categories?.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Couldn't load products: {error}
        </Alert>
      )}

      {!error && (
        <Grid container spacing={2}>
          {Array.from({ length: loading ? PAGE_SIZE : pagedProducts.length }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              {loading ? (
                <ProductCardSkeleton />
              ) : (
                <ProductCard product={pagedProducts[index]} priority={index < 8} />
              )}
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <Typography color="textSecondary" sx={{ mt: 4, textAlign: "center" }}>
          No products match your search.
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, minHeight: 48 }}>
        {!loading && !error && totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            aria-label="Product pages"
          />
        )}
      </Box>
    </Container>
  );
}
