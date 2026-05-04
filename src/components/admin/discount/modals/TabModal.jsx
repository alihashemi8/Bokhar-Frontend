import { useState, useEffect } from "react";
import BaseModal from "../../../basemodal/BaseModal";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";

const persianToISO = (persianDate, timeStr) => {
  if (!persianDate) return null;
  try {
    const date = persianDate.toDate();
    const [hours, minutes] = (timeStr || "00:00").split(":");
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toISOString();
  } catch {
    return null;
  }
};

// ✅ کامپوننت اینپوت تخفیف با انیمیشن expand (شبیه MaterialDiscountInput)
function DiscountInputs({ value, onChange }) {
  const { percent, amount, activeType } = value;
  const [localActive, setLocalActive] = useState(activeType);

  useEffect(() => {
    setLocalActive(activeType);
  }, [activeType]);

  const handleReset = (e) => {
    e.stopPropagation();
    onChange({ percent: "", amount: "", activeType: null });
    setLocalActive(null);
  };

  const activate = (type) => {
    if (!localActive) {
      setLocalActive(type);
      onChange({ ...value, activeType: type });
    }
  };

  const handlePercentChange = (e) => {
    let v = e.target.value;
    if (v !== "") {
      const num = Number(v);
      if (num < 0) v = "0";
      if (num > 100) v = "100";
    }
    onChange({ ...value, percent: v, activeType: "percent" });
    if (!localActive) setLocalActive("percent");
  };

  const handleAmountChange = (e) => {
    let v = e.target.value;
    if (v !== "" && Number(v) < 0) v = "0";
    onChange({ ...value, amount: v, activeType: "fixed" });
    if (!localActive) setLocalActive("fixed");
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-800">مقدار تخفیف</h4>
      
      <div className="flex gap-2 h-12 select-none">
        {/* Percent Input */}
        <div
          onClick={() => activate("percent")}
          className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-300 ease-out cursor-pointer ${
            localActive === "percent" 
              ? "flex-[2]" 
              : localActive 
                ? "flex-0 opacity-0 w-0" 
                : "flex-1"
          }`}
        >
          <input
            type="number"
            value={percent}
            onChange={handlePercentChange}
            placeholder="درصد"
            readOnly={localActive !== "percent"}
            className="w-full h-full px-3 bg-transparent outline-none pr-6 remove-arrows [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
            max="100"
          />
          <span className="absolute right-3 text-sm text-gray-500 pointer-events-none">٪</span>
          {localActive === "percent" && (
            <button 
              onClick={handleReset} 
              className="absolute left-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Amount Input */}
        <div
          onClick={() => activate("fixed")}
          className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center transition-all duration-300 ease-out cursor-pointer ${
            localActive === "fixed" 
              ? "flex-[2]" 
              : localActive 
                ? "flex-0 opacity-0 w-0" 
                : "flex-1"
          }`}
        >
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="مبلغ"
            readOnly={localActive !== "fixed"}
            className="w-full h-full px-3 bg-transparent outline-none pr-6 remove-arrows [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="0"
          />
          <span className="absolute right-3 text-xs text-gray-500 pointer-events-none">$</span>
          {localActive === "fixed" && (
            <button 
              onClick={handleReset} 
              className="absolute left-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {!localActive && (
        <p className="text-xs text-gray-500">
          برای وارد کردن تخفیف، روی یکی از فیلدها کلیک کنید
        </p>
      )}
    </div>
  );
}

// ✅ کامپوننت زمان‌بندی شبیه DiscountTimeInputs
function ScheduleSection({ isEnabled, schedule, onToggle, onChange, error }) {
  const handleTimeChange = (field, value) => {
    onChange({ ...schedule, [field]: value });
  };

  return (
    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
      {/* Toggle Switch */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          میخواهید برای تخفیف زمان انتخاب کنید
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            isEnabled ? "bg-purple-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? "-translate-x-6" : "-translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Date & Time Inputs */}
      {isEnabled && (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 mr-1">تاریخ شروع</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={schedule.startDate}
                onChange={(date) => onChange({ ...schedule, startDate: date })}
                format="YYYY/MM/DD"
                className="rmdp-mobile"
                inputClass="w-full bg-white border border-gray-300 rounded-xl h-10 px-3 text-sm outline-none focus:border-purple-500"
                containerClassName="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 mr-1">ساعت شروع</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-xl h-10 px-3 focus-within:border-purple-500">
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => handleTimeChange("startTime", e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 mr-1">تاریخ پایان</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={schedule.endDate}
                onChange={(date) => onChange({ ...schedule, endDate: date })}
                format="YYYY/MM/DD"
                className="rmdp-mobile"
                inputClass="w-full bg-white border border-gray-300 rounded-xl h-10 px-3 text-sm outline-none focus:border-purple-500"
                containerClassName="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 mr-1">ساعت پایان</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-xl h-10 px-3 focus-within:border-purple-500">
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => handleTimeChange("endTime", e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
          
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>
      )}
      
      {!isEnabled && (
        <p className="text-xs text-gray-500">
          تخفیف بدون محدودیت زمانی (همیشگی) اعمال می‌شود
        </p>
      )}
    </div>
  );
}

export default function TabModal({ isOpen, onClose, category }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scheduleOn, setScheduleOn] = useState(false);
  const [schedule, setSchedule] = useState({
    startDate: null, 
    endDate: null, 
    startTime: "00:00", 
    endTime: "23:59"
  });
  const [discount, setDiscount] = useState({ 
    percent: "", 
    amount: "", 
    activeType: null 
  });

  // ✅ اصلاح: استفاده از useEffect به جای useMemo برای side-effects
  useEffect(() => {
    if (!isOpen) return;
    
    if (category?.discount) {
      const d = category.discount;
      setDiscount({
        percent: d.type === "percent" ? d.value : "",
        amount: d.type === "fixed" ? d.value : "",
        activeType: d.type
      });
      
      if (d.start_at && d.end_at) {
        setScheduleOn(true);
        const s = new Date(d.start_at);
        const e = new Date(d.end_at);
        setSchedule({
          startDate: s, 
          endDate: e,
          startTime: s.toTimeString().slice(0,5),
          endTime: e.toTimeString().slice(0,5)
        });
      } else {
        setScheduleOn(false);
        setSchedule({
          startDate: null, 
          endDate: null, 
          startTime: "00:00", 
          endTime: "23:59"
        });
      }
    } else {
      setDiscount({ percent: "", amount: "", activeType: null });
      setScheduleOn(false);
      setSchedule({
        startDate: null, 
        endDate: null, 
        startTime: "00:00", 
        endTime: "23:59"
      });
    }
  }, [isOpen, category]);

  const validate = () => {
    setError(null);
    
    if (!discount.activeType) {
      setError("مقدار تخفیف را وارد کنید");
      return false;
    }
    
    if (scheduleOn) {
      if (!schedule.startDate || !schedule.endDate) {
        setError("تاریخ شروع و پایان را انتخاب کنید");
        return false;
      }
      
      const startISO = persianToISO(schedule.startDate, schedule.startTime);
      const endISO = persianToISO(schedule.endDate, schedule.endTime);
      
      if (!startISO || !endISO) {
        setError("فرمت تاریخ نامعتبر است");
        return false;
      }
      
      if (new Date(endISO) <= new Date(startISO)) {
        setError("تاریخ پایان باید بعد از شروع باشد");
        return false;
      }
    }
    
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const payload = {
        category_id: category?.id,
        type: discount.activeType,
        value: discount.activeType === "percent" 
          ? Number(discount.percent) 
          : Number(discount.amount),
        ...(scheduleOn && {
          start_at: persianToISO(schedule.startDate, schedule.startTime),
          end_at: persianToISO(schedule.endDate, schedule.endTime)
        })
      };
      
      // فرض بر این است که createCategoryDiscount ایمپورت شده است
      await createCategoryDiscount(payload);
      onClose();
      window.location.reload();
    } catch {
      setError("خطا در ذخیره");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`تخفیف ${category?.name || ""}`} 
      maxWidth="md"
    >
      <div dir="rtl" className="py-1 px-3 space-y-4 max-h-[80vh] overflow-y-auto">
        
        {/* ✅ بخش زمان‌بندی با UI جدید */}
        <ScheduleSection
          isEnabled={scheduleOn}
          schedule={schedule}
          onToggle={() => setScheduleOn(!scheduleOn)}
          onChange={setSchedule}
          error={error?.includes("تاریخ") || error?.includes("زمان") ? error : null}
        />

        {/* ✅ بخش تخفیف با انیمیشن expand */}
        <DiscountInputs value={discount} onChange={setDiscount} />

        {/* ✅ نمایش خطا با استایل جدید */}
        {error && !error.includes("تاریخ") && !error.includes("زمان") && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* ✅ دکمه‌ها با استایل one-shot */}
        <div className="flex justify-between pt-4 border-t mt-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition text-sm"
            disabled={loading}
          >
            انصراف
          </button>
          
          <button 
            onClick={save} 
            disabled={loading || !discount.activeType}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white text-sm disabled:opacity-50 hover:bg-purple-700 transition"
          >
            {loading ? "..." : "ذخیره"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
