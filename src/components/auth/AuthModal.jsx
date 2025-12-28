import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { X } from "lucide-react";
import BaseModal from "../basemodal/BaseModal";
import RegisterPhoneForm from "./register/RegisterPhoneForm";
import RegisterOtpForm from "./register/RegisterOtpForm";
import LoginForm from "./login/LoginForm";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("register-phone");

  const [registerPhone, setRegisterPhone] = useState("");
  const [registerFullname, setRegisterFullname] = useState("");

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />

      <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="sm">
        <div dir="rtl" className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close auth modal"
            className="
              hidden md:flex
              absolute top-1 -left-4
              items-center justify-center
              w-9 h-9 rounded-full
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
              z-10
            "
          >
            <X className="w-5 h-5" />
          </button>

          {/* REGISTER – PHONE */}
          {mode === "register-phone" && (
            <RegisterPhoneForm
              onNext={({ phone, fullname }) => {
                setRegisterPhone(phone);
                setRegisterFullname(fullname);
                setMode("register-otp");
              }}
              onSwitchLogin={() => setMode("login")}
            />
          )}

          {/* REGISTER – OTP */}
          {mode === "register-otp" && (
            <RegisterOtpForm
              phone={registerPhone}
              fullname={registerFullname}
              onBack={() => setMode("register-phone")}
              onSuccess={() => {
                // ثبت‌نام / لاگین موفق
                onClose();
              }}
            />
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <LoginForm
              onSwitchRegister={() => setMode("register-phone")}
              onClose={onClose}
            />
          )}
        </div>
      </BaseModal>
    </>
  );
}
