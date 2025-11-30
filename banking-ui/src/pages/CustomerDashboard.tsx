import React, { useState, useEffect } from "react";
import { performTransaction, fetchBalance } from "../services/api";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  AppBar,
  Toolbar,
  Card,
  CardContent,
} from "@mui/material";

const CustomerDashboard: React.FC = () => {
  const cardNumber = localStorage.getItem("cardNumber") || "Unknown";
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Function to load balance from Backend
  const loadBalance = async () => {
    try {
      const bal = await fetchBalance(cardNumber);
      setBalance(bal);
    } catch (err) {
      console.error(err);
    }
  };

  // Load balance immediately when page opens
  useEffect(() => {
    loadBalance();
  }, []);

  const handleTransaction = async (type: "withdraw" | "topup") => {
    setMessage("");
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      // 1. Perform Transaction
      const result = await performTransaction(
        cardNumber,
        "1234",
        parseFloat(amount),
        type
      );
      setMessage(result.message);
      setAmount("");

      // 2. Refresh Balance immediately after success
      await loadBalance();
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Transaction Failed");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ paddingX: 2, paddingTop: 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            PayTabs Bank
          </Typography>
          <Button href="/login" variant="contained" color="error" size="small">
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={10}
            sx={{
              padding: 4,
              borderRadius: 4,
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1e3c72" }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Card: {cardNumber.replace(/.(?=.{4})/g, "*")}
            </Typography>

            {/* BALANCE DISPLAY CARD */}
            <Card
              sx={{
                backgroundColor: "#e3f2fd",
                marginBottom: 4,
                border: "1px solid #90caf9",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography color="textSecondary" gutterBottom>
                  Current Balance
                </Typography>
                <Typography
                  variant="h3"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#1565c0" }}
                >
                  ${balance !== null ? balance.toFixed(2) : "---"}
                </Typography>
              </CardContent>
            </Card>

            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Enter Amount"
                type="number"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                InputProps={{ sx: { fontSize: "1.2rem" } }}
              />

              <Box
                display="flex"
                gap={2}
                sx={{ flexDirection: { xs: "column", sm: "row" } }}
              >
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  sx={{ height: 50, fontWeight: "bold" }}
                  onClick={() => handleTransaction("topup")}
                >
                  Top Up (+)
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  fullWidth
                  size="large"
                  sx={{ height: 50, fontWeight: "bold" }}
                  onClick={() => handleTransaction("withdraw")}
                >
                  Withdraw (-)
                </Button>
              </Box>
            </Box>

            <Box mt={3}>
              {message && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
