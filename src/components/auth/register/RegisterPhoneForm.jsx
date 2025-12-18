import { useState } from "react";
import { PhoneIcon } from "@heroicons/react/24/solid";
import PhoneInputBoxes from "../ui/PhoneInputBoxes";
import toast from "react-hot-toast";
import { sendRegisterOtp } from "../../../api/apiClient"; // ← ایمپورت تابع

export default function RegisterPhoneForm({ onNext, onSwitchLogin }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (loading) return;

    // اعتبارسنجی شماره
    if (!/^09\d{9}$/.test(phone)) {
      return toast.error("شماره موبایل باید با 09 شروع شده و 11 رقم باشد");
    }

    setLoading(true);

    try {
      const res = await sendRegisterOtp(phone); // ← استفاده از تابع apiClient

      toast.success("کد تایید ارسال شد");
      onNext(phone);
    } catch (err) {
      toast.error(err?.message || "خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-2 sm:p-6">
      {/* عنوان */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        ثبت‌نام
      </h2>

      {/* متن راهنما */}
      <div className="flex items-center gap-2 mb-3">
        <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        <span className="text-gray-600 dark:text-gray-300 text-sm">
          شماره موبایل خود را وارد کنید
        </span>
      </div>

      {/* ورودی شماره موبایل */}
      <PhoneInputBoxes
        value={phone}
        onChange={(val) => setPhone(val.replace(/\D/g, ""))}
      />

      <p className="text-gray-400 dark:text-gray-500 text-xs mt-2 text-center">
        شماره باید با 09 شروع شود و 11 رقم باشد
      </p>

      {/* دکمه ارسال */}
      <button
        onClick={handleNext}
        disabled={loading || phone.length < 11}
        className={`w-full mt-6 py-3 rounded-xl text-white font-medium flex justify-center items-center gap-2 transition ${
          loading || phone.length < 11
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
      </button>

      {/* لینک ورود */}
      <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        حساب دارید؟{" "}
        <button
          onClick={onSwitchLogin}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ورود
        </button>
      </p>
    </div>
  );
}
