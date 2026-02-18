import { useState } from "react";
import PhoneInputBoxes from "../ui/PhoneInputBoxes";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import OtpInput from "../ui/OtpInput";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

// 🌟 فقط برای ارسال OTP (لاگین نیست)
async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ⭐ مهم برای cookie
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export default function LoginForm({ onSwitchRegister, onClose }) {
  const [mode, setMode] = useState("login"); // login | otp
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const { loginWithPassword, loginWithOTP } = useAuth();

  // ==================== ورود با رمز عبور ====================
  const handleLoginPassword = async () => {
    if (loading) return;

    if (!/^09\d{9}$/.test(phone)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    if (!password) {
      toast.error("رمز عبور را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      await loginWithPassword({ phone, password });
      toast.success("ورود موفق ✅");
      onClose();
    } catch (err) {
      toast.error(err?.detail || "شماره یا رمز اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  // ==================== ارسال OTP ====================
  const handleSendOtp = async () => {
    if (!/^09\d{9}$/.test(phone)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/sent/otp", { phone });
      toast.success("کد OTP ارسال شد");
      setMode("otp");
    } catch (err) {
      toast.error(err?.detail || "خطا در ارسال OTP");
    } finally {
      setLoading(false);
    }
  };

  // ==================== تایید OTP ====================
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("کد OTP باید 6 رقمی باشد");
      return;
    }

    setLoading(true);
    try {
      await loginWithOTP({ phone, otp });
      toast.success("ورود موفق ✅");
      onClose();
    } catch (err) {
      toast.error(err?.detail || "کد OTP اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  // ==================== رندر فرم‌ها ====================
  return (
    <div className="max-w-md mx-auto p-1" dir="rtl">
      {mode === "login" && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6 md:my-6 text-gray-800 dark:text-gray-100">
            ورود به حساب کاربری
          </h2>

          <div className="flex items-center gap-2 mb-1">
            <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            <p className="text-gray-800 dark:text-gray-300 text-sm">
              شماره موبایل خود را وارد کنید:
            </p>
          </div>

          <PhoneInputBoxes
            value={phone}
            onChange={(val) => setPhone(val.replace(/\D/g, ""))}
          />

          <div className="mt-4 text-gray-800 dark:text-gray-100">رمز عبور:</div>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b p-1 pr-2 bg-transparent outline-none transition
               text-gray-800 border-gray-300 focus:border-blue-600 
               dark:border-gray-100 dark:focus:border-purple-600 dark:focus:border-b-2 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 dark:text-gray-300"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handleLoginPassword}
            disabled={loading || !/^09\d{9}$/.test(phone) || !password}
            className={`w-full py-3 mt-6 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition shadow-lg ${
              loading || !/^09\d{9}$/.test(phone) || !password
                ? "bg-blue-400 dark:bg-purple-500 cursor-not-allowed"
                : "bg-blue-600 dark:bg-purple-700 hover:bg-blue-700 dark:hover:bg-purple-900"
            }`}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          <div className="flex justify-between mt-6 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={handleSendOtp}
              className="text-blue-600 hover:underline dark:text-purple-400"
            >
              ورود با OTP
            </button>
            <button
              onClick={onSwitchRegister}
              className="text-blue-600 hover:underline dark:text-purple-400"
            >
              ثبت‌نام
            </button>
          </div>
        </>
      )}

      {mode === "otp" && (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">ورود با OTP</h2>

          <OtpInput value={otp} onChange={setOtp} />

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className={`w-full py-3 mt-6 rounded-xl text-white font-medium flex justify-center items-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "در حال تایید..." : "تایید OTP"}
          </button>

          <button
            onClick={() => setMode("login")}
            className="mt-4 w-full text-center text-gray-600 hover:underline"
          >
            بازگشت
          </button>
        </>
      )}
    </div>
  );
}
