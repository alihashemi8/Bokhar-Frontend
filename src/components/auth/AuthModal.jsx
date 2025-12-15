import { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import RegisterPhoneForm from "./register/RegisterPhoneForm";
import RegisterOtpForm from "./register/RegisterOtpForm";
import RegisterFinalForm from "./register/RegisterFinalForm";
import LoginForm from "./login/LoginForm";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("register-phone");
  const [registerPhone, setRegisterPhone] = useState("");

  const modalRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [dragY, setDragY] = useState(0);

  /* ---------------- Detect Mobile ---------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---------------- Lock Body Scroll ---------------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.body.style.touchAction = isOpen ? "none" : "";
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ---------------- Backdrop Click ---------------- */
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  /* ---------------- iOS Drag To Close ---------------- */
  const handleDragStart = (e) => {
    if (!isMobile) return;

    e.preventDefault();

    const startY = e.touches[0].clientY;

    const move = (ev) => {
      ev.preventDefault();
      const diff = ev.touches[0].clientY - startY;
      setDragY(Math.max(0, diff));
    };

    const end = () => {
      if (dragY > 120) onClose();
      setDragY(0);

      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };

    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* ---------- Backdrop ---------- */}
      <div
        dir="rtl"
        onClick={handleBackdropClick}
        className="
          fixed inset-0 z-[200]
          flex justify-center md:items-center
          bg-black/40 dark:bg-black/60
          backdrop-blur-[1px]
          overscroll-none touch-none
        "
      >
        {/* ---------- Modal ---------- */}
        <div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleDragStart}
          style={{
            transform: `translateY(${dragY}px)`,
            transition: dragY === 0 ? "transform 0.25s ease-out" : "none",
          }}
          className="
            w-full md:max-w-sm
            bg-white dark:bg-gray-900
            shadow-xl p-6 relative
            mt-auto md:mt-0
            rounded-t-[32px] md:rounded-3xl
            overflow-hidden
            touch-none
            animate-slide-up-ios md:animate-fade-in
          "
        >
          {/* ---- Drag Handle (Mobile) ---- */}
          {isMobile && (
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          )}

          {/* ---- Close Button (Desktop Only) ---- */}
          {!isMobile && (
            <button
              onClick={onClose}
              className="
                absolute top-4 right-4
                text-gray-500 hover:text-gray-700
                dark:text-gray-400 dark:hover:text-gray-200
                text-xl
              "
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
            <RegisterFinalForm
              phone={registerPhone}
              onSuccess={onClose}
            />
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
