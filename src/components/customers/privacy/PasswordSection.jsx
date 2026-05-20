import {
  Lock,
  Eye,
  EyeOff,
  Info,
  Shield,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

/* ================= Password Input with Instant Persian Block ================= */
function PasswordInput({ 
  placeholder, 
  value, 
  onChange, 
  showRules = false,
  ...props 
}) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (/[\u0600-\u06FF]/.test(e.key)) {
      e.preventDefault();
      return;
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (/[\u0600-\u06FF]/.test(pastedText)) {
      e.preventDefault();
      alert("کپی کردن حروف فارسی مجاز نیست");
    }
  };

  return (
    <div className="relative">
      {showRules && isFocused && (
        <div className="absolute bottom-full mb-2 right-0 md:left-0 md:right-auto w-72 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <Info size={16} className="text-blue-500" />
            <p className="font-semibold text-gray-900 dark:text-gray-100">برای قوی‌تر شدن رمز عبورتون:</p>
          </div>
          <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs">
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*()_+\-=\\\[\\\]{};':"\\|,.<>\/?]/.test(value) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <span className={/[!@#$%^&*()_+\-=\\\[\\\]{};':"\\|,.<>\/?]/.test(value) ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                استفاده از کاراکتر خاص مثل (@,#,$,%,...)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(value) && /[A-Z]/.test(value) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <span className={/[a-z]/.test(value) && /[A-Z]/.test(value) ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                ترکیب حروف بزرگ و کوچک انگلیسی (a-z, A-Z)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(value) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
              <span className={/[0-9]/.test(value) ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                استفاده از اعداد (0-9)
              </span>
            </li>
          </ul>
          <div className="absolute -bottom-1.5 right-4 md:left-4 md:right-auto w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        </div>
      )}

      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="
          w-full p-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition
          bg-white dark:bg-sky-900/60 border-sky-300 dark:border-sky-700 text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-300
        "
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

/* ================= Password Strength (100% only with A, a, 0-9, @# and 8+ chars) ================= */
function getPasswordStrength(password) {
  if (!password || password.length === 0) return null;
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[#@!$%^&*]/.test(password);
  const hasLength = password.length >= 8;
  
  // Count how many character types are present
  let criteriaCount = 0;
  if (hasLower) criteriaCount++;
  if (hasUpper) criteriaCount++;
  if (hasNumber) criteriaCount++;
  if (hasSpecial) criteriaCount++;
  
  // If length is less than 8 or fewer than 2 criteria: Weak
  if (!hasLength || criteriaCount < 2) {
    return { label: "ضعیف", color: "bg-red-500", percent: 25 };
  }
  
  // 2 criteria met: Medium
  if (criteriaCount === 2) {
    return { label: "متوسط", color: "bg-yellow-500", percent: 50 };
  }
  
  // 3 criteria met: Good
  if (criteriaCount === 3) {
    return { label: "خوب", color: "bg-blue-500", percent: 75 };
  }
  
  // All 4 criteria + length >= 8: Strong (100%)
  if (criteriaCount === 4 && hasLength) {
    return { label: "قوی", color: "bg-green-500", percent: 100 };
  }
  
  // Fallback (shouldn't reach here if logic is correct)
  return { label: "خوب", color: "bg-blue-500", percent: 75 };
}

export default function PasswordSection() {
  const { user, refreshUser } = useAuth();
  const hasPassword = Boolean(user?.has_password);

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // OTP States (for users who have password but want to use OTP instead of current password)
  const [useOtp, setUseOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  function getCSRFToken() {
    const match = document.cookie.match(/csrftoken=([\w-]+)/);
    return match ? match[1] : "";
  }

  const sendOTP = async () => {
    setOtpLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/send-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          credentials: "include",
          body: JSON.stringify({ 
            phone: user?.phone || user?.mobile 
          }),
        }
      );

      if (!res.ok) throw new Error("خطا در ارسال کد");

      setOtpSent(true);
      setOtpTimer(120); // 2 minutes
      setSuccess("کد تایید به شماره موبایل شما ارسال شد");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "خطا در ارسال کد تایید");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      setError("لطفاً کد را وارد کنید");
      return;
    }
    
    setOtpLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          credentials: "include",
          body: JSON.stringify({ 
            phone: user?.phone || user?.mobile,
            code: otp 
          }),
        }
      );

      if (!res.ok) throw new Error("کد وارد شده صحیح نیست");

      setOtpVerified(true);
      setSuccess("کد تایید شد");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.message || "کد وارد شده صحیح نیست");
    } finally {
      setOtpLoading(false);
    }
  };

  const isPasswordFormValid = hasPassword
    ? useOtp
      ? otpVerified && password.new.trim() !== "" && password.new === password.confirm
      : password.current.trim() !== "" && password.new.trim() !== "" && password.new === password.confirm
    : password.new.trim() !== "" && password.new === password.confirm;

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");

    if (!isPasswordFormValid) {
      setError(
        useOtp 
          ? "لطفاً کد تایید را وارد و تایید کنید، سپس رمز جدید را تکمیل نمایید"
          : "لطفاً تمام فیلدها را پر کنید و مطمئن شوید رمز عبور و تکرار آن یکسان هستند."
      );
      return;
    }

    setLoading(true);

    const data = hasPassword
      ? useOtp
        ? {
            otp_code: otp,
            password: password.new,
            password2: password.confirm,
          }
        : {
            old_password: password.current,
            password: password.new,
            password2: password.confirm,
          }
      : {
          password: password.new,
          password2: password.confirm,
        };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/edit/password/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result?.old_password?.[0] ||
            result?.password?.[0] ||
            result?.password2?.[0] ||
            result?.detail ||
            result?.otp_code?.[0] ||
            "خطای اعتبارسنجی"
        );
      }

      setSuccess("رمز عبور با موفقیت تغییر کرد!");
      setPassword({ current: "", new: "", confirm: "" });
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
      setUseOtp(false);
      refreshUser?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(password.new);

  return (
    <div className="bg-sky-50 dark:bg-gradient-to-br dark:from-sky-800 dark:via-sky-900 dark:to-sky-950 border border-sky-200 dark:border-sky-700 rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
      <div className="flex items-center gap-3 mb-5">
        <Lock className="text-blue-600" size={24} />
        <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
          {hasPassword ? "تغییر رمز عبور" : "تنظیم رمز عبور"}
        </p>
      </div>

      <div className="space-y-3">
        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-sm font-medium bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            {success}
          </p>
        )}

        {/* If user has password, show verification method selection */}
        {hasPassword && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-3">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2 font-medium">
              روش تایید هویت را انتخاب کنید:
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setUseOtp(false);
                  setOtp("");
                  setOtpSent(false);
                  setOtpVerified(false);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                  !useOtp
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  <Lock size={16} />
                  رمز فعلی
                </span>
              </button>
              <button
                onClick={() => {
                  setUseOtp(true);
                  setPassword(prev => ({ ...prev, current: "" }));
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                  useOtp
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  <Shield size={16} />
                  کد تایید (OTP)
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Current password input (only if hasPassword and not using OTP) */}
        {hasPassword && !useOtp && (
          <PasswordInput
            placeholder="رمز فعلی"
            value={password.current}
            onChange={(e) =>
              setPassword((prev) => ({
                ...prev,
                current: e.target.value,
              }))
            }
          />
        )}

        {/* OTP Section (only if hasPassword and using OTP) */}
        {hasPassword && useOtp && (
          <div className="space-y-3">
            {!otpVerified ? (
              <>
                {!otpSent ? (
                  <button
                    onClick={sendOTP}
                    disabled={otpLoading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                  >
                    {otpLoading ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Shield size={20} />
                        ارسال کد تایید به {user?.phone || "شماره موبایل"}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="کد ۶ رقمی را وارد کنید"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="flex-1 p-3 border rounded-xl text-center tracking-widest font-mono text-lg bg-white dark:bg-sky-900/60 border-sky-300 dark:border-sky-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={verifyOTP}
                        disabled={otpLoading || otp.length !== 6}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition"
                      >
                        {otpLoading ? <RefreshCw className="animate-spin" size={20} /> : "تایید"}
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <button
                        onClick={sendOTP}
                        disabled={otpTimer > 0 || otpLoading}
                        className="text-blue-600 dark:text-blue-400 disabled:text-gray-400 hover:underline"
                      >
                        {otpTimer > 0 ? `ارسال مجدد (${otpTimer} ثانیه)` : "ارسال مجدد کد"}
                      </button>
                      <button
                        onClick={() => setUseOtp(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                <CheckCircle size={20} />
                <span className="font-medium">هویت شما با موفقیت تایید شد</span>
              </div>
            )}
          </div>
        )}

        {/* New Password with Rules Tooltip */}
        <PasswordInput
          placeholder="رمز جدید (حداقل ۸ کاراکتر)"
          value={password.new}
          onChange={(e) =>
            setPassword((prev) => ({ ...prev, new: e.target.value }))
          }
          showRules={true}
        />

        {/* Password Strength Meter */}
        {strength && (
          <div className="mt-1">
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 flex justify-between">
              <span>قدرت رمز عبور:</span>
              <span className={`font-semibold ${
                strength.label === "قوی" ? "text-green-600 dark:text-green-400" :
                strength.label === "خوب" ? "text-blue-600 dark:text-blue-400" :
                strength.label === "متوسط" ? "text-yellow-600 dark:text-yellow-400" :
                "text-red-600 dark:text-red-400"
              }`}>
                {strength.label}
              </span>
            </p>
          </div>
        )}

        {/* Confirm New Password */}
        <PasswordInput
          placeholder="تایید رمز جدید"
          value={password.confirm}
          onChange={(e) =>
            setPassword((prev) => ({
              ...prev,
              confirm: e.target.value,
            }))
          }
        />

        {/* Password Mismatch Warning */}
        {password.confirm && password.new !== password.confirm && (
          <p className="text-red-500 text-xs mt-1">
            رمز عبور و تایید آن مطابقت ندارند
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePasswordChange}
          disabled={!isPasswordFormValid || loading}
          className={`w-full mt-3 rounded-xl p-3 font-medium transition disabled:opacity-50
            ${
              isPasswordFormValid && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {loading
            ? "در حال ارسال..."
            : hasPassword
            ? "ذخیره تغییرات"
            : "تنظیم رمز عبور"}
        </button>
      </div>
    </div>
  );
}
