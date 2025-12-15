import { useState } from "react";
import PhoneInputBoxes from "../ui/PhoneInputBoxes";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import OtpInput from "../ui/OtpInput"; // کامپوننت وارد کردن OTP
import { PhoneIcon } from "@heroicons/react/24/solid";

export default function LoginForm({ onSwitchRegister, onClose }) {
  const [mode, setMode] = useState("login"); // login | forgot-phone | forgot-otp | forgot-newpass
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  // ==================== ورود ====================
  const handleLogin = async () => {
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
      const res = await apiPost("/login/", { phone, password });
      if (!res?.ok) throw new Error(res?.message || "شماره یا رمز اشتباه است");

      toast.success("ورود موفق ✅");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== فراموشی رمز عبور ====================
  const handleSendOtp = async () => {
    if (!/^09\d{9}$/.test(phone)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost("/send-forgot-otp/", { phone });
      if (!res?.ok) throw new Error(res?.message || "خطا در ارسال کد");
      toast.success("کد OTP ارسال شد");
      setMode("forgot-otp");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("کد OTP باید 6 رقمی باشد");
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost("/verify-forgot-otp/", { phone, otp });
      if (!res?.ok) throw new Error(res?.message || "کد OTP اشتباه است");
      toast.success("کد تایید شد");
      setMode("forgot-newpass");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (newPass.length < 6) {
      toast.error("رمز عبور باید حداقل 6 کاراکتر باشد");
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost("/reset-password/", {
        phone,
        password: newPass,
      });
      if (!res?.ok) throw new Error(res?.message || "خطا در تغییر رمز");
      toast.success("رمز عبور با موفقیت تغییر کرد");
      setMode("login");
      setPassword("");
      setNewPass("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== رندر فرم‌ها ====================
  return (
    <div className="max-w-md mx-auto p-1" dir="rtl">
      {mode === "login" && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
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

          <div className="mt-8">رمز عبور خود را وارد کنید:</div>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b p-1 pr-2 bg-transparent text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:border-blue-600 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ⭐ دکمه ورود با شرط معتبر بودن شماره و رمز عبور */}
          <button
            onClick={handleLogin}
            disabled={
              loading ||
              !/^09\d{9}$/.test(phone) ||
              password.trim().length === 0
            }
            className={`
        w-full py-3 mt-6 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition shadow-lg
        ${
          loading || !/^09\d{9}$/.test(phone) || password.trim().length === 0
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
      `}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          <div className="flex justify-between mt-6 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={() => setMode("forgot-phone")}
              className="text-blue-600 hover:underline"
            >
              ورود با رمز یک بار مصرف
            </button>

            <button
              onClick={onSwitchRegister}
              className="text-blue-600 hover:underline"
            >
              ثبت‌نام
            </button>
          </div>
        </>
      )}

{mode === "forgot-phone" && (
  <>
    <h2 className="text-xl font-bold mb-4 text-center">
      فراموشی رمز عبور
    </h2>

    <div className="flex items-center gap-2 mb-3 mt-8">
      <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
      <span className="text-gray-600 dark:text-gray-300 text-sm">
        شماره موبایل خود را وارد کنید
      </span>
    </div>

    <PhoneInputBoxes
      value={phone}
      onChange={(val) => setPhone(val.replace(/\D/g, ""))}
    />

    <button
      onClick={handleSendOtp}
      disabled={loading || !/^09\d{9}$/.test(phone)}
      className={`w-full mt-8 py-3 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition
        ${
          loading || !/^09\d{9}$/.test(phone)
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
      `}
    >
      {loading && (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {loading ? "در حال ارسال..." : "ارسال کد یک بار مصرف"}
    </button>

    <button
      onClick={() => setMode("login")}
      className="mt-6 w-full text-center text-gray-600 hover:underline"
    >
      بازگشت
    </button>
  </>
)}


      {mode === "forgot-otp" && (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">تایید کد OTP</h2>
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
            تایید کد
          </button>
          <button
            onClick={() => setMode("forgot-phone")}
            className="mt-4 w-full text-center text-gray-600 hover:underline"
          >
            بازگشت
          </button>
        </>
      )}

      {mode === "forgot-newpass" && (
        <>
          <h2 className="text-xl font-bold mb-4 text-center">رمز عبور جدید</h2>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="رمز عبور جدید"
            className="w-full border rounded-xl p-3 bg-transparent text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:border-blue-600 outline-none transition"
          />
          <button
            onClick={handleSetNewPassword}
            disabled={loading}
            className={`w-full py-3 mt-6 rounded-xl text-white font-medium flex justify-center items-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            تغییر رمز عبور
          </button>
          <button
            onClick={() => setMode("login")}
            className="mt-4 w-full text-center text-gray-600 hover:underline"
          >
            بازگشت به ورود
          </button>
        </>
      )}
    </div>
  );
}
