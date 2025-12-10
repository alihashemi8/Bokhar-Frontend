import { useState, useRef } from "react";
import { apiPost } from "../../api";
import { EyeIcon, EyeSlashIcon, UserIcon, PhoneIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default function RegisterForm({ onSwitch, setLoading }) {
  const [fullName, setFullName] = useState("");
  const [phoneValues, setPhoneValues] = useState(Array(11).fill(""));
  const inputsRef = useRef([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLocalLoading] = useState(false);

  const getPhoneNumber = () => phoneValues.join("");

  const validateInputs = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "نام و نام خانوادگی الزامی است";
    if (getPhoneNumber().length !== 11) newErrors.phoneOrEmail = "شماره موبایل باید 11 رقم باشد";
    if (!password.trim()) newErrors.password = "رمز عبور الزامی است";
    if (password.length < 6) newErrors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const newValues = [...phoneValues];
    newValues[index] = val;
    setPhoneValues(newValues);
    if (val && index < 10) inputsRef.current[index + 1].focus();
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLocalLoading(true);
    setLoading?.(true);
    try {
      await apiPost("/register/", {
        name: fullName,
        phone_or_email: getPhoneNumber(),
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
    <div className="max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        ثبت‌نام
      </h2>

      {/* نام و نام خانوادگی */}
      <div className="mb-5">
        <label className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1 flex items-center gap-1">
          <UserIcon className="w-4 h-4" /> نام و نام خانوادگی
        </label>
        <input
          type="text"
          placeholder="مثال: علی محمدی"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`w-full border-b-2 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 placeholder-gray-400 ${
            errors.fullName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>

{/* شماره موبایل */}
<div  className="mb-5 mx-auto">
  <label className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1 flex items-center mx-auto gap-1">
    <PhoneIcon className="w-4 h-4" /> شماره موبایل
  </label>

  <div dir="ltr" className="flex justify-between gap-1 max-w-sm mx-auto">
    {phoneValues.map((v, i) => (
      <input
        key={i}
        ref={(el) => (inputsRef.current[i] = el)}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={i === 0 ? "0" : i === 1 ? "9" : v}
        readOnly={i === 0 || i === 1}
        onChange={(e) => handlePhoneChange(i, e.target.value)}
        className="
          w-5 h-10 text-center
          border-b-2 border-gray-400
          focus:border-blue-500
          outline-none rounded-b-sm
          bg-transparent
          text-gray-800 dark:text-gray-100
        "
      />
    ))}
  </div>

  {errors.phoneOrEmail && (
    <p className="text-red-500 text-xs mt-1 text-center">
      {errors.phoneOrEmail}
    </p>
  )}
</div>


      {/* رمز عبور */}
      <div className="mb-6 relative">
        <label className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1 flex items-center gap-1">
          <LockClosedIcon className="w-4 h-4" /> رمز عبور
        </label>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="حداقل 6 کاراکتر"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border-b-2 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 placeholder-gray-400 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute bottom-0.5 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
        >
          {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
        </button>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* دکمه ثبت‌نام */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition flex justify-center items-center gap-2"
      >
        {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
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
