import { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import RegisterPhoneForm from "./register/RegisterPhoneForm";
import RegisterOtpForm from "./register/RegisterOtpForm";
import RegisterFinalForm from "./register/RegisterFinalForm";
import LoginForm from "./login/LoginForm";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("register-phone");
  const [registerPhone, setRegisterPhone] = useState("");
  const modalRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div
        dir="rtl"
        onClick={handleBackdropClick}
        className="fixed inset-0 flex items-end sm:items-center justify-center 
                   bg-black/40 dark:bg-black/60 z-[200] overflow-hidden"
      >
        <div
          ref={modalRef}
          className={`
            w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl p-6 relative
            ${isMobile
              ? "rounded-t-3xl animate-slide-up-ios absolute bottom-0"
              : "rounded-3xl"
            }
          `}
        >
          {/* ---- Mobile Handle Bar (iOS style) ---- */}
          {isMobile && (
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          )}

          {/* ---- Close Button ONLY on Desktop ---- */}
          {!isMobile && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                         dark:text-gray-400 dark:hover:text-gray-200 text-xl"
            >
              ×
            </button>
          )}

          {/* ---- Steps ---- */}
          {mode === "register-phone" && (
            <RegisterPhoneForm
              onNext={(phone) => {
                setRegisterPhone(phone);
                setMode("register-otp");
              }}
              onSwitchLogin={() => setMode("login")}
            />
          )}

          {mode === "register-otp" && (
            <RegisterOtpForm
              phone={registerPhone}
              onNext={() => setMode("register-final")}
              onBack={() => setMode("register-phone")}
            />
          )}

          {mode === "register-final" && (
            <RegisterFinalForm phone={registerPhone} onSuccess={onClose} />
          )}

          {mode === "login" && (
            <LoginForm
              onSwitchRegister={() => setMode("register-phone")}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </>
  );
}
