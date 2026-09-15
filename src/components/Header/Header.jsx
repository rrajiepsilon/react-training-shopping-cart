import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCartStore } from "../../store/useCartStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import UserMenu from "../UserMenu/UserMenu.jsx";

export default function Header() {
  const itemCount = useCartStore((state) => state.itemCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 64 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: 0.3, mr: 1 }}
          >
            Cartly
          </Typography>

          <Box
            component="nav"
            aria-label="Main navigation"
            sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.5, flex: 1 }}
          >
            <Button color="inherit" component={Link} to="/" size="small">
              Home
            </Button>
            <Typography variant="body2" sx={{ px: 1, opacity: 0.7 }}>
              Deals
            </Typography>
            <Typography variant="body2" sx={{ px: 1, opacity: 0.7 }}>
              About
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" size="small">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register" size="small">
                  Register
                </Button>
              </>
            )}

            <IconButton
              component={Link}
              to="/cart"
              color="inherit"
              aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            >
              <Badge badgeContent={itemCount} color="error" max={99}>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
