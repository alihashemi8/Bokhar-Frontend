import React, { useEffect, useState } from "react";
import RevenueChart from "./RevenueChart";
import KPICard from "./KPICard";
import TopServices from "./TopServices";
import Sidebar from "../Sidebar";

/**
 * SegmentedToggle: iOS-like segmented control
 * props:
 *  - options: [{ label, value }]
 *  - value: current value
 *  - onChange: fn(newValue)
 */
function SegmentedToggle({ options, value, onChange }) {
  const idx = options.findIndex(o => o.value === value);
  const widthPercent = 100 / options.length;

  return (
    <div className="relative inline-flex bg-gray-200 dark:bg-gray-700 rounded-full p-1">
      <div
        className="absolute top-1 bottom-1 bg-white dark:bg-gray-900 rounded-full shadow transition-all duration-300"
        style={{
          width: `${widthPercent}%`,
          left: `${idx * widthPercent}%`,
        }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 px-4 py-1 text-sm font-medium text-center transition ${
            value === opt.value ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
          }`}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function AdminReports() {
  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر",
    "مرداد", "شهریور", "مهر", "آبان",
    "آذر", "دی", "بهمن", "اسفند"
  ];

  const todayMonthIndex = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState(persianMonths[todayMonthIndex]);
  const [viewType, setViewType] = useState("week"); // "week" | "day"
  const [valueType, setValueType] = useState("revenue"); // "revenue" | "count"
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]); // weeks with days inside
  const [topServices, setTopServices] = useState([]);
  const [activeMenu, setActiveMenu] = useState("reports");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // active week index for day-view navigation (0..weeks.length-1)
  const [activeWeek, setActiveWeek] = useState(0);

  // ساخت داده‌ی ساختگی: 30 روز در ماه، سپس تقسیم به هفته‌ها (تا 5 هفته)
  const monthlyData = React.useMemo(() => {
    return persianMonths.reduce((acc, month) => {
      const days = Array.from({ length: 30 }).map((_, idx) => ({
        day: `روز ${idx + 1}`,
        revenue: Math.floor(Math.random() * 500000) + 50000,
        count: Math.floor(Math.random() * 10) + 1,
      }));

      const weeks = Array.from({ length: 5 }).map((_, wIdx) => {
        const start = wIdx * 7;
        const end = Math.min(start + 7, days.length); // مهم: جلوگیری از overflow
        const weekDays = days.slice(start, end);
        return {
          week: `هفته ${wIdx + 1}`,
          revenue: weekDays.reduce((sum, d) => sum + d.revenue, 0),
          count: weekDays.reduce((sum, d) => sum + d.count, 0),
          days: weekDays,
        };
      });

      acc[month] = {
        summary: {
          total_revenue: days.reduce((sum, d) => sum + d.revenue, 0),
          orders_count: days.reduce((sum, d) => sum + d.count, 0),
          low_inventory_alerts: ["پودر لباسشویی", "مایع نرم‌کننده"],
        },
        series: weeks,
        topServices: [
          { id: 1, name: "شستشوی خشک کت و شلوار", count: Math.floor(Math.random() * 20) + 5, revenue: 1500000 },
          { id: 2, name: "شستشوی لباس کودک", count: Math.floor(Math.random() * 20) + 5, revenue: 1200000 },
          { id: 3, name: "رنگ و لکه‌گیری", count: Math.floor(Math.random() * 15) + 3, revenue: 800000 },
          { id: 4, name: "شستشوی پرده", count: Math.floor(Math.random() * 10) + 1, revenue: 500000 },
          { id: 5, name: "لباس شب", count: Math.floor(Math.random() * 8) + 1, revenue: 300000 },
          { id: 6, name: "شستشوی رومبلی", count: Math.floor(Math.random() * 5) + 1, revenue: 200000 },
        ],
      };
      return acc;
    }, {});
  }, [/* static */]);

  // وقتی ماه تغییر کرد، داده‌ها رو بارگذاری و activeWeek رو reset کن
  useEffect(() => {
    const data = monthlyData[activeMonth];
    if (data) {
      setSummary(data.summary);
      setSeries(data.series);
      setTopServices(data.topServices);
      setActiveWeek(0); // بازنشانی هفته به 0 وقتی ماه عوض شد
    }
  }, [activeMonth, monthlyData]);

  // وقتی series تغییر کرد (مثلاً ماه جدید)، مطمئن شو activeWeek معتبره
  useEffect(() => {
    if (series.length === 0) return;
    const maxWeek = Math.max(0, series.length - 1);
    if (activeWeek > maxWeek) setActiveWeek(maxWeek);
  }, [series, activeWeek]);

  // ساخت داده برای چارت بسته به viewType و valueType و activeWeek
  const dataForChart = React.useMemo(() => {
    if (viewType === "week") {
      return series.map(w => ({
        week: w.week,
        value: valueType === "revenue" ? w.revenue : w.count,
      }));
    } else {
      // day view -> فقط روزهای هفته‌ی فعال
      const w = series[activeWeek];
      if (!w) return [];
      return w.days.map(d => ({
        day: d.day,
        value: valueType === "revenue" ? d.revenue : d.count,
      }));
    }
  }, [viewType, valueType, series, activeWeek]);

  // xKey که به RevenueChart پاس داده میشه
  const xKey = viewType === "week" ? "week" : "day";

  // کمک‌تابع نمایش عدد با کاما (برای KPI)
  const fmt = (n) => {
    if (n == null) return "-";
    return n.toLocaleString("fa-IR");
  };

  // هندلرهای هفته قبل / بعد
  const goPrevWeek = () => setActiveWeek(prev => Math.max(prev - 1, 0));
  const goNextWeek = () => setActiveWeek(prev => Math.min(prev + 1, Math.max(0, series.length - 1)));

  return (
    <div dir="RTL" className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-1">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 ${!isSidebarOpen ? 'md:mr-64' : ''}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 text-gray-900 dark:text-gray-100 tracking-wide">
            گزارش‌های مدیریتی
          </h1>

          {/* انتخاب ماه (همیشه یک ردیف، اسکرول افقی روی موبایل) */}
          <div className="flex gap-2 flex-nowrap overflow-x-auto mb-4 py-2">
            {persianMonths.map(month => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold transition
                  ${activeMonth === month
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:shadow-md"
                  }`}
                type="button"
              >
                {month}
              </button>
            ))}
          </div>

          {/* KPI Cards: موبایل دو در یک ردیف */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <KPICard title="فروش کل" value={fmt(summary?.total_revenue)} />
            <KPICard title="تعداد سفارش‌ها" value={fmt(summary?.orders_count)} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg transition transform duration-300 hover:shadow-2xl">

              {/* عنوان + segmented controls + week nav */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-3">

                {/* عنوان نمودار — روی موبایل بالا، روی دسکتاپ سمت راست */}
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 order-1 md:order-2 whitespace-nowrap">
                  نمودار فروش ({activeMonth})
                </h3>

                {/* کنترل‌ها */}
                <div className="flex items-center gap-3 order-2 md:order-1">
                  {/* segmented هفته/روز */}
                  <SegmentedToggle
                    options={[{ label: "هفته‌ای", value: "week" }, { label: "روزانه", value: "day" }]}
                    value={viewType}
                    onChange={(v) => { setViewType(v); if (v === "day") setActiveWeek(0); }}
                  />

                  {/* segmented قیمت/تعداد */}
                  <SegmentedToggle
                    options={[{ label: "قیمت", value: "revenue" }, { label: "تعداد", value: "count" }]}
                    value={valueType}
                    onChange={setValueType}
                  />

                  {/* هفته قبل/بعد (فعال فقط در حالت روزانه) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goPrevWeek}
                      disabled={viewType !== "day" || activeWeek <= 0}
                      className={`px-3 py-1 rounded text-sm ${viewType === "day" && activeWeek > 0 ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      type="button"
                    >
                      قبلی
                    </button>
                    <button
                      onClick={goNextWeek}
                      disabled={viewType !== "day" || activeWeek >= Math.max(0, series.length - 1)}
                      className={`px-3 py-1 rounded text-sm ${viewType === "day" && activeWeek < Math.max(0, series.length - 1) ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      type="button"
                    >
                      بعدی
                    </button>
                  </div>
                </div>
              </div>

              {/* نمودار */}
              <RevenueChart
                data={dataForChart.map(item => {
                  // recharts keys: use the same y-key 'value' but line uses dataKey="value"
                  // RevenueChart expected earlier had dataKey 'revenue' — ensure compatibility:
                  // here we keep key 'value' and pass xKey; but RevenueChart uses dataKey="revenue".
                  // To avoid touching RevenueChart, map value -> revenue
                  if (viewType === "week") return { week: item.week, revenue: item.value };
                  return { day: item.day, revenue: item.value };
                })}
                xKey={xKey}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg transition transform duration-300 hover:shadow-2xl">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">سرویس‌های پرفروش</h3>
              <TopServices list={topServices} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
