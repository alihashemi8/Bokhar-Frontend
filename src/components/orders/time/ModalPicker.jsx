import React, { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function ModalPicker({
  type,
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

  const title =
    type === "delivery"
      ? "📦 انتخاب زمان تحویل دادن"
      : "🕒 انتخاب زمان تحویل گرفتن";

  const timeSlots = ["۹ تا ۱۳", "۱۳ تا ۱۷", "۱۷ تا ۲۳"];

  const formatDate = (date) =>
    date instanceof DateObject
      ? date
      : new DateObject({ date, calendar: persian, locale: persian_fa });

  // پایه تاریخ
  const baseDate = useMemo(() => {
    const deliveryDate = minDate ? formatDate(minDate) : new DateObject({ calendar: persian, locale: persian_fa });
    if (type === "pickup") {
      // pickup حداقل 1 روز بعد delivery
      return deliveryDate.add(2, "days");
    }
    return deliveryDate;
  }, [minDate, type]);

  const minDateObj = useMemo(() => {
    if (!minDate) return null;
    const deliveryDate = formatDate(minDate);
    return type === "pickup" ? deliveryDate.add(2, "days") : deliveryDate;
  }, [minDate, type]);

  useEffect(() => setWeekOffset(0), [minDate, type]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, [weekOffset]);

  const days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) =>
      new DateObject(baseDate).add(weekOffset * 7 + i, "days")
    ), [baseDate, weekOffset]);

  const formatSafe = (date) => {
    if (!date) return "";
    try { return formatDate(date).format("dddd DD MMMM"); }
    catch { return ""; }
  };

  useEffect(() => {
    if (minDateObj && !selectedDate) setSelectedDate(minDateObj);
  }, [minDateObj, selectedDate, setSelectedDate]);

  return (
    <div dir="rtl" className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={onClose}>
      <div className="bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 w-full rounded-t-3xl p-4 max-h-[87vh] overflow-y-auto animate-slide-up-ios" onClick={e => e.stopPropagation()}>
        {/* header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-pink-500">{title}</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* preview */}
        {(selectedDate || selectedTime) && (
          <div className="text-center mb-3 text-sm text-gray-700">
            {selectedDate && <span className="font-semibold">{formatSafe(selectedDate)}</span>}
            {selectedTime && <span> – ساعت {selectedTime}</span>}
          </div>
        )}

        {/* navigator */}
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => setWeekOffset(p => Math.max(0, p - 1))} disabled={weekOffset <= 0} className="text-pink-500 disabled:text-gray-300">← هفته قبل</button>
          <span className="font-medium text-gray-700">هفته {weekOffset + 1}</span>
          <button onClick={() => setWeekOffset(p => p + 1)} className="text-pink-500">هفته بعد →</button>
        </div>

        {/* days */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {isLoading
            ? Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-24 w-20 bg-pink-100/50 animate-pulse rounded-xl mx-1 flex-shrink-0" />)
            : days.map((day, idx) => {
              const dayObj = formatDate(day);
              const isDisabled = minDateObj && dayObj.toJulianDay() < minDateObj.toJulianDay();
              const isSelected = selectedDate && formatDate(selectedDate).format("YYYY/MM/DD") === dayObj.format("YYYY/MM/DD");

              return (
                <div key={idx} onClick={() => !isDisabled && setSelectedDate(dayObj)}
                  className={`border rounded-2xl p-3 my-4 text-center transition w-20 h-24 flex flex-col justify-center flex-shrink-0 mx-1 ${
                    isDisabled ? "opacity-40 cursor-not-allowed"
                      : isSelected ? "bg-pink-50 border-pink-600 shadow-md shadow-pink-900 scale-105 cursor-pointer"
                      : "border-pink-400 hover:bg-pink-50 shadow-md shadow-pink-400 cursor-pointer"
                  }`}>
                  <p className="text-sm font-medium text-pink-500">{dayObj.weekDay.name}</p>
                  <p className="text-2xl font-bold text-gray-800">{dayObj.day}</p>
                  <p className="text-xs text-gray-500">{dayObj.month.name}</p>
                </div>
              );
            })}
        </div>

        {/* time slots */}
        {selectedDate && (
          <div className="mt-5 flex justify-center gap-3 flex-wrap animate-fadeInUp">
            {timeSlots.map((slot, idx) => (
              <button key={idx} onClick={() => setSelectedTime(slot)}
                className={`px-5 py-3 rounded-xl text-sm border transition ${
                  selectedTime === slot
                    ? "bg-pink-500/80 text-white border-pink-600 shadow-md shadow-pink-400 scale-105"
                    : "bg-sky-50 border-pink-400 text-gray-700 hover:bg-pink-300 shadow-xl shadow-pink-100"
                }`}>
                {slot}
              </button>
            ))}
          </div>
        )}

        {/* confirm */}
        <button disabled={!selectedTime} onClick={() => onConfirm(type)}
          className={`block mx-auto mt-6 px-6 py-2 rounded-xl ${selectedTime ? "bg-pink-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
          تایید
        </button>
      </div>
    </div>
  );
}
