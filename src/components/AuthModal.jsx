import { useState, useEffect } from "react";
import { apiPost } from "../api.js"; 

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState("phone");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);

  // مدیریت تایمر
  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setResendAvailable(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validateInputs = () => {
    const newErrors = {};
    if (!fullName.trim()) {
      newErrors.fullName = "لطفا نام و نام خانوادگی خود را وارد کنید";
    }
    if (!/^09\d{9}$/.test(phone)) {
      newErrors.phone =
        "شماره موبایل معتبر نیست (باید با 09 شروع شود و 11 رقم باشد)";
    }
    if (email && !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = "ایمیل معتبر وارد کنید";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPhone = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const data = await apiPost("/submit/", {
        name: fullName,
        phone,
        email,
      });
      console.log("Submission response:", data);

      setStep("otp");
      setTimer(60);
      setResendAvailable(false);
    } catch (err) {
      console.error(err);
      alert("ارسال به سرور با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const data = await apiPost("/verify-otp/", {
        phone,
        otp: otp.join(""),
      });
      alert("ورود موفق: " + fullName);
      onClose();
    } catch (err) {
      console.error(err);
      alert("کد اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setResendAvailable(false);

    try {
      await apiPost("/resend-otp/", { phone });
      console.log("کد مجدد ارسال شد");
    } catch (err) {
      console.error(err);
      alert("ارسال مجدد با خطا مواجه شد");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 transition-opacity duration-300"
    >
      <div className="bg-white w-[90%] max-w-sm rounded-xl p-5 shadow-lg relative animate-[fadeIn_0.3s_ease]">
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        {step === "phone" && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
              ورود
            </h2>

            {/* نام و نام خانوادگی */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">نام و نام خانوادگی</p>
              <input
                type="text"
                placeholder="مثال: نرگس احمدی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* شماره همراه */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">شماره همراه</p>
              <input
                dir="ltr"
                type="text"
                placeholder="09123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* ایمیل اختیاری */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">ایمیل (اختیاری)</p>
              <input
                dir="ltr"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <button
              onClick={handleSubmitPhone}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? "در حال ارسال..." : "دریافت کد"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
              کد تایید
            </h2>
            <div dir="ltr" className="flex justify-between gap-1.5 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[0-9]?$/.test(val)) {
                      const newOtp = [...otp];
                      newOtp[i] = val;
                      setOtp(newOtp);
                      if (val && i < 5) {
                        document.getElementById(`otp-${i + 1}`).focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) {
                      document.getElementById(`otp-${i - 1}`).focus();
                    }
                  }}
                  className="w-10 h-10 text-center font-mono text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow hover:bg-blue-700 transition disabled:opacity-50 text-sm mb-3"
            >
              {loading ? "در حال تایید..." : "تایید"}
            </button>

            <div className="text-center text-sm text-gray-600">
              {!resendAvailable ? (
                <p>ارسال مجدد کد تا {timer} ثانیه دیگر</p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-600 hover:underline"
                >
                  ارسال مجدد کد
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
