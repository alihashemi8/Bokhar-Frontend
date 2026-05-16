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
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 
                   bg-white/85 dark:bg-gray-900/90 backdrop-blur-xl 
                   border-t border-gray-200/50 dark:border-gray-700/50 
                   rounded-t-3xl shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] 
                   dark:shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.3)]
                   pb-[env(safe-area-inset-bottom)] transition-all duration-300"
      >
        <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
          {/* خانه - اصلاح وضعیت اکتیو برای /shop هم */}
          <NavItem
            icon={<Home size={22} strokeWidth={2} />}
            label="خانه"
            onClick={() => {
              if (window.location.hash === "#/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/shop");
              }
            }}
            active={location.pathname === "/" || location.pathname === "/shop"}
          />

          {/* پیام‌ها */}
          <NavItem
            icon={<MessageSquare size={22} strokeWidth={2} />}
            label="پیام‌ها"
            onClick={() => navigate("/notifications")}
            active={location.pathname === "/notifications"}
          />

          {/* سبد خرید */}
          <NavItem
            icon={
              <div className="relative">
                <ShoppingCart size={22} strokeWidth={2} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-gray-900">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
            }
            label="سبد"
            onClick={() => navigate("/order")}
            active={location.pathname === "/order"}
          />

          {/* پروفایل */}
          <NavItem
            icon={<User size={22} strokeWidth={2} />}
            label={
              user?.isAuthenticated
                ? user.fullname || "پروفایل"
                : "ورود / ثبت نام"
            }
            onClick={handleProfileClick}
            active={location.pathname === "/customer-dashboard"}
          />
        </div>
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
        relative flex flex-col items-center justify-center gap-1 
        w-16 h-14 rounded-2xl transition-all duration-300 ease-out
        ${active 
          ? "text-sky-500 dark:text-sky-400 scale-105 bg-sky-50 dark:bg-sky-900/20 shadow-sm" 
          : "text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
      `}
      aria-label={label}
    >
      <div className={`${active ? "drop-shadow-sm" : ""} transition-transform duration-300`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-tight">
        {label}
      </span>
      
   </button>
  );
}
