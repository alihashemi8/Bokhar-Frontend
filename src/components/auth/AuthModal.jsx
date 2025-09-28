import { useState } from "react";

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // حرکت به بعدی
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmitPhone = () => {
    if (!phone) return;
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    alert(`ورود موفق: ${name} ${lastName}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
        {/* دکمه بستن */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {step === "phone" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">ورود / ثبت‌نام</h2>
            <input
              type="text"
              placeholder="شماره موبایل"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-xl p-3 mb-3 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-xl p-3 mb-3 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-xl p-3 mb-5 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSubmitPhone}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              دریافت کد
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">کد تایید</h2>
            <div className="flex justify-between gap-2 mb-5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-12 text-center text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              تایید
            </button>
          </>
        )}
      </div>
    </div>
  );
}
