import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import ToastContainer from "./context/ToastContainer";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <ThemeProvider>
          <ToastProvider>
            <ToastContainer />
            <CartProvider>
              <App />
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  </StrictMode>,
);
