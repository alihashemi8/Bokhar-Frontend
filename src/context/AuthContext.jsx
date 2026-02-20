import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

const AuthContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRefreshing = useRef(false);
  const lastVerify = useRef(0); // جلوگیری از race condition

  // ------------------- refresh token -------------------
  const tryRefreshToken = useCallback(async () => {
    if (isRefreshing.current) {
      console.log("⏳ Already refreshing, skipping...");
      return false;
    }
    isRefreshing.current = true;

    try {
      console.log("🔄 Trying to refresh token...");
      const res = await fetch(`${API_BASE}/refresh/`, {
        method: "POST",
        credentials: "include",
      });
      console.log("📡 Refresh response status:", res.status);

      if (!res.ok) return false;

      // بعد از refresh موفق، user رو دوباره verify می‌کنیم
      const verifyRes = await fetch(`${API_BASE}/verify/`, {
        method: "GET",
        credentials: "include",
      });

      if (verifyRes.ok) {
        const result = await verifyRes.json();
        setUser({ isAuthenticated: true, ...result });
        console.log("✅ Token refreshed and user updated");
        return true;
      }

      console.log("❌ Verify after refresh failed");
      return false;
    } catch (err) {
      console.log("💥 Refresh error:", err.message);
      return false;
    } finally {
      isRefreshing.current = false;
    }
  }, []);

  // ------------------- verify auth -------------------
  const verifyAuth = useCallback(async () => {
    const currentVerify = Date.now();
    lastVerify.current = currentVerify;

    setLoading(true);
    console.log("🔍 Starting verifyAuth...");

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log("⏰ Verify timeout!");
      controller.abort();
    }, 10000); // کمی طولانی‌تر

    try {
      const res = await fetch(`${API_BASE}/verify/`, {
        method: "GET",
        credentials: "include",
        signal: controller.signal,
      });
      console.log("📡 Verify response status:", res.status);

      if (res.ok) {
        const result = await res.json();
        if (lastVerify.current !== currentVerify) return; // جلوگیری از race
        setUser({ isAuthenticated: true, ...result });
        console.log("✅ Verify success:", result);
        return;
      }

      if (res.status === 401) {
        console.log("⚠️ Got 401, trying refresh...");
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          console.log("❌ Refresh failed, user must login");
          if (lastVerify.current === currentVerify) {
            setUser({ isAuthenticated: false });
          }
        }
        return;
      }

      throw new Error(`Auth failed with status ${res.status}`);
    } catch (err) {
      console.log("💥 Verify error:", err.message);
      if (lastVerify.current === currentVerify) setUser({ isAuthenticated: false });
    } finally {
      clearTimeout(timeout);
      if (lastVerify.current === currentVerify) setLoading(false);
      console.log("🏁 verifyAuth finished, loading:", false);
    }
  }, [tryRefreshToken]);

  // ------------------- login methods -------------------
  const handleAuthResponse = async (res) => {
    const result = await res.json();
    if (!res.ok) throw result;
    setUser({ isAuthenticated: true, ...result });
    return result;
  };

  const loginWithPassword = (data) =>
    fetch(`${API_BASE}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then(handleAuthResponse);

  const loginWithOTP = (data) =>
    fetch(`${API_BASE}/login/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }).then(handleAuthResponse);

  const registerWithOTP = ({ phone, otp, fullname }) =>
    fetch(`${API_BASE}/register/otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone, otp, fullname }),
    }).then(handleAuthResponse);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser({ isAuthenticated: false });
    }
  }, []);

  // ------------------- effects -------------------
  useEffect(() => {
    console.log("🚀 Component mounted, calling verifyAuth...");
    verifyAuth();
  }, []);

  useEffect(() => {
    if (!user?.isAuthenticated) {
      console.log("👤 User not authenticated, skipping refresh interval");
      return;
    }

    console.log("⏰ Setting up refresh interval");
    const interval = setInterval(() => {
      console.log("🔄 Interval refresh triggered");
      tryRefreshToken();
    }, 25 * 60 * 1000);

    return () => {
      console.log("🧹 Cleaning up refresh interval");
      clearInterval(interval);
    };
  }, [user?.isAuthenticated, tryRefreshToken]);

  console.log("🎨 Render - user:", user, "loading:", loading);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user?.isAuthenticated === true,
        loginWithPassword,
        loginWithOTP,
        registerWithOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
