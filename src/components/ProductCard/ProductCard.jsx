import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import StarRating from "../StarRating/StarRating.jsx";
import { useCartStore } from "../../store/useCartStore.js";
import { optimizedProductImage } from "../../utils/productImage.js";

const CARD_MIN_HEIGHT = 400;

export default function ProductCard({ product, priority = false }) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => optimizedProductImage(product.image));
  const timeoutRef = useRef(null);

  useEffect(() => {
    setImageSrc(optimizedProductImage(product.image));
  }, [product.image]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);

    setJustAdded(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <Card sx={{ height: "100%", minHeight: CARD_MIN_HEIGHT, display: "flex", flexDirection: "column" }}>
      <CardActionArea component={Link} to={`/product/${product.id}`} sx={{ flex: 1 }}>
        <Box sx={{ bgcolor: "grey.50", height: 212, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            component="img"
            src={imageSrc}
            alt={product.title}
            width={360}
            height={180}
            loading="eager"
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            onError={() => setImageSrc(product.image)}
            sx={{ height: 180, width: "100%", objectFit: "contain", px: 2 }}
          />
        </Box>
        <CardContent>
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize", maxWidth: "100%", mb: 1 }}
          />
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: "2.8em",
            }}
          >
            {product.title}
          </Typography>
          <StarRating rate={product.rating.rate} count={product.rating.count} />
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
        <Typography variant="h6" component="span">
          ${product.price.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          size="small"
          color={justAdded ? "success" : "primary"}
          onClick={handleAddToCart}
          disabled={justAdded}
          aria-label={justAdded ? `${product.title} added to cart` : `Add ${product.title} to cart`}
        >
          {justAdded ? "Added ✓" : "Add to cart"}
        </Button>
      </CardActions>
    </Card>
  );
}
