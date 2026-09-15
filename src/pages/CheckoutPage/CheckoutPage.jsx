import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useCartStore } from "../../store/useCartStore.js";

const SHIPPING = 4.99;
const TAX_RATE = 0.08;

const SHIPPING_ADDRESS = {
  label: "Home",
  name: "John Doe",
  line1: "123 Market Street, Apt 4B",
  cityStateZip: "San Francisco, California 94103",
  country: "United States",
  phone: "+1 (555) 123-4567",
};

function getEstimatedDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 6);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function generateOrderId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `CART-${random}`;
}

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

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const navigate = useNavigate();

  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + tax + shipping;
  const deliveryDate = getEstimatedDeliveryDate();

  const handlePlaceOrder = () => {
    const order = {
      orderId: generateOrderId(),
      items,
      subtotal,
      shipping,
      tax,
      total,
      deliveryDate,
      address: SHIPPING_ADDRESS,
      placedAt: new Date().toISOString(),
    };

    clearCart();
    navigate("/order-confirmation", { state: { order } });
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3.5 }}>
        <Helmet>
          <title>Checkout — Cartly</title>
        </Helmet>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>
        <Typography color="textSecondary">
          Your cart is empty.{" "}
          <Link component={RouterLink} to="/" underline="hover">
            Continue shopping
          </Link>
          .
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3.5 }}>
      <Helmet>
        <title>Checkout — Cartly</title>
        <meta
          name="description"
          content="Review your shipping address, delivery date, and payment method before placing your Cartly order."
        />
      </Helmet>

      <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/cart" color="inherit" underline="hover">
          Cart
        </Link>
        <Typography color="textPrimary" aria-current="page">
          Checkout
        </Typography>
      </Breadcrumbs>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2}>
            <Paper variant="outlined" component="section" aria-labelledby="shipping-heading" sx={{ p: 3 }}>
              <Stack direction="row" sx={{ mb: 1, alignItems: "center", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <PlaceOutlinedIcon fontSize="small" />
                  <Typography variant="h6" component="h2" id="shipping-heading">
                    Shipping address
                  </Typography>
                </Stack>
                <Button size="small" aria-label="Change shipping address">
                  Change
                </Button>
              </Stack>
              <Chip label={SHIPPING_ADDRESS.label} size="small" sx={{ mb: 1 }} />
              <Typography sx={{ fontWeight: 600 }}>{SHIPPING_ADDRESS.name}</Typography>
              <Typography component="address" variant="body2" color="textSecondary" sx={{ fontStyle: "normal" }}>
                {SHIPPING_ADDRESS.line1}
                <br />
                {SHIPPING_ADDRESS.cityStateZip}
                <br />
                {SHIPPING_ADDRESS.country}
                <br />
                {SHIPPING_ADDRESS.phone}
              </Typography>
            </Paper>

            <Paper variant="outlined" component="section" aria-labelledby="delivery-heading" sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
                <LocalShippingOutlinedIcon fontSize="small" />
                <Typography variant="h6" component="h2" id="delivery-heading">
                  Delivery date
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2">{`${deliveryDate} — Standard delivery`}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Arrives within 3–5 business days
                  </Typography>
                </Box>
                <Typography variant="body2">Free</Typography>
              </Stack>
            </Paper>

            <Paper variant="outlined" component="section" aria-labelledby="payment-heading" sx={{ p: 3 }}>
              <Stack direction="row" sx={{ mb: 1, alignItems: "center", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CreditCardOutlinedIcon fontSize="small" />
                  <Typography variant="h6" component="h2" id="payment-heading">
                    Payment method
                  </Typography>
                </Stack>
                <Button size="small" aria-label="Change payment method">
                  Change
                </Button>
              </Stack>
              <Box>
                <Typography variant="body2">Credit / Debit card</Typography>
                <Typography variant="body2" color="textSecondary">
                  Ending in 4242
                </Typography>
              </Box>
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, position: { md: "sticky" }, top: 88 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Order summary
            </Typography>
            {items.map((item) => (
              <Stack key={item.id} direction="row" spacing={1.5} sx={{ mb: 1.5, alignItems: "center" }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  sx={{ width: 48, height: 48, objectFit: "contain" }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Qty {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
              </Stack>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <SummaryRow label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
            <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
            <SummaryRow label="Total" value={`$${total.toFixed(2)}`} bold />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handlePlaceOrder}>
              Place order
            </Button>
            <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, alignItems: "center", justifyContent: "center" }}>
              <LockOutlinedIcon sx={{ fontSize: 14 }} color="action" />
              <Typography variant="caption" color="textSecondary">
                Secure checkout
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
