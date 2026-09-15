import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useAuthStore } from "../../store/useAuthStore.js";

const RECENT_ORDERS = [
  { id: "CART-100482", date: "28 Aug 2026", items: 3, status: "transit", total: 304.32 },
  { id: "CART-100455", date: "14 Aug 2026", items: 1, status: "delivered", total: 64.5 },
  { id: "CART-100431", date: "02 Aug 2026", items: 2, status: "delivered", total: 121.98 },
];

const STATS = [
  { label: "Total orders", value: 12 },
  { label: "In transit", value: 2 },
  { label: "Wishlist items", value: 7 },
];

const DEFAULT_ADDRESS = {
  name: "John Doe",
  line: "123 Market Street, San Francisco, CA 94103",
};

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [section, setSection] = useState("dashboard");

  const initials = getInitials(user?.firstName, user?.lastName, user?.username);
  const displayName =
    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || "there";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3.5 }}>
      <Helmet>
        <title>My account — Cartly</title>
        <meta name="description" content="View your recent orders and manage your Cartly account." />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        My account
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Manage your orders and profile.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2 }} component="aside" aria-label="Account navigation">
            <Stack direction="row" spacing={1.5} sx={{ mb: 2, px: 1, alignItems: "center" }}>
              <Avatar>{initials}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{displayName}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
            <List>
              <ListItemButton selected={section === "dashboard"} onClick={() => setSection("dashboard")} aria-current={section === "dashboard" ? "page" : undefined}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
              <ListItemButton selected={section === "profile"} onClick={() => setSection("profile")}>
                <ListItemText primary="Profile" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" slotProps={{ primary: { color: "error" } }} />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {section === "profile" ? (
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profile
              </Typography>
              <Typography color="textSecondary">
                Profile editing is a placeholder in this POC. Use Dashboard to view recent orders.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                {STATS.map((stat) => (
                  <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h5">{stat.value}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Paper variant="outlined" component="section" aria-labelledby="recent-orders-heading" sx={{ p: 3 }}>
                <Stack direction="row" sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" component="h2" id="recent-orders-heading">
                    Recent orders
                  </Typography>
                  <Button size="small">View all</Button>
                </Stack>
                <Stack divider={<Divider />} spacing={1.5}>
                  {RECENT_ORDERS.map((order) => (
                    <Stack
                      key={order.id}
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{ alignItems: { sm: "center" } }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600 }}>#{order.id}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {order.date} · {order.items} item{order.items === 1 ? "" : "s"}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        color={order.status === "transit" ? "info" : "success"}
                        label={order.status === "transit" ? "In transit" : "Delivered"}
                      />
                      <Typography sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              <Paper variant="outlined" component="section" aria-labelledby="default-address-heading" sx={{ p: 3 }}>
                <Typography variant="subtitle2" id="default-address-heading" color="textSecondary" gutterBottom>
                  Default address
                </Typography>
                <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{DEFAULT_ADDRESS.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {DEFAULT_ADDRESS.line}
                    </Typography>
                  </Box>
                  <Button size="small">Edit</Button>
                </Stack>
              </Paper>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

function getInitials(firstName, lastName, username) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  if (username) return username.slice(0, 2).toUpperCase();
  return "U";
}
