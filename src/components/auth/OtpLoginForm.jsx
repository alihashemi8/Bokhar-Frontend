import { useState, useEffect } from "react";
import { apiPost } from "../../api";

export default function OtpLoginForm({ onBack, onClose, setLoading }) {
  const [step, setStep] = useState("form"); // form | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);

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

  const handleSendOtp = async () => {
    if (!phone.trim()) return alert("شماره موبایل را وارد کنید");
    setLoading(true);
    try {
      await apiPost("/submit-otp/", { phone });
      setStep("otp");
      setTimer(60);
      setResendAvailable(false);
    } catch {
      alert("ارسال OTP با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await apiPost("/verify-otp/", { phone, otp: otp.join("") });
      alert("ورود موفق با رمز یک‌بار مصرف ✅");
      onClose();
    } catch {
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
    } catch {
      alert("ارسال مجدد کد با خطا مواجه شد");
    }
  };

  return (
    <div className="text-gray-700 dark:text-gray-100">
      {step === "form" && (
        <>
          <h2 className="text-xl font-bold mb-5 text-center">ورود با رمز یک‌بار مصرف</h2>

          <div className="mb-4">
            <input
              dir="ltr"
              type="text"
              placeholder="شماره موبایل"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition text-sm"
          >
            دریافت کد تایید
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            بازگشت به{" "}
            <button onClick={onBack} className="text-blue-600 hover:underline">
              ورود
            </button>
          </p>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-xl font-bold mb-5 text-center">کد تایید</h2>

          <div dir="ltr" className="flex justify-between gap-2 mb-4 max-w-xs mx-auto">
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
                    if (val && i < 5) document.getElementById(`otp-${i + 1}`).focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[i] && i > 0)
                    document.getElementById(`otp-${i - 1}`).focus();
                }}
                className="w-12 h-12 text-center font-mono text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition text-sm mb-3"
          >
            تایید
          </button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
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
  );
}
