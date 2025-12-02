import React, { useState, useEffect } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function TimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // شبیه‌سازی لودینگ برای UX بهتر
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, [weekOffset]);

  const days = Array.from({ length: 7 }, (_, i) =>
    new DateObject({ calendar: persian, locale: persian_fa }).add(
      weekOffset * 7 + i,
      "days"
    )
  );

  const timeSlots = ["۹ تا ۱۳", "۱۳ تا ۱۷", "۱۷ تا ۲۳"];

  return (
    <div>
      {/* ناوبری هفته */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
          className="text-purple-500 disabled:text-gray-300"
          disabled={weekOffset <= 0}
        >
          ← هفته قبل
        </button>
        <span className="font-medium text-gray-700">هفته {weekOffset + 1}</span>
        <button
          onClick={() => setWeekOffset((p) => p + 1)}
          className="text-purple-500"
        >
          هفته بعد →
        </button>
      </div>

      {/* روزها — برای موبایل اسکرول‌پذیر افقی */}
      <div className="md:grid md:grid-cols-7 gap-1 flex overflow-x-auto scrollbar-hide">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-20 bg-purple-100/50 animate-pulse rounded-xl flex-shrink-0 "
              />
            ))
          : days.map((day, idx) => {
              const isSelected =
                selectedDate?.format("YYYY/MM/DD") === day.format("YYYY/MM/DD");
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`border rounded-2xl p-3 text-center cursor-pointer transition w-20 h-24 flex flex-col justify-center flex-shrink-0 mx-auto
              ${
                isSelected
                  ? "bg-purple-100 border-purple-600"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
                >
                  <p className="text-sm font-medium text-purple-800">
                    {day.weekDay.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-800">{day.day}</p>
                  <p className="text-xs text-gray-500">{day.month.name}</p>
                </div>
              );
            })}
      </div>

      {/* بازه‌های زمانی */}
      {selectedDate && (
<div className="mt-5 flex justify-center gap-3 flex-wrap animate-fadeInUp">
          {timeSlots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTime(slot)}
              className={`px-5 py-3 rounded-xl text-sm border transition ${
                selectedTime === slot
                  ? "bg-purple-600 text-white border-purple-600"
                  : "border-gray-300 text-gray-700 hover:bg-purple-50"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
