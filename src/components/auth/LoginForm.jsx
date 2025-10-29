import { useState } from "react";
import { apiPost } from "../../api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginForm({
  onSwitchRegister,
  onOtpLogin,
  setLoading,
}) {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);

  const validateInputs = () => {
    const newErrors = {};
    if (!phoneOrEmail.trim())
      newErrors.phoneOrEmail = "شماره یا ایمیل الزامی است";
    if (!password.trim()) newErrors.password = "رمز عبور الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLocalLoading(true);
    setLoading?.(true);
    try {
      await apiPost("/login/", { phone_or_email: phoneOrEmail, password });
      alert("ورود موفق ✅");
    } catch (err) {
      console.error(err);
      alert("نام کاربری یا رمز عبور اشتباه است");
    } finally {
      setLocalLoading(false);
      setLoading?.(false);
    }
  };

  return (
    <div className="text-gray-700 dark:text-gray-100">
      <h2 className="text-xl font-bold mb-5 text-center">ورود</h2>

      {/* شماره موبایل یا ایمیل */}
      <div className="mb-4">
        <input
          type="text"
          dir="ltr"
          placeholder="شماره موبایل یا ایمیل"
          value={phoneOrEmail}
          onChange={(e) => setPhoneOrEmail(e.target.value)}
          className={`w-full border rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 ${
            errors.phoneOrEmail ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phoneOrEmail && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneOrEmail}</p>
        )}
      </div>

      {/* رمز عبور */}
      <div className="mb-5 relative">
        <input
          type={showPassword ? "text" : "password"}
          dir="ltr"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 ${
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

      {/* دکمه ورود */}
      <button
        onClick={handleSubmit}
        disabled={localLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition flex justify-center items-center gap-2"
      >
        {localLoading && (
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
        ورود
      </button>

      {/* لینک‌ها */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 space-y-2">
        <button
          onClick={onOtpLogin}
          className="text-blue-600 hover:underline text-xs"
        >
          ورود با رمز یک‌بار مصرف
        </button>
        <p>
          حساب ندارید؟{" "}
          <button
            onClick={onSwitchRegister}
            className="text-blue-600 hover:underline"
          >
            ثبت‌نام
          </button>
        </p>
      </div>
    </div>
  );
}
