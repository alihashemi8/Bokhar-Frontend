import { useState, useEffect } from "react";
import { User, ShoppingCart, MessageSquare, Home } from "lucide-react";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function MobileNavbar() {
  const [dark, setDark] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const toggleDarkMode = () => setDark((prev) => !prev);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <>
      <nav
        dir="rtl"
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2
                   w-[92%] max-w-lg flex justify-between items-center
                   bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg z-50 transition-all duration-300"
      >
        {/* پروفایل */}
        <NavItem
          icon={<User size={22} />}
          label="پروفایل"
          onClick={() => setOpenModal(true)}
        />

        {/* سبد خرید */}
        <NavItem
          icon={
            <div className="relative">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
          }
          label="سبد"
          onClick={() => navigate("/order")}
        />

        {/* لوگو / تغییر حالت تیره */}
        <div
          onClick={toggleDarkMode}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md cursor-pointer
                     bg-gradient-to-r from-yellow-400 to-purple-300
                     transition-transform duration-1000 ease-in-out
                     ${dark ? "rotate-360" : "rotate-0"}`}
        >
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className={`w-8 h-8 rounded-full transition-colors duration-500
                       ${dark ? "filter brightness-75" : "filter brightness-100"}`}
          />
        </div>

        {/* پیام‌ها */}
        <NavItem
          icon={<MessageSquare size={22} />}
          label="پیام‌ها"
          onClick={() => navigate("/messages")}
        />

        {/* خانه */}
        <NavItem
          icon={<Home size={22} />}
          label="خانه"
          onClick={() => {
            if (window.location.hash === "#/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
        />
      </nav>

      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

function NavItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 px-2 py-1
                 rounded-lg hover:text-amber-300 transition focus:outline-none"
      aria-label={label}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
