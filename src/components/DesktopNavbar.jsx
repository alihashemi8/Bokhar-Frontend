import { useState } from "react";
import { User, ShoppingCart, MessageSquare, Home } from "lucide-react"; // ← آیکن Home اضافه شد
import DarkMode from "./DarkMode";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function DesktopNavbar() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <>
      <nav
        dir="rtl"
        className="hidden md:flex fixed top-0 left-0 w-full justify-between items-center
                   backdrop-blur-md bg-purple-600/70 border-b border-white/20
                   text-white px-6 py-3 shadow-lg z-50"
      >
        {/* بخش راست */}
        <div className="flex items-center gap-4">
          {/* دکمه خانه */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mx-4 cursor-pointer hover:text-amber-300 transition"
          >
            <Home size={22} />
            <span>خانه</span>
          </div>

          {/* دکمه پروفایل */}
          <div
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 mx-8 cursor-pointer hover:text-amber-300 transition"
          >
            <User size={22} />
            <span>پروفایل</span>
          </div>
        </div>

        {/* لوگو */}
        <div
          onClick={() => navigate("/")}
          className="text-center font-bold text-2xl tracking-wide select-none cursor-pointer"
        >
          <span className="bg-gradient-to-r from-yellow-400 to-purple-300 bg-clip-text text-transparent">
            Logo
          </span>
        </div>

        {/* بخش چپ */}
        <div className="flex items-center gap-6">
          {/* پیام‌ها */}
          <div 
          onClick={() => navigate("/Notifications")}
          className="flex items-center gap-2 mx-15 cursor-pointer hover:text-amber-300 transition">
            <MessageSquare size={22} />
            <span>پیام‌ها</span>
          </div>

          {/* سبد خرید */}
          <div
            onClick={() => navigate("/order")}
            className="relative flex items-center gap-2 mx-5 cursor-pointer hover:text-amber-300 transition"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
            <span>سبد خرید</span>
          </div>

          {/* حالت تاریک */}
          <div className="hidden md:flex items-center gap-4 mx-5">
            <DarkMode />
          </div>

          {/* ورود / ثبت نام */}
          <div
            onClick={() => setOpenModal(true)}
            className="text-gray-100 gap-2 mx-5 rounded-xl cursor-pointer hover:text-amber-300 transition"
          >
            ورود / ثبت نام
          </div>
        </div>
      </nav>

      {/* مودال ورود */}
      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
