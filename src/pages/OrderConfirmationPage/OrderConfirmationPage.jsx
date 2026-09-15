import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@mui/icons-material/Check";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Helmet>
          <title>Order confirmation — Cartly</title>
        </Helmet>
        <Alert severity="info" sx={{ mb: 2 }}>
          No recent order found
        </Alert>
        <Typography>
          Looks like there's no order to show.{" "}
          <Link component={RouterLink} to="/" underline="hover">
            Go back to shopping
          </Link>
          .
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Helmet>
        <title>Order confirmed — Cartly</title>
        <meta name="description" content="Your Cartly order has been placed successfully." />
      </Helmet>

      <Paper variant="outlined" sx={{ p: 4 }}>
        <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56, mb: 2 }}>
          <CheckIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom>
          Order placed!
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Thanks for shopping with Cartly. A confirmation has been sent for order <strong>#{order.orderId}</strong>.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="textSecondary">
              Order number
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>#{order.orderId}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="textSecondary">
              Estimated delivery
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{order.deliveryDate}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="textSecondary">
              Total paid
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</Typography>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" component="h2" gutterBottom>
          Shipping to
        </Typography>
        <Typography component="address" variant="body2" color="textSecondary" sx={{ fontStyle: "normal", mb: 3 }}>
          {order.address.name}
          <br />
          {order.address.line1}
          <br />
          {order.address.cityStateZip}
          <br />
          {order.address.country}
        </Typography>

        <Typography variant="subtitle1" component="h2" gutterBottom>
          Items ({order.items.length})
        </Typography>
        <Stack spacing={1.5} component="ul" sx={{ listStyle: "none", p: 0, m: 0, mb: 3 }}>
          {order.items.map((item) => (
            <Stack component="li" key={item.id} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                loading="lazy"
                sx={{ width: 48, height: 48, objectFit: "contain" }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{item.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Qty {item.quantity}
                </Typography>
              </Box>
              <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Continue shopping
          </Button>
          <Button variant="outlined" onClick={() => navigate("/account")}>
            View my orders
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
