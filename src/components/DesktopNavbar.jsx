import { useState, useContext } from "react";
import { User, ShoppingCart, MessageSquare, Home } from "lucide-react";
import DarkMode from "./DarkMode";
import AuthModal from "./auth/AuthModal";
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
  className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 
             w-[92%] max-w-6xl justify-between items-center
             backdrop-blur-md bg-sky-50/60
             border border-white/20 text-gray-800 px-6 py-2 
             shadow-lg rounded-full z-50"
>

        {/* بخش راست: خانه، لوگو، پیام‌ها، سبد خرید */}
        <div className="flex items-center gap-6">

         {/* لوگو */}
          
          <div
            onClick={() => navigate("/")}
            className="text-center font-bold text-2xl px-6 tracking-wide select-none cursor-pointer"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-purple-300 bg-clip-text text-transparent">
              Logo
            </span>
          </div>
          

          {/* پیام‌ها */}
          <div
            onClick={() => navigate("/Notifications")}
            className="flex items-center gap-2 px-6 cursor-pointer hover:text-amber-300 transition"
          >
            <MessageSquare size={22} />
            <span>پیام‌ها</span>
          </div>

          {/* سبد خرید */}
          <div
            onClick={() => navigate("/order")}
            className="relative flex items-center gap-2 px-6 cursor-pointer hover:text-amber-300 transition"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
            <span>سبد خرید</span>
          </div>
        </div>

        {/* بخش چپ: حالت تاریک و پروفایل/ورود */}
        <div className="flex items-center gap-6 ">
          {/* حالت تاریک */}
          <div className="hidden md:flex items-center gap-4">
            <DarkMode />
          </div>

          {/* پروفایل یا ورود/ثبت‌نام */}
 (
            <div
              onClick={() => setOpenModal(true)}
              className="text-gray-800 gap-2 rounded-xl cursor-pointer hover:text-amber-300 transition"
            >
              ورود / ثبت نام
            </div>
          )

        </div>
      </nav>

      {/* مودال ورود */}
      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
