import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { X } from "lucide-react";
import BaseModal from "../basemodal/BaseModal";
import RegisterPhoneForm from "./register/RegisterPhoneForm";
import RegisterOtpForm from "./register/RegisterOtpForm";
import RegisterFinalForm from "./register/RegisterFinalForm";
import LoginForm from "./login/LoginForm";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("register-phone");
  const [registerPhone, setRegisterPhone] = useState("");

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        maxWidth="sm"

      >
        {/* FORM WRAPPER */}
        <div className="relative">
          {/* Close button – only desktop & inside form */}
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

          {/* فرم‌ها */}
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
      </BaseModal>
    </>
  );
}
