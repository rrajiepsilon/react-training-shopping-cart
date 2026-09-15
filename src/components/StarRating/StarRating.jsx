import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

export default function StarRating({ rate = 0, count = 0, size = "small" }) {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
      role="img"
      aria-label={`Rated ${rate.toFixed(1)} out of 5 stars, ${count} reviews`}
    >
      <Rating value={rate} precision={0.1} readOnly size={size} aria-hidden />
      <Typography variant="caption" color="textSecondary" aria-hidden="true">
        {rate.toFixed(1)} · {count}
      </Typography>
    </Box>
  );
}
