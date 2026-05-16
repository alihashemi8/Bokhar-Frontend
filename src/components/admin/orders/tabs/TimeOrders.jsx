import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Calendar, X, Clock, AlertCircle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import PropTypes from "prop-types";
import { capacityApi } from "../../../../api/capacityApi";

export default function TimeOrders({ 
  orders = [], 
  onSettingsChange
}) {
  const [disabledDates, setDisabledDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  
  // Ref برای جلوگیری از stale closure
  const templatesRef = useRef([]);
  
  // آپدیت ref وقتی templates تغییر می‌کنه
  useEffect(() => {
    templatesRef.current = templates;
  }, [templates]);

  const [deliverySettings, setDeliverySettings] = useState({
    urgent24h: {
      enabled: true,
      priceType: "fixed",
      priceValue: 0,
      fixedValue: 100000,
      limit: 10,
    },
    urgent48h: {
      enabled: true,
      priceType: "fixed",
      priceValue: 0,
      fixedValue: 50000,
      limit: 20,
    }
  });

  /* ---------- لود از بک‌اند ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [feeRes, templateRes] = await Promise.all([
          capacityApi.getRushFeeSettings(),
          capacityApi.getDeliveryTemplates()
        ]);

        const feeData = feeRes.data || {};
        const templatesData = Array.isArray(templateRes.data) ? templateRes.data : [];
        
        console.log("✅ Templates loaded:", templatesData);
        setTemplates(templatesData);

        // اگه تمپلیتی نیست، خطا نشون بده
        if (templatesData.length === 0) {
          setError("هیچ تمپلیت تحویلی در سیستم یافت نشد. لطفاً از پنل داخلی جنگو یک تمپلیت بسازید.");
          setLoading(false);
          return;
        }

        const template = templatesData[0] || {};
        
        setDeliverySettings({
          urgent24h: {
            enabled: feeData.is_24h_enabled !== false,
            priceType: feeData.percent_24h > 0 ? "percentage" : "fixed",
            priceValue: feeData.percent_24h || 0,
            fixedValue: feeData.fee_24h || 100000,
            limit: template.urgent_24_capacity || 10,
          },
          urgent48h: {
            enabled: feeData.is_48h_enabled !== false,
            priceType: feeData.percent_48h > 0 ? "percentage" : "fixed",
            priceValue: feeData.percent_48h || 0,
            fixedValue: feeData.fee_48h || 50000,
            limit: template.urgent_48_capacity || 20,
          }
        });

        // اطمینان از اینکه disabled_dates همیشه آرایه است
        const fetchedDisabledDates = Array.isArray(template.disabled_dates) 
          ? template.disabled_dates 
          : [];
          
        console.log("✅ Disabled dates from API:", fetchedDisabledDates);
        setDisabledDates(fetchedDisabledDates);
        
      } catch (error) {
        console.error("❌ Error loading settings:", error);
        setError("خطا در بارگذاری تنظیمات از سرور");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayPersian = useMemo(() => new DateObject({ calendar: persian }), []);
  
  const orderCounts = useMemo(() => {
    const counts = { urgent24h: 0, urgent48h: 0 };
    const now = new Date().getTime();
    
    orders.forEach(order => {
      if (order.status === "cancelled" || order.status === "returned") return;
      
      const delivery = new Date(order.deliveryDate).getTime();
      const diffHours = Math.ceil((delivery - now) / (1000 * 60 * 60));
      
      if (diffHours > 0 && diffHours <= 24) counts.urgent24h++;
      else if (diffHours > 24 && diffHours <= 48) counts.urgent48h++;
    });
    
    return counts;
  }, [orders]);

  const notifyParent = useCallback((newSettings, dates) => {
    onSettingsChange?.({
      disabledDates: dates ?? disabledDates,
      deliverySettings: newSettings ?? deliverySettings
    });
  }, [onSettingsChange, disabledDates, deliverySettings]);

  /* ---------- Sync برای تاریخ‌ها (با فرمت Gregorian) ---------- */
  const syncDatesToBackend = useCallback(async (datesToSave) => {
    const currentTemplates = templatesRef.current;
    
    console.log("🟡 syncDatesToBackend called");
    console.log("🟡 Templates available:", currentTemplates.length);
    console.log("🟡 Dates to save (should be Gregorian):", datesToSave);
    
    if (currentTemplates.length === 0) {
      console.error("🔴 No templates available in ref!");
      alert("خطا: تمپلیتی یافت نشد. لطفاً صفحه را رفرش کنید.");
      return;
    }

    try {
      setSaving(true);
      const template = currentTemplates[0];
      
      // اطمینان از فرمت میلادی
      const formattedDates = datesToSave.map(date => {
        // اگه تاریخ string هست و فرمتش درسته، همونو برگردون
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        // اگه آبجکت DateObject هست، تبدیل کن
        if (date && date.format) {
          return date.convert("gregorian").format("YYYY-MM-DD");
        }
        return String(date);
      });

      const payload = {
        disabled_dates: formattedDates,
      };
      
      console.log("🟢 Sending to API:", payload);
      
      const response = await capacityApi.updateDeliveryTemplate(template.id, payload);
      console.log("🟢 API Response:", response.data);
      
      notifyParent(null, formattedDates);
      
    } catch (error) {
      console.error("❌ Error saving dates:", error);
      console.error("❌ Response data:", error.response?.data);
      alert("خطا در ذخیره تاریخ‌های غیرفعال");
    } finally {
      setSaving(false);
    }
  }, [notifyParent]);

  /* ---------- Sync برای تنظیمات (ظرفیت و هزینه) ---------- */
  const syncSettingsToBackend = useCallback(async (newSettings) => {
    const currentTemplates = templatesRef.current;
    
    if (currentTemplates.length === 0) {
      console.error("🔴 No templates available!");
      return;
    }

    try {
      setSaving(true);
      const template = currentTemplates[0];
      
      const payload = {
        urgent_24_capacity: newSettings.urgent24h.limit,
        urgent_48_capacity: newSettings.urgent48h.limit,
      };
      
      console.log("🟢 Sending settings to API:", payload);
      
      await capacityApi.updateDeliveryTemplate(template.id, payload);
      notifyParent(newSettings, null);
      
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      alert("خطا در ذخیره تنظیمات ظرفیت");
    } finally {
      setSaving(false);
    }
  }, [notifyParent]);

  /* ---------- اضافه کردن تاریخ ---------- */
  const addDisabledDate = useCallback((date) => {
    if (!date || !date.isValid) {
      console.warn("⚠️ Invalid date selected");
      return;
    }
    
    // تبدیل به میلادی
    const gregorianDate = date.convert("gregorian").format("YYYY-MM-DD");
    console.log("📅 Adding date - Persian:", date.format("YYYY-MM-DD"), "→ Gregorian:", gregorianDate);
    
    setDisabledDates(prev => {
      if (prev.includes(gregorianDate)) {
        console.log("⚠️ Date already exists");
        return prev;
      }
      
      const updated = [...prev, gregorianDate].sort();
      
      // Sync به بک‌اند با تاریخ جدید
      // از setTimeout استفاده می‌کنیم تا مطمئن شویم state آپدیت شده
      setTimeout(() => syncDatesToBackend(updated), 0);
      
      return updated;
    });
  }, [syncDatesToBackend]);

  const toPersianDate = (gregorianDate) => {
    try {
      return new DateObject({
        date: gregorianDate,
        calendar: persian,
        locale: persian_fa
      }).format("YYYY/MM/DD");
    } catch (e) {
      return gregorianDate;
    }
  };

  /* ---------- حذف تاریخ ---------- */
  const removeDisabledDate = useCallback((date) => {
    console.log("🗑️ Removing date:", date);
    
    setDisabledDates(prev => {
      const updated = prev.filter(d => d !== date);
      setTimeout(() => syncDatesToBackend(updated), 0);
      return updated;
    });
  }, [syncDatesToBackend]);

  /* ---------- آپدیت تنظیمات ---------- */
  const updateSettings = useCallback((type, field, value) => {
    const updated = {
      ...deliverySettings,
      [type]: { ...deliverySettings[type], [field]: value }
    };
    setDeliverySettings(updated);
    syncSettingsToBackend(updated);
  }, [deliverySettings, syncSettingsToBackend]);

  const getProgress = (current, limit) => {
    if (limit === 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
  };

  /* ---------- رندرها ---------- */
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw size={18} />
          بارگذاری مجدد
        </button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="w-full p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
        <p className="text-yellow-800 dark:text-yellow-200 mb-4">
          هیچ تمپلیت تحویلی یافت نشد. لطفاً ابتدا در پنل مدیریت جنگو یک تمپلیت بسازید.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6" dir="rtl">
      {saving && (
        <div className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال ذخیره...
        </div>
      )}

      {/* تقویم */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl shrink-0">
              <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 truncate">
                مدیریت روزهای غیرفعال
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                انتخاب تاریخ تعطیل از تقویم شمسی (به صورت خودکار به میلادی ذخیره می‌شود)
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              انتخاب تاریخ
            </label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={null}
              onChange={addDisabledDate}
              minDate={todayPersian}
              disabled={saving}
              placeholder="کلیک کنید و تاریخ را انتخاب کنید..."
              format="YYYY/MM/DD"
              inputClass="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              containerClassName="w-full block"
              calendarPosition="bottom-center"
            />
          </div>

          {disabledDates.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {disabledDates.map(date => (
                <span 
                  key={date} 
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800"
                >
                  <Calendar size={14} className="shrink-0" />
                  <span className="font-mono">{toPersianDate(date)}</span>
                  <button 
                    onClick={() => removeDisabledDate(date)} 
                    disabled={saving}
                    className="mr-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5 disabled:opacity-50 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-300">
              <CheckCircle2 size={20} className="text-green-500" />
              <span>هیچ تاریخ غیرفعالی تعریف نشده</span>
            </div>
          )}
        </div>
      </section>

      {/* تنظیمات تحویل */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                تنظیمات هزینه و ظرفیت
              </h3>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { type: 'urgent24h', title: '۲۴ ساعته', color: 'orange', desc: 'تحویل امروز تا فردا' },
              { type: 'urgent48h', title: '۴۸ ساعته', color: 'blue', desc: 'تحویل ۲ روزه' }
            ].map(({ type, title, color, desc }) => {
              const setting = deliverySettings[type];
              const count = orderCounts[type];
              const limit = setting.limit;
              const progress = getProgress(count, limit);
              const isFull = count >= limit;
              const isEnabled = setting.enabled;
              
              return (
                <div 
                  key={type}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    isEnabled 
                      ? `bg-${color}-50 dark:bg-${color}-900/10 border-${color}-200 dark:border-${color}-800` 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isEnabled ? `bg-${color}-500 animate-pulse` : 'bg-gray-400'}`} />
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200">{title}</h4>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => updateSettings(type, 'enabled', e.target.checked)}
                        disabled={saving}
                        className="sr-only peer"
                      />
                      <div className={`
                        w-[51px] h-[31px] bg-gray-300 dark:bg-gray-600 
                        peer-checked:bg-${color}-500
                        rounded-full peer-focus:ring-2 peer-focus:ring-${color}-500/30
                        transition-colors duration-300
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:rounded-full after:h-[27px] after:w-[27px]
                        after:shadow-md after:transition-transform after:duration-300
                        peer-checked:after:translate-x-[20px]
                        rtl:peer-checked:after:-translate-x-[20px]
                      `}></div>
                    </label>
                  </div>

                  {isEnabled && (
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                        <label className="block text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">
                          نوع اضافه‌بها
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={setting.priceType}
                            onChange={(e) => updateSettings(type, 'priceType', e.target.value)}
                            disabled={saving}
                            className="w-full sm:w-36 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm disabled:opacity-50"
                          >
                            <option value="fixed">مبلغ ثابت (تومان)</option>
                            <option value="percentage">درصدی (%)</option>
                          </select>
                          
                          <input
                            type="number"
                            min="0"
                            value={setting.priceType === 'percentage' ? setting.priceValue : setting.fixedValue}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              if (setting.priceType === 'percentage') {
                                updateSettings(type, 'priceValue', Math.min(100, Math.max(0, val)));
                              } else {
                                updateSettings(type, 'fixedValue', val);
                              }
                            }}
                            disabled={saving}
                            placeholder={setting.priceType === 'percentage' ? "مثلاً: 20" : "مثلاً: 100000"}
                            className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                        <label className="block text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">
                          سقف روزانه سفارش
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={limit}
                          onChange={(e) => updateSettings(type, 'limit', Math.max(1, parseInt(e.target.value) || 1))}
                          disabled={saving}
                          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 disabled:opacity-50"
                        />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              مصرف: <span className="font-bold">{count}</span> از {limit}
                            </span>
                            <span className={`font-bold ${isFull ? 'text-red-600' : `text-${color}-600`}`}>
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div 
                              className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : `bg-${color}-500`}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {isFull && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
                            <AlertCircle size={14} />
                            <span>ظرفیت تکمیل است</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

TimeOrders.propTypes = {
  orders: PropTypes.array,
  onSettingsChange: PropTypes.func
};
