import { useState, useContext, useEffect } from "react";
import AuthModal from "./auth/AuthModal";
import CustomerDashboard from "./CustomerDashboard";
import { AuthContext } from "../context/AuthContext";

export default function CustomerDashboardWrapper() {
  const { isAuthenticated, user, setUser, setIsAuthenticated } =
    useContext(AuthContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // وقتی اپ بالا میاد، اگر لاگین نیست، مودال باز کن
  useEffect(() => {
    if (!isAuthenticated) setShowAuthModal(true);
  }, [isAuthenticated]);

  // callback بعد از login موفق
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  // callback ذخیره اطلاعات کاربر
  const handleSave = async (updatedUser) => {
    try {
      const formData = new FormData();
      for (const key in updatedUser) {
        if (key === "_avatarFile" && updatedUser[key]) {
          formData.append("avatar", updatedUser[key]);
        } else {
          formData.append(key, updatedUser[key]);
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("خطا در بروزرسانی اطلاعات کاربر");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      throw err; // برای اینکه CustomerDashboard خطا را نشان دهد
    }
  };

  return (
    <>
      {!isAuthenticated && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {isAuthenticated && user && (
        <CustomerDashboard
          initialUser={user}
          onSave={handleSave}
          onLogout={() => {
            setIsAuthenticated(false);
            setUser(null);
            setShowAuthModal(true);
          }}
        />
      )}
    </>
  );
}
