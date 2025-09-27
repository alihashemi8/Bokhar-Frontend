import { useState, useEffect } from "react";
import { User, ShoppingCart, MessageSquare, Home } from "lucide-react";

export default function MobileNavbar() {
  const [dark, setDark] = useState(false);

  const toggleDarkMode = () => {
    setDark(prev => !prev);
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <nav
      dir="rtl"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2
                 w-[92%] max-w-lg flex justify-between items-center
                 bg-white/10 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg z-50 transition-all duration-300"
    >
      <NavItem icon={<User size={22} />} label="پروفایل" />
      <NavItem icon={<ShoppingCart size={22} />} label="سبد" />

      {/* لوگو وسط با انیمیشن */}
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

      <NavItem icon={<MessageSquare size={22} />} label="پیام‌ها" />
      <NavItem icon={<Home size={22} />} label="خانه" />
    </nav>
  );
}

function NavItem({ icon, label }) {
  return (
    <button
      className="flex flex-col items-center justify-center gap-1 px-2 py-1
                 rounded-lg hover:text-amber-300 transition focus:outline-none"
      aria-label={label}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
