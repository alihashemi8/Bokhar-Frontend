import { useState } from "react";
import { apiPost } from "../../api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function RegisterForm({ onSwitch, setLoading }) {
  const [fullName, setFullName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [email, setEmail] = useState(""); // اختیاری
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLocalLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "نام و نام خانوادگی الزامی است";
    if (!phoneOrEmail.trim())
      newErrors.phoneOrEmail = "شماره یا ایمیل الزامی است";
    if (email && !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email))
      newErrors.email = "ایمیل معتبر وارد کنید";
    if (!password.trim()) newErrors.password = "رمز عبور الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLocalLoading(true);
    setLoading?.(true);
    try {
      await apiPost("/register/", {
        name: fullName,
        phone_or_email: phoneOrEmail,
        email: email || null,
        password,
      });
      alert("ثبت‌نام با موفقیت انجام شد ✅");
      onSwitch();
    } catch (err) {
      console.error(err);
      alert("خطایی رخ داد، لطفاً دوباره تلاش کنید");
    } finally {
      setLocalLoading(false);
      setLoading?.(false);
    }
  };

  return (
    <div className="text-gray-700 dark:text-gray-100">
      <h2 className="text-lg sm:text-xl font-bold mb-5 text-center">
        ثبت‌نام
      </h2>

      {/* نام و نام خانوادگی */}
      <div className="mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="نام و نام خانوادگی"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 placeholder-gray-400 ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>

      {/* شماره یا ایمیل */}
      <div className="mb-3 sm:mb-4">
        <input
          type="text"
          dir="ltr"
          placeholder="شماره موبایل یا ایمیل"
          value={phoneOrEmail}
          onChange={(e) => setPhoneOrEmail(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 placeholder-gray-400 ${
            errors.phoneOrEmail ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phoneOrEmail && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneOrEmail}</p>
        )}
      </div>

      {/* ایمیل اختیاری */}
      <div className="mb-3 sm:mb-4">
        <input
          type="email"
          dir="ltr"
          placeholder="ایمیل (اختیاری)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 placeholder-gray-400 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* رمز عبور */}
      <div className="mb-4 relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="رمز عبور"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 sm:py-3 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 placeholder-gray-400 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      {/* دکمه ثبت‌نام */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-lg font-medium shadow-sm transition flex justify-center items-center gap-2 text-sm sm:text-base"
      >
        {loading && (
          <svg
            className="w-5 h-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3.536-3.536A8 8 0 004 12z"
            ></path>
          </svg>
        )}
        ثبت‌نام
      </button>

      {/* لینک ورود */}
      <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4">
        حساب دارید؟{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ورود
        </button>
      </p>
    </div>
  );
}
