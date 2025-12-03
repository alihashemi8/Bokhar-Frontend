import React from "react";
import TimeSelector from "./TimeSelector";
import { X } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end">
      <div className="bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-4 animate-slide-up">
        {/* هدر مودال */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-pink-500">{title}</h3>
          <button onClick={onClose}>
            <X className="text-gray-500" />
          </button>
        </div>

        {/* انتخاب روز و ساعت */}
        <TimeSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        {/* فقط وقتی روز انتخاب شده دکمه‌ها ظاهر بشن */}
        {!hasSelectedDate && (
          <p className="text-center text-gray-500 mt-5">
            لطفاً ابتدا یک روز را انتخاب کنید
          </p>
        )}

        {/* دکمه تأیید */}
<button
  onClick={() => onConfirm(type)}
  disabled={!hasSelectedTime}
  className={`block w-auto mt-5 p-2 rounded-xl mx-auto transition 
    ${hasSelectedTime
      ? "bg-pink-500 text-white"
      : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
>
  {type === "delivery"
    ? "تایید و انتخاب زمان تحویل گرفتن"
    : "تایید نهایی"}
</button>

      </div>
    </div>
  );
}
