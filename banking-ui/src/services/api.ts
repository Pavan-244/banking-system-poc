import axios from "axios";

// We point strictly to the Gateway (System 1)
const API_URL = "http://localhost:8081";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Balance API Call
export const fetchBalance = async (cardNumber: string) => {
  try {
    const response = await api.get(`/transaction/balance/${cardNumber}`);
    return response.data; // Returns the number (e.g., 1000.0)
  } catch (error) {
    throw "Could not fetch balance";
  }
};

// Transaction API Call
export const performTransaction = async (
  cardNumber: string,
  pin: string,
  amount: number,
  type: "withdraw" | "topup"
) => {
  try {
    const response = await api.post("/transaction", {
      cardNumber,
      pin,
      amount,
      type,
    });
    return response.data;
  } catch (error: any) {
    // Return the error message from the backend (System 1 or System 2)
    throw error.response?.data?.reason || "Transaction Failed";
  }
};
