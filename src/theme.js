import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1c1917",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#57534e",
    },
    background: {
      default: "#fafaf8",
      paper: "#ffffff",
    },
    text: {
      primary: "#1c1917",
      secondary: "#57534e",
    },
    success: {
      main: "#3b7a3b",
    },
    error: {
      main: "#b3413d",
    },
    info: {
      main: "#2e5fa8",
    },
    warning: {
      main: "#ef9f27",
    },
    divider: "#e7e5e1",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        sizeMedium: {
          minHeight: 44,
        },
        sizeLarge: {
          minHeight: 44,
        },
      },
    },
  },
});

export default theme;
