import React, { useEffect } from "react";
import TimeSelector from "./TimeSelector";
import { X } from "lucide-react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function ModalPicker({
  onClose,
  onConfirm,
  type,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) {
  const title =
    type === "delivery"
      ? "📦 انتخاب زمان تحویل دادن"
      : "🕒 انتخاب زمان تحویل گرفتن";

  const hasSelectedDate = !!selectedDate;
  const hasSelectedTime = !!selectedTime;

  const dateObj = selectedDate
    ? new DateObject({
        date: selectedDate,
        calendar: persian,
        locale: persian_fa,
      })
    : null;

  // 🔒 Lock background scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-50 
        bg-black/40 backdrop-blur-[1px]
        flex justify-center items-end
      "
      onClick={onClose} // کلیک روی بک‌گراند → بستن مودال
    >
      {/* Bottom Sheet */}
      <div
        className="
          pointer-events-auto
          bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 
          rounded-t-3xl 
          w-full 
          max-h-[80vh] 
          overflow-y-auto 
          p-4 
          animate-slide-up-ios
          shadow-[0_-8px_20px_rgba(0,0,0,0.2)]
        "
        onClick={(e) => e.stopPropagation()} // جلوگیری از بستن هنگام کلیک داخل مودال
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-pink-500">{title}</h3>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Date + Time Picker */}
        <TimeSelector
          selectedDate={dateObj}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        {/* Message */}
        {!hasSelectedDate && (
          <p className="text-center text-gray-500 mt-5">
            لطفاً ابتدا یک روز را انتخاب کنید
          </p>
        )}

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          disabled={!hasSelectedTime}
          className={`
            block w-auto mt-5 p-2 rounded-xl mx-auto transition
            ${hasSelectedTime
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"}
          `}
        >
          {type === "delivery"
            ? "تایید و انتخاب زمان تحویل گرفتن"
            : "تایید نهایی"}
        </button>
      </div>
    </div>
  );
}
