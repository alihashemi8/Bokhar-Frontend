import { useState, useEffect } from "react";
import { User, ShoppingCart, MessageSquare, Loader2 } from "lucide-react"; // Loader2 اضافه شد
import DarkMode from "./DarkMode";
import AuthModal from "./auth/AuthModal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function DesktopNavbar() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { totalItems, loading: cartLoading, refreshCart } = useCart();

  // وقتی کاربر لاگین می‌کند، سبد را از سرور.refresh می‌کنیم
  useEffect(() => {
    if (user?.isAuthenticated) {
      refreshCart();
    }
  }, [user?.isAuthenticated, refreshCart]);

  if (authLoading) return null;

  return (
    <>
      <nav
        dir="rtl"
        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 backdrop-blur-md
          w-[92%] max-w-6xl justify-between items-center px-6 py-2 shadow-lg rounded-full z-50
          bg-sky-50/60 border border-white/20 text-gray-800  
          dark:bg-sky-50/40 dark:border dark:border-white/80 dark:text-gray-100"
      >
        {/* بخش راست */}
        <div className="flex items-center gap-6">
          {/* لوگو */}
          <div
            onClick={() => navigate("/shop")}
            className="text-center font-bold text-2xl px-6 tracking-wide select-none cursor-pointer"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-purple-300 bg-clip-text text-transparent">
              Logo
            </span>
          </div>

          {/* پیام‌ها */}
          <div
            onClick={() => navigate("/Notifications")}
            className="flex items-center gap-2 px-6 cursor-pointer hover:text-sky-300 transition"
          >
            <MessageSquare size={22} />
            <span>پیام‌ها</span>
          </div>

          {/* سبد خرید */}
          <div
            onClick={() => navigate("/order")}
            className="relative flex items-center gap-2 px-6 cursor-pointer hover:text-sky-300 transition"
          >
            <ShoppingCart size={22} />
            
            {/* Badge با لودینگ اسپینر */}
            {cartLoading ? (
              <span className="absolute -top-2 -right-1 w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                <Loader2 size={12} className="animate-spin text-gray-500 dark:text-gray-400" />
              </span>
            ) : totalItems > 0 ? (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            ) : null}
            
            <span>سبد خرید</span>
          </div>
        </div>

        {/* بخش چپ */}
        <div className="flex items-center gap-6">
          {/* حالت تاریک */}
          <div className="hidden md:flex items-center gap-4 cursor-pointer">
            <DarkMode /> 
          </div>

          {/* پروفایل یا ورود */}
          {user?.isAuthenticated ? (
            <div
              onClick={() => navigate("/customer-dashboard")}
              className="flex items-center gap-2 px-4 cursor-pointer hover:text-sky-300 transition"
            >
              <User size={22} />
              <span className="hidden lg:block">
                {user.fullname || "پروفایل"}
              </span>
            </div>
          ) : (
            <div
              onClick={() => setOpenModal(true)}
              className="text-gray-800 hover:text-sky-300 dark:text-gray-100 cursor-pointer transition"
            >
              ورود / ثبت نام
            </div>
          )}
        </div>
      </nav>

      {/* مودال ورود */}
      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
