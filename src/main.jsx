import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext"; 
import { AuthProvider } from "./context/AuthContext"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <CartProvider> {/* اینجا */}
        <App />
      </CartProvider>
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
