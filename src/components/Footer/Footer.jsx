import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2.5,
        px: 2,
        textAlign: "center",
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Data from fakestoreapi.com — internal POC
      </Typography>
    </Box>
  );
}
