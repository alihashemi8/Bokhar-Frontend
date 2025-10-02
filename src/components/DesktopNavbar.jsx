import { useState } from "react";
import { User, ShoppingCart, MessageSquare } from "lucide-react";
import DarkMode from "./DarkMode";
import AuthModal from "./AuthModal";

export default function DesktopNavbar() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <nav
        dir="rtl"
        className="hidden md:flex fixed top-0 left-0 w-full justify-between items-center
                   backdrop-blur-md bg-purple-600/70 border-b border-white/20
                   text-white px-6 py-3 shadow-lg z-50"
      >
        <div className="flex items-center gap-4">
          <div
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 mx-1 cursor-pointer hover:text-amber-300 transition"
          >
            <User size={22} />
            <span>پروفایل</span>
          </div>
        </div>

        <div className="text-center font-bold text-2xl tracking-wide select-none">
          <span className="bg-gradient-to-r from-yellow-400 to-purple-300 bg-clip-text text-transparent">
            Logo
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 mx-15 cursor-pointer hover:text-amber-300 transition">
            <MessageSquare size={22} />
            <span>پیام‌ها</span>
          </div>

          {/* سبد خرید */}
          <div
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 mx-5 cursor-pointer hover:text-amber-300 transition"
          >
            <ShoppingCart size={22} />
            <span>سبد خرید</span>
          </div>

          <div className="hidden md:flex items-center gap-4 mx-5">
            <DarkMode />
          </div>

          {/* دکمه ورود */}
          <div
            onClick={() => setOpenModal(true)}
            className="text-gray-100 gap-2 mx-5 rounded-xl cursor-pointer hover:text-amber-300 transition"
          >
            ورود / ثبت نام
          </div>
        </div>
      </nav>

      {/* اینجا باید isOpen باشه */}
      <AuthModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
