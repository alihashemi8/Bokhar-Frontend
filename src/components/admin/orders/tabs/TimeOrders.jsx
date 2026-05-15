import { useState, useMemo, useCallback, useEffect } from "react";
import { Calendar, X, Clock, AlertCircle, Settings, CheckCircle2, Loader2 } from "lucide-react";
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
  
  const [deliverySettings, setDeliverySettings] = useState({
    urgent24h: {
      enabled: true,
      priceType: "percentage",
      priceValue: 20,
      fixedValue: 50000,
      limit: 10,
    },
    urgent48h: {
      enabled: true,
      priceType: "percentage",
      priceValue: 10,
      fixedValue: 25000,
      limit: 20,
    }
  });

  // ✅ لود اولیه از بک‌اند
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feeRes, templateRes] = await Promise.all([
          capacityApi.getRushFeeSettings(),
          capacityApi.getDeliveryTemplates()
        ]);

        const feeData = feeRes.data;
        const templatesData = templateRes.data;
        setTemplates(templatesData);

        if (templatesData.length > 0) {
          const template = templatesData[0];
          
          setDeliverySettings({
            urgent24h: {
              enabled: true,
              priceType: feeData.percent_tomorrow_fee > 0 ? "percentage" : "fixed",
              priceValue: feeData.percent_tomorrow_fee || 0,
              fixedValue: feeData.tomorrow_fee || 50000,
              limit: template.urgent_24_capacity || 10,
            },
            urgent48h: {
              enabled: true,
              priceType: feeData.percent_day_after_tomorrow_fee > 0 ? "percentage" : "fixed",
              priceValue: feeData.percent_day_after_tomorrow_fee || 0,
              fixedValue: feeData.day_after_tomorrow_fee || 25000,
              limit: template.urgent_48_capacity || 20,
            }
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
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

  const notifyParent = useCallback((newSettings) => {
    onSettingsChange?.({
      disabledDates,
      deliverySettings: newSettings ?? deliverySettings
    });
  }, [onSettingsChange, disabledDates, deliverySettings]);

  const addDisabledDate = (date) => {
    if (!date || !date.isValid) return;
    const gregorianDate = date.convert("gregorian").format("YYYY-MM-DD");
    
    if (!disabledDates.includes(gregorianDate)) {
      const updated = [...disabledDates, gregorianDate].sort();
      setDisabledDates(updated);
    }
  };

  const toPersianDate = (gregorianDate) => {
    return new DateObject({
      date: gregorianDate,
      calendar: persian,
      locale: persian_fa
    }).format("YYYY/MM/DD");
  };

  const removeDisabledDate = useCallback((date) => {
    const updated = disabledDates.filter(d => d !== date);
    setDisabledDates(updated);
  }, [disabledDates]);

  // ✅ ذخیره در بک‌اند
  const syncToBackend = useCallback(async (newSettings) => {
    if (templates.length === 0) return;
    
    try {
      setSaving(true);
      const template = templates[0];
      
      await capacityApi.updateDeliveryTemplate(template.id, {
        urgent_24_capacity: newSettings.urgent24h.limit,
        urgent_48_capacity: newSettings.urgent48h.limit,
      });

      const feeData = {
        is_active: newSettings.urgent24h.enabled || newSettings.urgent48h.enabled,
        tomorrow_fee: newSettings.urgent24h.priceType === 'fixed' ? newSettings.urgent24h.fixedValue : 0,
        percent_tomorrow_fee: newSettings.urgent24h.priceType === 'percentage' ? newSettings.urgent24h.priceValue : 0,
        day_after_tomorrow_fee: newSettings.urgent48h.priceType === 'fixed' ? newSettings.urgent48h.fixedValue : 0,
        percent_day_after_tomorrow_fee: newSettings.urgent48h.priceType === 'percentage' ? newSettings.urgent48h.priceValue : 0,
      };
      
      await capacityApi.updateRushFeeSettings(feeData);
      notifyParent(newSettings);
      
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  }, [templates, notifyParent]);

  const updateSettings = useCallback((type, field, value) => {
    const updated = {
      ...deliverySettings,
      [type]: { ...deliverySettings[type], [field]: value }
    };
    setDeliverySettings(updated);
    syncToBackend(updated);
  }, [deliverySettings, syncToBackend]);

  const getProgress = (current, limit) => {
    if (limit === 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6" dir="rtl">
      {/* indicator ذخیره */}
      {saving && (
        <div className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm animate-fade-in">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال ذخیره...
        </div>
      )}

      {/* ✅ روزهای غیرفعال */}
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
                انتخاب تاریخ تعطیل از تقویم شمسی
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
              className="rmdp-mobile"
              animations={[
                { name: "opacity", duration: 300 },
                { name: "translateY", duration: 300, from: 20, to: 0 }
              ]}
            />
          </div>

          {disabledDates.length > 0 ? (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {disabledDates.map(date => (
                <span 
                  key={date} 
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 transition-all hover:shadow-md animate-fade-in"
                >
                  <Calendar size={14} className="shrink-0" />
                  <span className="font-mono">{toPersianDate(date)}</span>
                  <button 
                    onClick={() => removeDisabledDate(date)} 
                    disabled={saving}
                    className="mr-1 p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition shrink-0 touch-manipulation disabled:opacity-50"
                    aria-label="حذف تاریخ"
                    style={{ minWidth: '28px', minHeight: '28px' }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
              <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              <span>هیچ تاریخ غیرفعالی تعریف نشده است</span>
            </div>
          )}
        </div>
      </section>

      {/* ✅ تنظیمات تحویل فوری */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl shrink-0">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                تنظیمات تحویل فوری
              </h3>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { type: 'urgent24h', title: '۲۴ ساعته', color: 'orange', desc: 'تحویل امروز' },
              { type: 'urgent48h', title: '۴۸ ساعته', color: 'blue', desc: 'تحویل فردا' }
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
                  className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                    isEnabled 
                      ? `bg-${color}-50 dark:bg-${color}-900/10 border-${color}-200 dark:border-${color}-800` 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${isEnabled ? `bg-${color}-500` : 'bg-gray-400'} ${type === 'urgent24h' && isEnabled ? 'animate-pulse' : ''}`} />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg truncate">
                          {title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => updateSettings(type, 'enabled', e.target.checked)}
                        disabled={saving}
                        className="sr-only peer remove-arrows"
                      />
                      <div className={`
                        w-[51px] h-[31px] 
                        bg-gray-300 
                        peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-${color}-500/30
                        rounded-full 
                        dark:bg-gray-600 
                        peer-checked:bg-${color}-500
                        peer-disabled:opacity-50
                        transition-colors duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)]
                        after:content-[''] 
                        after:absolute 
                        after:top-[2px] 
                        after:start-[2px]
                        after:bg-white 
                        after:rounded-full 
                        after:h-[27px] 
                        after:w-[27px]
                        after:shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)]
                        after:transition-transform 
                        after:duration-300 
                        after:ease-[cubic-bezier(0.34,1.56,0.64,1)]
                        peer-checked:after:translate-x-[20px]
                        rtl:peer-checked:after:-translate-x-[20px]
                        peer-active:after:scale-95
                      `}></div>
                    </label>
                  </div>

                  {isEnabled && (
                    <div className="space-y-4 mt-4">
                      <div className="bg-white dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                        <label className="block text-xs font-bold mb-2 text-gray-700 dark:text-gray-300">
                          اضافه‌بها
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={setting.priceType}
                            onChange={(e) => updateSettings(type, 'priceType', e.target.value)}
                            disabled={saving}
                            className="w-full sm:w-32 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 shrink-0 disabled:opacity-50"
                          >
                            <option value="percentage">درصدی (%)</option>
                            <option value="fixed">مبلغ ثابت (تومان)</option>
                          </select>
                          <input
                            type="number"
                            min="0"
                            value={setting.priceType === 'percentage' ? setting.priceValue : setting.fixedValue}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (setting.priceType === 'percentage') {
                                updateSettings(type, 'priceValue', val);
                              } else {
                                updateSettings(type, 'fixedValue', val);
                              }
                            }}
                            disabled={saving}
                            className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            placeholder={setting.priceType === 'percentage' ? 'مثال: 20' : 'مثال: 50000'}
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
                          value={limit}
                          onChange={(e) => updateSettings(type, 'limit', Math.max(1, Number(e.target.value)))}
                          disabled={saving}
                          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 mb-3 disabled:opacity-50"
                        />
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              مصرف: <span className="font-bold text-gray-800 dark:text-gray-200">{count}</span> از {limit}
                            </span>
                            <span className={`font-bold ${isFull ? 'text-red-600' : `text-${color}-600`}`}>
                              {progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : `bg-${color}-500`}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {isFull && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                            <AlertCircle size={18} className="shrink-0" />
                            <span className="font-medium">ظرفیت تکمیل شده</span>
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
