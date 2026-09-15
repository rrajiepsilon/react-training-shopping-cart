import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function UserMenu() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const initials = getInitials(user?.firstName, user?.lastName, user?.username);
  const displayName = user?.firstName || user?.username || "user";

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        onClick={handleOpen}
        size="small"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
        aria-label={`Account menu for ${displayName}`}
        color="inherit"
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.2)", fontSize: 13 }}>
          {initials}
        </Avatar>
        <Typography variant="body2" sx={{ ml: 1, display: { xs: "none", md: "block" } }}>
          {displayName}
        </Typography>
      </IconButton>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem component={Link} to="/account" onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

function getInitials(firstName, lastName, username) {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  if (username) return username.slice(0, 2).toUpperCase();
  return "U";
}
