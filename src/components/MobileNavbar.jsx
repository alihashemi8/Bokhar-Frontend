import { useState } from "react";
import { User, ShoppingCart, MessageSquare, Home } from "lucide-react";
import AuthModal from "./auth/AuthModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function MobileNavbar() {
  const [openModal, setOpenModal] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) return null;

  // تابع کلیک روی پروفایل
  const handleProfileClick = () => {
    if (user?.isAuthenticated) {
      navigate("/customer-dashboard");
    } else {
      setOpenModal(true);
    }
  };

  return (
    <>
      <nav
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2
                   w-[92%] max-w-lg flex justify-between items-center
                   bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg z-50 transition-colors"
      >
        {/* پروفایل */}
        <NavItem
          icon={<User size={22} />}
          label={
            user?.isAuthenticated
              ? user.fullname || "پروفایل"
              : "ورود / ثبت نام"
          }
          onClick={handleProfileClick}
          active={location.pathname === "/profile"}
        />

        {/* سبد خرید */}
        <NavItem
          icon={
            <div className="relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
          }
          label="سبد"
          onClick={() => navigate("/order")}
          active={location.pathname === "/order"}
        />

        {/* پیام‌ها */}
        <NavItem
          icon={<MessageSquare size={22} />}
          label="پیام‌ها"
          onClick={() => navigate("/notifications")}
          active={location.pathname === "/notifications"}
        />

        {/* خانه */}
        <NavItem
          icon={<Home size={22} />}
          label="خانه"
          onClick={() => {
            if (window.location.hash === "#/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/shop");
            }
          }}
          active={location.pathname === "/"}
        />
      </nav>

      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

function NavItem({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg
        transition-all duration-300
        ${
          active
            ? "text-amber-400 scale-110"
            : "text-gray-600 dark:text-gray-300 hover:text-amber-300 scale-100"
        }
      `}
      aria-label={label}
    >
      {icon}
      <span className="text-[10px] transition-colors duration-300">
        {label}
      </span>
    </button>
  );
}
