import { useState, useEffect, useRef } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useFetch } from "../../hooks/useFetch.js";
import { useCartStore } from "../../store/useCartStore.js";
import StarRating from "../../components/StarRating/StarRating.jsx";
import { optimizedProductImage } from "../../utils/productImage.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, loading, error } = useFetch(`https://fakestoreapi.com/products/${id}`);

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const addedTimeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(addedTimeoutRef.current);
  }, [id]);

  useEffect(() => {
    if (product?.image) setImageSrc(optimizedProductImage(product.image, 800));
  }, [product]);

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setJustAdded(true);
    clearTimeout(addedTimeoutRef.current);
    addedTimeoutRef.current = setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (product) addItem(product, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress aria-label="Loading product" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Couldn't load product: {error}</Alert>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 3.5 }}>
      <Helmet>
        <title>{`${product.title} — Cartly`}</title>
        <meta name="description" content={product.description.slice(0, 155)} />
      </Helmet>

      <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          Home
        </Link>
        <Typography sx={{ textTransform: "capitalize" }}>{product.category}</Typography>
        <Typography color="textPrimary" aria-current="page">
          {product.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            variant="outlined"
            sx={{ p: 4, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.50" }}
          >
            <Box
              component="img"
              src={imageSrc || product.image}
              alt={product.title}
              width={420}
              height={420}
              fetchPriority="high"
              decoding="async"
              onError={() => setImageSrc(product.image)}
              sx={{ maxWidth: "100%", maxHeight: 420, width: "auto", height: "auto", objectFit: "contain" }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Chip label={product.category} size="small" sx={{ textTransform: "capitalize", mb: 1.5 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            {product.title}
          </Typography>
          <StarRating rate={product.rating.rate} count={product.rating.count} size="medium" />
          <Typography variant="h5" sx={{ my: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Description
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Typography variant="body2" id="qty-label" sx={{ mb: 1 }}>
            Quantity
          </Typography>
          <Box
            role="group"
            aria-labelledby="qty-label"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <IconButton
              onClick={decrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              size="small"
              sx={{ borderRadius: 0 }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography
              aria-live="polite"
              sx={{
                width: 48,
                textAlign: "center",
                borderLeft: 1,
                borderRight: 1,
                borderColor: "divider",
                alignSelf: "stretch",
                lineHeight: "38px",
              }}
            >
              {quantity}
            </Typography>
            <IconButton onClick={increment} aria-label="Increase quantity" size="small" sx={{ borderRadius: 0 }}>
              <AddIcon />
            </IconButton>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              startIcon={justAdded ? <CheckIcon /> : <ShoppingCartOutlinedIcon />}
              onClick={handleAddToCart}
              disabled={justAdded}
              color={justAdded ? "success" : "primary"}
            >
              {justAdded ? "Added" : "Add to cart"}
            </Button>
            <Button variant="contained" onClick={handleBuyNow}>
              Buy now
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
