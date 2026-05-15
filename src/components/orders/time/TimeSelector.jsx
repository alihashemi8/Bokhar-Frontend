import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const timeSlots = ["۸ صبح تا ۱۳", "۱۶ تا ۲۰"];

export default function TimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  minDate,
  disabledTimeSlots = [],
  disabledDates = [], // ✅ prop جدید: آرایه‌ای از تاریخ‌های غیرفعال (YYYY-MM-DD)
  isLoading = false,
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const prevMinDateRef = useRef(null);

  const toDateObj = useCallback((date) => {
    if (!date) return null;
    return date instanceof DateObject
      ? date
      : new DateObject({ date, calendar: persian, locale: persian_fa });
  }, []);

  const baseDate = useMemo(() => {
    return minDate
      ? toDateObj(minDate)
      : new DateObject({ calendar: persian, locale: persian_fa });
  }, [minDate, toDateObj]);

  // ریست کردن هفته وقتی minDate عوض می‌شه
  useEffect(() => {
    const currentKey = minDate 
      ? (minDate instanceof DateObject 
          ? minDate.toJulianDay() 
          : new DateObject({ date: minDate, calendar: persian }).toJulianDay())
      : null;
    
    if (currentKey !== prevMinDateRef.current) {
      prevMinDateRef.current = currentKey;
      setWeekOffset(0);
    }
  }, [minDate]);

  // انیمیشن لودینگ
  useEffect(() => {
    if (isLoading) {
      setIsAnimating(true);
    } else {
      const t = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(t);
    }
  }, [isLoading, weekOffset]);

  // ساخت لیست ۷ روز آینده (بدون جمعه)
  const days = useMemo(() => {
    const result = [];
    let i = 0;
    let added = 0;

    while (added < 7) {
      const day = new DateObject(baseDate).add(weekOffset * 7 + i, "days");
      if (day.weekDay.index !== 6) { // 6 = جمعه
        result.push(day);
        added++;
      }
      i++;
    }
    return result;
  }, [baseDate, weekOffset]);

  const minDateObj = useMemo(() => {
    return minDate ? toDateObj(minDate) : null;
  }, [minDate, toDateObj]);

  const selectedDateKey = useMemo(() => {
    if (!selectedDate) return null;
    return toDateObj(selectedDate)?.format("YYYY/MM/DD");
  }, [selectedDate, toDateObj]);

  // ✅ چک کردن اینکه آیا تاریخ در لیست disabledDates هست یا نه
  const isDateDisabled = useCallback((dateObj) => {
    if (!disabledDates || disabledDates.length === 0) return false;
    
    const dateStr = dateObj.format("YYYY-MM-DD");
    const dateStrSlash = dateObj.format("YYYY/MM/DD");
    
    return disabledDates.some(d => 
      d === dateStr || d === dateStrSlash || d === dateObj.toJulianDay().toString()
    );
  }, [disabledDates]);

  const handlePrevWeek = useCallback(() => {
    setWeekOffset((p) => Math.max(0, p - 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setWeekOffset((p) => p + 1);
  }, []);

  const handleDateSelect = useCallback((day) => {
    // چک کردن minDate
    if (minDateObj && day.toJulianDay() < minDateObj.toJulianDay()) {
      return;
    }
    
    // ✅ چک کردن disabledDates
    if (isDateDisabled(day)) {
      return;
    }
    
    const currentKey = selectedDate ? toDateObj(selectedDate)?.format("YYYY/MM/DD") : null;
    if (currentKey === day.format("YYYY/MM/DD")) {
      return;
    }
    
    setSelectedDate(day);
  }, [minDateObj, selectedDate, setSelectedDate, toDateObj, isDateDisabled]);

  const handleTimeSelect = useCallback((slot) => {
    if (selectedTime === slot) return;
    if (disabledTimeSlots.includes(slot)) return;
    setSelectedTime(slot);
  }, [selectedTime, setSelectedTime, disabledTimeSlots]);

  return (
    <div>
      {/* navigator */}
      <div className="flex justify-between items-center mb-3">
        <button
          disabled={weekOffset === 0}
          onClick={handlePrevWeek}
          className="text-pink-500 disabled:text-gray-300 transition-colors"
        >
          → هفته قبل
        </button>

        <span className="font-medium text-gray-700 dark:text-gray-300">
          هفته {weekOffset + 1}
        </span>

        <button
          onClick={handleNextWeek}
          className="text-pink-500 transition-colors"
        >
          هفته بعد ←
        </button>
      </div>

      {/* Days */}
      <div className="flex md:grid md:grid-cols-7 gap-1 overflow-x-auto scrollbar-hide pb-2">
        {isAnimating
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-20 bg-pink-100/60 dark:bg-sky-800/40 animate-pulse rounded-xl flex-shrink-0"
              />
            ))
          : days.map((day) => {
              const isBeforeMin = minDateObj && day.toJulianDay() < minDateObj.toJulianDay();
              const isDisabledDate = isDateDisabled(day);
              const isSelected = selectedDateKey === day.format("YYYY/MM/DD");

              return (
                <div
                  key={day.toJulianDay()}
                  onClick={() => handleDateSelect(day)}
                  title={isDisabledDate ? "این روز ظرفیت تکمیل است" : ""}
                  className={`w-20 h-24 my-3 mx-0.5 rounded-2xl border flex flex-col justify-center text-center transition-all duration-300 flex-shrink-0 relative overflow-hidden
                    ${
                      isBeforeMin || isDisabledDate
                        ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
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
                  {/* نشانگر تکمیل ظرفیت */}
                  {(isDisabledDate) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  
                  <p className="text-sm font-medium text-pink-500">
                    {day.weekDay.name}
                  </p>
                  <p className="text-2xl font-bold">
                    {day.day}
                  </p>
                  <p className="text-xs text-gray-500">
                    {day.month.name}
                  </p>
                </div>
              );
            })}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mt-4 flex justify-center gap-3 flex-wrap animate-fadeInUp">
          {timeSlots.map((slot) => {
            const isDisabled = disabledTimeSlots.includes(slot);
            return (
              <button
                key={slot}
                onClick={() => handleTimeSelect(slot)}
                disabled={isDisabled}
                title={isDisabled ? "این بازه برای تحویل فوری در همان روز در دسترس نیست" : ""}
                className={`px-5 py-3 rounded-xl text-sm border transition-all duration-300 font-bold
                  ${
                    isDisabled
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
                      : selectedTime === slot
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
            );
          })}
        </div>
      )}
      
      {selectedDate && disabledTimeSlots.length > 0 && disabledTimeSlots.length < timeSlots.length && (
        <p className="mt-2 text-xs text-center text-amber-600 dark:text-amber-400">
          * برای تحویل فوری (۲۴ ساعته) در همان روز، فقط بازه زمانی متفاوت قابل انتخاب است
        </p>
      )}
    </div>
  );
}
