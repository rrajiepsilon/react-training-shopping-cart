import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { useCartStore } from "../../store/useCartStore.js";

const SHIPPING = 4.99;
const TAX_RATE = 0.08;

function SummaryRow({ label, value, bold }) {
  const typographyProps = {
    variant: bold ? "subtitle1" : "body2",
    sx: { fontWeight: bold ? 600 : 400 },
  };

  return (
    <Stack
      direction="row"
      sx={{ py: 0.75, gap: 2, alignItems: "center", justifyContent: "space-between" }}
    >
      <Typography {...typographyProps}>{`${label} -`}</Typography>
      <Typography {...typographyProps}>{value}</Typography>
    </Stack>
  );
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const navigate = useNavigate();

  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 3.5,
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Helmet>
          <title>Your cart — Cartly</title>
        </Helmet>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Continue shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3.5 }}>
      <Helmet>
        <title>{`Your cart (${items.length}) — Cartly`}</title>
        <meta name="description" content="Review the items in your Cartly shopping cart before checkout." />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Your cart
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        {items.length} items
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2} component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {items.map((item) => (
              <Paper component="li" key={item.id} variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    sx={{ width: 80, height: 80, objectFit: "contain" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textTransform: "capitalize" }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body2">${item.price.toFixed(2)} each</Typography>
                  </Box>
                  <Box
                    role="group"
                    aria-label={`Quantity for ${item.title}`}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      size="small"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.title}`}
                      sx={{ borderRadius: 0 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      aria-live="polite"
                      sx={{
                        width: 40,
                        textAlign: "center",
                        borderLeft: 1,
                        borderRight: 1,
                        borderColor: "divider",
                        alignSelf: "stretch",
                        lineHeight: "34px",
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                      sx={{ borderRadius: 0 }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography sx={{ fontWeight: 600, minWidth: 72, textAlign: { sm: "right" } }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title} from cart`}>
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, position: { md: "sticky" }, top: 88 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Order summary
            </Typography>
            <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <SummaryRow label="Shipping" value={`$${shipping.toFixed(2)}`} />
            <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
            <Divider sx={{ my: 1 }} />
            <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/checkout")}>
              Checkout
            </Button>
            <Button fullWidth variant="outlined" sx={{ mt: 1.5 }} onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
