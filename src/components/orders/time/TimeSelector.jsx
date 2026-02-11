import React, { useState, useEffect } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function TimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  minDate,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const toDateObj = (date) =>
    date instanceof DateObject
      ? date
      : new DateObject({ date, calendar: persian, locale: persian_fa });

  const baseDate = minDate
    ? toDateObj(minDate)
    : new DateObject({ calendar: persian, locale: persian_fa });

  useEffect(() => {
    setWeekOffset(0);
  }, [minDate]);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(t);
  }, [weekOffset]);

  const days = Array.from({ length: 7 }, (_, i) =>
    new DateObject(baseDate).add(weekOffset * 7 + i, "days")
  );

  const minDateObj = minDate ? toDateObj(minDate) : null;

  const timeSlots = ["۹ تا ۱۳", "۱۳ تا ۱۷", "۱۷ تا ۲۳"];

  return (
    <div>
      {/* navigator */}
      <div className="flex justify-between items-center mb-3">
        <button
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset((p) => Math.max(0, p - 1))}
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
      <div className="flex md:grid md:grid-cols-7 gap-1 overflow-x-auto scrollbar-hide">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-20 bg-pink-100/60 dark:bg-sky-800/40 animate-pulse rounded-xl flex-shrink-0"
              />
            ))
          : days.map((day, idx) => {
              const d = toDateObj(day);

              const isDisabled =
                minDateObj &&
                d.toJulianDay() < minDateObj.toJulianDay();

              const isSelected =
                selectedDate &&
                toDateObj(selectedDate).format("YYYY/MM/DD") ===
                  d.format("YYYY/MM/DD");

              return (
                <div
                  key={idx}
                  onClick={() => !isDisabled && setSelectedDate(d)}
                  className={`w-20 h-24 my-3 mx-0.5 rounded-2xl border flex flex-col justify-center text-center transition-all duration-300 flex-shrink-0
                    ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                        ? `
                          bg-gradient-to-r
                          from-sky-100 to-sky-200
                          dark:from-purple-700 dark:to-purple-800
                          border-gray-300 dark:border-indigo-600
                          text-gray-800 dark:text-white/90
                          shadow-md shadow-indigo-300
                          scale-105 font-bold
                        `
                        : `
                          bg-white/80 dark:bg-white/80 
                          border-gray-200 dark:border-sky-700
                          text-gray-800 dark:text-gray-800
                          hover:bg-sky-100 dark:hover:bg-white/90
                          shadow-md cursor-pointer font-bold
                        `
                    }`}
                >
                  <p className="text-sm font-medium text-pink-500">
                    {d.weekDay.name}
                  </p>
                  <p className="text-2xl font-bold">
                    {d.day}
                  </p>
                  <p className="text-xs text-gray-500">
                    {d.month.name}
                  </p>
                </div>
              );
            })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-4 flex justify-center gap-3 flex-wrap animate-fadeInUp">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`px-5 py-3 rounded-xl text-sm border transition-all duration-300 font-bold
                ${
                  selectedTime === slot
                    ? `
                      bg-gradient-to-r
                      from-sky-100 to-sky-200
                      dark:from-purple-700 dark:to-purple-800
                      border-gray-300 dark:border-indigo-600
                      text-gray-800 dark:text-white/90
                      shadow-md shadow-indigo-300
                      scale-105
                    `
                    : `
                      bg-white/80 dark:bg-white/80
                      border-gray-200 dark:border-sky-700
                      text-gray-800 dark:text-gray-800
                      hover:bg-sky-100 dark:hover:bg-white/90
                      shadow-md
                    `
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
