import React, { useEffect, useState, useMemo } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import MobileModal from "../../basemodal/MobileModal";

export default function ModalPicker({
  type,
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  minDate,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserSelectedDate, setHasUserSelectedDate] = useState(false); // ✅ فلگ انتخاب کاربر

  const title =
    type === "delivery"
      ? "📦 انتخاب زمان تحویل دادن"
      : "🕒 انتخاب زمان تحویل گرفتن";

  const timeSlots = ["۹ تا ۱۳", "۱۳ تا ۱۷", "۱۷ تا ۲۳"];

  const formatDate = (date) =>
    date instanceof DateObject
      ? date
      : new DateObject({ date, calendar: persian, locale: persian_fa });

const baseDate = useMemo(() => {
  return minDate
    ? formatDate(minDate)
    : new DateObject({ calendar: persian, locale: persian_fa });
}, [minDate]);

const minDateObj = useMemo(() => {
  return minDate ? formatDate(minDate) : null;
}, [minDate]);


  useEffect(() => setWeekOffset(0), [minDate, type]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, [weekOffset]);

const days = useMemo(
  () =>
    Array.from({ length: 7 }, (_, i) =>
      new DateObject(baseDate).add(weekOffset * 7 + i, "days")
    ).filter((day) => day.weekDay.index !== 6), 
  [baseDate, weekOffset]
);


  const formatSafe = (date) => {
    if (!date) return "";
    try {
      return formatDate(date).format("dddd DD MMMM");
    } catch {
      return "";
    }
  };



  const isConfirmDisabled = !hasUserSelectedDate || !selectedTime;

  return (
    <MobileModal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-center text-md mb-2 font-bold">{title}</h2>

      {/* Preview */}
      {(selectedDate || selectedTime) && (
        <div className="my-3 text-sm text-gray-700 dark:text-gray-300">
          {selectedDate && (
            <span className="font-semibold">{formatSafe(selectedDate)}</span>
          )}
          {selectedTime && <span> – ساعت {selectedTime}</span>}
        </div>
      )}

      {/* Navigator */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
          disabled={weekOffset <= 0}
          className="text-pink-500 disabled:text-gray-300"
        >
          → هفته قبل
        </button>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          هفته {weekOffset + 1}
        </span>
        <button
          onClick={() => setWeekOffset((p) => p + 1)}
          className="text-pink-500"
        >
          هفته بعد ←
        </button>
      </div>

      {/* Days */}
      <div className="flex overflow-x-auto scrollbar-hide">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-20 bg-pink-100/50 animate-pulse rounded-xl mx-1 flex-shrink-0"
              />
            ))
          : days.map((day, idx) => {
              const dayObj = formatDate(day);
              const isDisabled =
                minDateObj &&
                dayObj.toJulianDay() < minDateObj.toJulianDay();
              const isSelected =
                hasUserSelectedDate &&
                formatDate(selectedDate).format("YYYY/MM/DD") ===
                  dayObj.format("YYYY/MM/DD");

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isDisabled) return;
                    setSelectedDate(dayObj);
                    setHasUserSelectedDate(true); 
                  }}
                  className={`border rounded-2xl p-3 my-4 text-center transition-all duration-300 w-20 h-24 flex flex-col justify-center flex-shrink-0 mx-1 ${
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : isSelected
                      ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 text-gray-800 dark:text-white/90 shadow-md shadow-indigo-300 scale-105 cursor-pointer font-bold"
                      : "bg-white/80 dark:bg-white/70 border border-gray-200 text-gray-800 hover:bg-sky-100 dark:hover:bg-white/95 shadow-md cursor-pointer font-bold"
                  }`}
                >
                  <p className="text-sm font-medium text-pink-500">
                    {dayObj.weekDay.name}
                  </p>
                  <p className="text-2xl font-bold">{dayObj.day}</p>
                  <p className="text-xs">{dayObj.month.name}</p>
                </div>
              );
            })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-5 flex justify-center gap-3 flex-wrap animate-fadeInUp">
          {timeSlots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTime(slot)}
              className={`px-5 py-3 rounded-xl text-sm border transition-all duration-300 ${
                selectedTime === slot
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 text-gray-800 dark:text-white/90 shadow-md shadow-indigo-300 scale-105 font-bold"
                  : "bg-white/80 border border-gray-200 text-gray-800 hover:bg-sky-100 dark:hover:bg-white/95 shadow-md font-bold"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      {/* Confirm */}
      <button
        disabled={isConfirmDisabled}
        onClick={() => !isConfirmDisabled && onConfirm(type)}
        className={`block mx-auto mt-6 px-6 py-2 rounded-xl ${
          !isConfirmDisabled
            ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 text-gray-800 dark:text-gray-300 font-bold shadow-md shadow-indigo-300"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {type === "delivery" ? "انتخاب زمان تحویل گرفتن" : "تایید نهایی"}
      </button>
    </MobileModal>
  );
}
