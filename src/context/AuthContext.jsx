import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // بررسی وضعیت لاگین
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/check-auth/", {
        method: "GET",
        credentials: "include", // خیلی مهم برای ارسال کوکی
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // اجرای اولیه و بعد رفرش
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // logout
  const logout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  // login: فقط برای بروزرسانی state بعد OTP
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        checkAuth,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
