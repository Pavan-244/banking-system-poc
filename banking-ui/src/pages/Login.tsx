import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";

const Login: React.FC = () => {
  const [input, setInput] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (input === "admin" && pin === "admin") {
      localStorage.setItem("role", "ADMIN");
      navigate("/admin");
    } else if (input.startsWith("4")) {
      localStorage.setItem("role", "CUSTOMER");
      localStorage.setItem("cardNumber", input);
      navigate("/customer");
    } else {
      alert('Invalid Login. Use "admin" or a valid Visa Card number.');
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Matches Dashboard
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1e3c72" }}
            >
              PayTabs Bank
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Secure Banking Login
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Card Number or Username"
              variant="outlined"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <TextField
              label="PIN or Password"
              type="password"
              variant="outlined"
              fullWidth
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              sx={{ height: 50, fontWeight: "bold", fontSize: "1.1rem" }}
            >
              LOGIN
            </Button>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="caption" color="textSecondary">
              Demo: Use Card <b>4123456789012345</b> & PIN <b>1234</b>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
