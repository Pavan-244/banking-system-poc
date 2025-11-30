import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh"; // Optional: if you installed icons
import LogoutIcon from "@mui/icons-material/Logout"; // Optional: if you installed icons

interface Transaction {
  id: number;
  cardNumber: string;
  type: string;
  amount: number;
  status: string;
  reason: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await api.get("/transaction/history");
      setTransactions(response.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch history", err);
      setError(
        "Failed to load transactions. Ensure Backend System 1 & 2 are running."
      );
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    // 1. MAIN WRAPPER: Force full viewport width/height
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f4f6f8", // Clean professional grey
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent double scrollbars
      }}
    >
      {/* 2. NAVBAR: Stretches across the top */}
      <AppBar
        position="static"
        elevation={2}
        sx={{ backgroundColor: "#1e3c72" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight="bold">
              PayTabs Super Admin
            </Typography>
          </Box>
          <Button
            color="inherit"
            href="/login"
            startIcon={/* <LogoutIcon /> */ null} // Uncomment icon if installed
            sx={{ fontWeight: "bold" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* 3. SCROLLABLE CONTENT AREA */}
      <Box
        sx={{
          flex: 1, // Fills remaining vertical space
          overflow: "auto", // Allows scrolling ONLY within this area
          padding: { xs: 2, md: 4 }, // Responsive padding
        }}
      >
        <Container maxWidth="xl">
          {" "}
          {/* "xl" allows the table to be wider */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            {/* Header Section */}
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="#1e3c72">
                Global Transaction Monitor
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchHistory}
                startIcon={/* <RefreshIcon /> */ null} // Uncomment icon if installed
                sx={{
                  backgroundColor: "#1e3c72",
                  "&:hover": { backgroundColor: "#162e58" },
                }}
              >
                Refresh Logs
              </Button>
            </Box>

            {/* Data Table */}
            <TableContainer sx={{ maxHeight: "70vh" }}>
              {" "}
              {/* Fixes sticky header height */}
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      ID
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      Time
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      Card Number
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: "#f9fafb", fontWeight: "bold" }}
                    >
                      Reason
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <Typography color="textSecondary">
                          No transactions found in System 2.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>{tx.id}</TableCell>
                        <TableCell>
                          {new Date(tx.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell
                          sx={{ fontFamily: "monospace", color: "#555" }}
                        >
                          {tx.cardNumber}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tx.type.toUpperCase()}
                            color={
                              tx.type.toLowerCase() === "topup"
                                ? "primary"
                                : "warning"
                            }
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          ${tx.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={tx.status}
                            color={
                              tx.status === "SUCCESS" ? "success" : "error"
                            }
                            size="small"
                            sx={{ minWidth: 80 }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ color: "text.secondary", fontStyle: "italic" }}
                        >
                          {tx.reason || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
