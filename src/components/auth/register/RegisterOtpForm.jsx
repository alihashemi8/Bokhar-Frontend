import { useState, useEffect } from "react";
import OtpInput from "../ui/OtpInput";
import toast from "react-hot-toast";
import { verifyRegisterOtp, sendRegisterOtp } from "../../../api/apiClient";

export default function RegisterOtpForm({ phone, onNext, onBack }) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (loading) return;
    if (!/^\d{5,6}$/.test(otp)) {
      toast.error("کد تایید معتبر نیست");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyRegisterOtp(phone, otp);
      toast.success("کد تایید موفق ✅");
      onNext();
    } catch (err) {
      toast.error(err?.message || "خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading) return;
    setResendLoading(true);
    try {
      await sendRegisterOtp(phone);
      toast.success("کد تایید دوباره ارسال شد ✅");
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error(err?.message || "خطا در ارسال مجدد کد");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 sm:p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        کد تایید
      </h2>

      <OtpInput value={otp} onChange={(val) => setOtp(val.replace(/\D/g, ""))} />

      <button
        onClick={handleVerify}
        disabled={loading || otp.length < 5}
        className={`w-full mt-6 py-3 rounded-xl text-white font-medium flex justify-center items-center gap-2 ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? "در حال بررسی..." : "تایید"}
      </button>

      <p className="text-center mt-4 text-sm text-gray-500">
        {!canResend ? (
          <>ارسال مجدد کد تا {timer} ثانیه دیگر</>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-blue-600 hover:underline"
          >
            {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
          </button>
        )}
      </p>

      <button
        onClick={onBack}
        className="block mx-auto mt-4 text-blue-600 dark:text-blue-400 hover:underline"
      >
        بازگشت
      </button>
    </div>
  );
}
