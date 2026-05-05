import { useState, useEffect } from "react";
import { fetchGlobalDiscounts, createGlobalDiscount, updateGlobalDiscount } from "../../../../api/discountsApi";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

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

/* --------------------------------------------------
   Components
-------------------------------------------------- */

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
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">مقدار تخفیف</h4>
      
      <div className="flex gap-2 h-12 select-none">
        <div
          onClick={() => activate("percent")}
          className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-700 flex items-center transition-all duration-300 ease-out cursor-pointer ${
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
            className="w-full h-full px-3 bg-transparent outline-none pr-6 text-gray-800 dark:text-gray-100 remove-arrows"
            min="0"
            max="100"
          />
          <span className="absolute right-3 text-sm text-gray-500 dark:text-gray-400 pointer-events-none">٪</span>
          {localActive === "percent" && (
            <button onClick={handleReset} className="absolute left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ×
            </button>
          )}
        </div>

        <div
          onClick={() => activate("fixed")}
          className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-700 flex items-center transition-all duration-300 ease-out cursor-pointer ${
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
            placeholder="$ مبلغ"
            readOnly={localActive !== "fixed"}
              className="w-full h-full px-3 bg-transparent outline-none remove-arrows pr-8"
            min="0"
          />
          <span className="absolute left-8 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">تومان</span>
          {localActive === "fixed" && (
            <button onClick={handleReset} className="absolute left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              ×
            </button>
          )}
        </div>
      </div>
      
      {!localActive && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          برای وارد کردن تخفیف، روی یکی از فیلدها کلیک کنید
        </p>
      )}
    </div>
  );
}

function ScheduleSection({ isEnabled, schedule, onToggle, onChange, error }) {
  const handleTimeChange = (field, value) => {
    onChange({ ...schedule, [field]: value });
  };

  return (
    <div className="space-y-3 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-200 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          محدودیت زمانی
        </span>
        <button
          type="button"
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            isEnabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? "-translate-x-6" : "-translate-x-1"
            }`}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mr-1">تاریخ شروع</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={schedule.startDate}
                onChange={(date) => onChange({ ...schedule, startDate: date })}
                format="YYYY/MM/DD"
                className="rmdp-mobile"
                inputClass="w-full bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-xl h-10 px-3 text-sm outline-none focus:border-purple-500 text-gray-800 dark:text-gray-100"
                containerClassName="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mr-1">ساعت شروع</label>
              <div className="flex items-center bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-xl h-10 px-3 focus-within:border-purple-500">
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => handleTimeChange("startTime", e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mr-1">تاریخ پایان</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={schedule.endDate}
                onChange={(date) => onChange({ ...schedule, endDate: date })}
                format="YYYY/MM/DD"
                className="rmdp-mobile"
                inputClass="w-full bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-xl h-10 px-3 text-sm outline-none focus:border-purple-500 text-gray-800 dark:text-gray-100"
                containerClassName="w-full"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 dark:text-gray-400 mr-1">ساعت پایان</label>
              <div className="flex items-center bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-xl h-10 px-3 focus-within:border-purple-500">
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => handleTimeChange("endTime", e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100"
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          تخفیف بدون محدودیت زمانی (همیشگی) اعمال می‌شود
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------
   Main Component
-------------------------------------------------- */

export default function GlobalDiscountTab() {
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [discount, setDiscount] = useState({ percent: "", amount: "", activeType: null });
  const [scheduleOn, setScheduleOn] = useState(false);
  const [schedule, setSchedule] = useState({
    startDate: null, 
    endDate: null, 
    startTime: "00:00", 
    endTime: "23:59"
  });
  const [error, setError] = useState(null);

  // Load data
  const load = async () => {
    try {
      const res = await fetchGlobalDiscounts();
      setItems(res);
    } catch (err) {
      console.error("Error loading global discounts:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Form handlers
  const resetForm = () => {
    setDiscount({ percent: "", amount: "", activeType: null });
    setScheduleOn(false);
    setSchedule({ startDate: null, endDate: null, startTime: "00:00", endTime: "23:59" });
    setError(null);
    setEditingId(null);
  };

  const startAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setDiscount({
      percent: item.type === "percent" ? item.value : "",
      amount: item.type === "fixed" ? item.value : "",
      activeType: item.type
    });
    
    if (item.start_at && item.end_at) {
      setScheduleOn(true);
      const s = new Date(item.start_at);
      const e = new Date(item.end_at);
      setSchedule({
        startDate: s, 
        endDate: e,
        startTime: s.toTimeString().slice(0,5),
        endTime: e.toTimeString().slice(0,5)
      });
    } else {
      setScheduleOn(false);
      setSchedule({ startDate: null, endDate: null, startTime: "00:00", endTime: "23:59" });
    }
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    resetForm();
  };

  const validateForm = () => {
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

  const saveDiscount = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const payload = {
        type: discount.activeType,
        value: discount.activeType === "percent" 
          ? Number(discount.percent) 
          : Number(discount.amount),
        ...(scheduleOn && {
          start_at: persianToISO(schedule.startDate, schedule.startTime),
          end_at: persianToISO(schedule.endDate, schedule.endTime)
        })
      };

      if (editingId) {
        await updateGlobalDiscount(editingId, payload);
      } else {
        await createGlobalDiscount(payload);
      }
      
      await load();
      setIsEditing(false);
      resetForm();
    } catch (err) {
      setError("خطا در ذخیره تخفیف");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 px-3 md:px-4 overflow-x-hidden">
      <div className="w-full p-4 md:p-5 rounded-2xl bg-white/70 dark:bg-neutral-800/60 backdrop-blur-md border border-sky-200 dark:border-indigo-600 shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            تخفیف‌های عمومی
          </h3>

          {!isEditing && (
            <button
              onClick={startAdd}
              className="px-4 py-2 rounded-xl bg-purple-700 text-white shadow hover:scale-105 transition text-sm"
            >
              + افزودن تخفیف عمومی
            </button>
          )}
        </div>

        {/* Inline Form */}
        {isEditing && (
          <div className="mb-6 p-4 bg-white/90 dark:bg-neutral-700/50 rounded-xl border border-sky-200 dark:border-indigo-600/60 shadow-sm space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-neutral-600 pb-2">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {editingId ? "ویرایش تخفیف" : "تخفیف جدید"}
              </h4>
              <button 
                onClick={cancelEdit}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <ScheduleSection
              isEnabled={scheduleOn}
              schedule={schedule}
              onToggle={() => setScheduleOn(!scheduleOn)}
              onChange={setSchedule}
              error={error?.includes("تاریخ") || error?.includes("زمان") ? error : null}
            />

            <DiscountInputs value={discount} onChange={setDiscount} />

            {error && !error.includes("تاریخ") && !error.includes("زمان") && (
              <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={cancelEdit}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-neutral-600 hover:bg-gray-300 dark:hover:bg-neutral-500 transition text-sm text-gray-800 dark:text-gray-200"
                disabled={loading}
              >
                انصراف
              </button>
              <button 
                onClick={saveDiscount}
                disabled={loading || !discount.activeType}
                className="px-6 py-2 rounded-xl bg-purple-600 text-white text-sm disabled:opacity-50 hover:bg-purple-700 transition"
              >
                {loading ? "..." : (editingId ? "ذخیره تغییرات" : "افزودن")}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {items.length === 0 && !isEditing ? (
          <p className="text-gray-500 text-center py-4">
            هیچ تخفیف عمومی فعالی موجود نیست.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white/90 dark:bg-neutral-700/80 border border-sky-200/60 dark:border-indigo-600/60 rounded-xl shadow-sm transition hover:shadow-md flex justify-between items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-sky-100 dark:bg-purple-700 text-sky-700 dark:text-white">
                      {item.type === "percent" ? "درصدی" : "مبلغی"}
                    </span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">
                      {item.type === "percent" ? `${item.value}%` : `${item.value.toLocaleString()} $`}
                    </span>
                    {item.start_at && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        (تا {new Date(item.end_at).toLocaleDateString('fa-IR')})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => startEdit(item)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-sky-100 hover:bg-sky-200 dark:bg-purple-700 dark:hover:bg-purple-600 text-gray-800 dark:text-white transition"
                >
                  ویرایش
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .remove-arrows::-webkit-outer-spin-button,
        .remove-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .remove-arrows[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
