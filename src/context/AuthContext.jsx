import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------- verify ----------
  const verifyAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/verify/`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error();
      setUser({ isAuthenticated: true });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------- login password ----------
  const loginWithPassword = async (data) => {
    const res = await fetch(`${API_BASE}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw result;

setUser({
  isAuthenticated: true,
  ...result, 
});
    return result;
  };

  // ---------- login otp ----------
  const loginWithOTP = async (data) => {
    const res = await fetch(`${API_BASE}/login/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw result;

    setUser(result);
    return result;
  };

  // ---------- logout ----------
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithPassword,
        loginWithOTP,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
