import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import OtpLoginForm from "./OtpLoginForm";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("register");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 z-50"
    >
      {/* مودال */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-[90%] max-w-sm
          max-h-[90vh] sm:max-h-[80vh]
          overflow-y-auto
          bg-white dark:bg-gray-900
          text-gray-800 dark:text-gray-100
          rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700
          p-4 sm:p-6
          transition-all duration-300
        "
      >
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
        >
          ✕
        </button>

        {/* فرم‌ها */}
        <div className="text-sm sm:text-base">
          {mode === "register" && (
            <RegisterForm
              onSwitch={() => setMode("login")}
              setLoading={setLoading}
            />
          )}

          {mode === "login" && (
            <LoginForm
              onSwitchRegister={() => setMode("register")}
              onOtpLogin={() => setMode("otp-login")}
              setLoading={setLoading}
            />
          )}

          {mode === "otp-login" && (
            <OtpLoginForm
              onBack={() => setMode("login")}
              onClose={onClose}
              setLoading={setLoading}
            />
          )}
        </div>

        {/* لایه لودینگ */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-800/80">
            <div className="w-8 h-8 border-4 border-blue-500 dark:border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
