import { useState, useEffect, useRef } from "react";
import { apiPost } from "../../api";
import { PhoneIcon } from "@heroicons/react/24/solid";

export default function OtpLoginForm({ onBack, onClose, setLoading }) {
  const [step, setStep] = useState("form"); // form | otp
  const [phoneValues, setPhoneValues] = useState(Array(11).fill(""));
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [errors, setErrors] = useState({});

  const getPhoneNumber = () => phoneValues.join("");

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

  const handlePhoneChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    const newValues = [...phoneValues];
    newValues[index] = val;
    setPhoneValues(newValues);
    if (val && index < 10) inputsRef.current[index + 1]?.focus();
  };

  const handlePhoneKeyDown = (index, e) => {
    if (e.key === "Backspace" && !phoneValues[index] && index > 2) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (getPhoneNumber().length !== 11) {
      return setErrors({ phone: "شماره موبایل باید 11 رقم باشد" });
    }
    setErrors({});
    setLoading(true);
    try {
      await apiPost("/submit-otp/", { phone: getPhoneNumber() });
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
      await apiPost("/verify-otp/", {
        phone: getPhoneNumber(),
        otp: otp.join(""),
      });
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
      await apiPost("/resend-otp/", { phone: getPhoneNumber() });
    } catch {
      alert("ارسال مجدد کد با خطا مواجه شد");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8 text-gray-700 dark:text-gray-100">
      {step === "form" && (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">
            ورود با رمز یک‌بار مصرف
          </h2>

          {/* شماره موبایل */}
          <div className="mb-5 mx-auto">
            <label className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1 flex items-center gap-1">
              <PhoneIcon className="w-4 h-4" /> شماره موبایل
            </label>

            <div dir="ltr" className="flex justify-center gap-0.5 max-w-sm mx-auto">
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
                  onKeyDown={(e) => handlePhoneKeyDown(i, e)}
                  className="
                    w-6 h-10 text-center
                    border-b-2 border-gray-400
                    focus:border-blue-500
                    outline-none
                    bg-transparent
                    text-gray-800 dark:text-gray-100
                    rounded-b-sm
                  "
                />
              ))}
            </div>

            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 text-center">
                {errors.phone}
              </p>
            )}
          </div>

          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition"
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
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d?$/.test(val)) {
                    const newOtp = [...otp];
                    newOtp[i] = val;
                    setOtp(newOtp);
                    if (val && i < 5)
                      document.getElementById(`otp-${i + 1}`)?.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otp[i] && i > 0)
                    document.getElementById(`otp-${i - 1}`)?.focus();
                }}
                className="w-12 h-12 text-center font-mono text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition mb-3"
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
