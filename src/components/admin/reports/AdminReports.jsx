import React, { useEffect, useState, useRef } from "react";
import RevenueChart from "./RevenueChart";
import KPICard from "./KPICard";
import TopServices from "./TopServices";
import Sidebar from "../Sidebar";

/**
 * SegmentedToggle: iOS-like segmented control
 */
function SegmentedToggle({ options, value, onChange }) {
  const idx = options.findIndex((o) => o.value === value);
  const segmentWidth = 100 / options.length;

  const wrapperRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(null);

  const startDrag = () => setDragging(true);

  const moveDrag = (clientX) => {
    if (!dragging || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    x = Math.max(0, Math.min(100, x));
    setDragX(x);
  };

  const endDrag = () => {
    if (!dragging || dragX == null) {
      setDragging(false);
      return;
    }
    const segment = Math.floor(dragX / segmentWidth);
    onChange(options[segment].value);
    setDragging(false);
    setDragX(null);
  };

  const left = dragX != null ? dragX - segmentWidth / 2 : idx * segmentWidth;

  return (
    <div
      ref={wrapperRef}
      className="relative inline-flex bg-white dark:bg-white/40 border border-sky-200 backdrop-blur-lg rounded-full p-0.5 select-none overflow-hidden shadow-md"
      onMouseDown={startDrag}
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={startDrag}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <div
        className="absolute top-0.5 bottom-0.5 border rounded-full shadow bg-white border-sky-200 dark:bg-purple-800 dark:border-indigo-300"
        style={{
          width: `${segmentWidth}%`,
          left: `calc(${left}% )`,
          transition: dragging ? "none" : "all 0.25s ease",
        }}
      />

      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 px-2 py-0.5 text-2xs font-medium transition ${
            value === opt.value
              ? "text-sky-600 dark:text-gray-800"
              : "text-gray-700 dark:text-gray-300"
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
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const todayMonthIndex = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState(persianMonths[todayMonthIndex]);
  const [viewType, setViewType] = useState("week");
  const [valueType, setValueType] = useState("revenue");
  const [summary, setSummary] = useState(null);
  const [series, setSeries] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [activeMenu, setActiveMenu] = useState("reports");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeWeek, setActiveWeek] = useState(0);

  const monthlyData = React.useMemo(() => {
    return persianMonths.reduce((acc, month) => {
      const days = Array.from({ length: 30 }).map((_, idx) => ({
        day: `روز ${idx + 1}`,
        revenue: Math.floor(Math.random() * 500000) + 50000,
        count: Math.floor(Math.random() * 10) + 1,
      }));

      const weeks = Array.from({ length: 5 }).map((_, wIdx) => {
        const weekDays = days.slice(wIdx * 7, wIdx * 7 + 7);
        return {
          week: `هفته ${wIdx + 1}`,
          revenue: weekDays.reduce((s, d) => s + d.revenue, 0),
          count: weekDays.reduce((s, d) => s + d.count, 0),
          days: weekDays,
        };
      });

      acc[month] = {
        summary: {
          total_revenue: days.reduce((s, d) => s + d.revenue, 0),
          orders_count: days.reduce((s, d) => s + d.count, 0),
        },
        series: weeks,
        topServices: [
          { id: 1, name: "شستشوی خشک کت و شلوار", count: 18, revenue: 1500000 },
          { id: 2, name: "شستشوی لباس کودک", count: 14, revenue: 1200000 },
          { id: 3, name: "رنگ و لکه‌گیری", count: 9, revenue: 800000 },
        ],
      };
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const data = monthlyData[activeMonth];
    if (data) {
      setSummary(data.summary);
      setSeries(data.series);
      setTopServices(data.topServices);
      setActiveWeek(0);
    }
  }, [activeMonth, monthlyData]);

  const dataForChart = React.useMemo(() => {
    if (viewType === "week") {
      return series.map((w) => ({
        week: w.week,
        value: valueType === "revenue" ? w.revenue : w.count,
      }));
    }
    const w = series[activeWeek];
    return w
      ? w.days.map((d) => ({
          day: d.day,
          value: valueType === "revenue" ? d.revenue : d.count,
        }))
      : [];
  }, [viewType, valueType, series, activeWeek]);

  const fmt = (n) => (n == null ? "-" : n.toLocaleString("fa-IR"));

  return (
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        <h1 className="text-2xl font-bold text-center md:text-start text-gray-800 dark:text-gray-100 mb-8">
          گزارش‌های مدیریتی
        </h1>

        {/* انتخاب ماه */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {persianMonths.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-4 py-2 my-3 mx-1 rounded-full font-medium shrink-0 transition ${
                activeMonth === m
                  ? "bg-gradient-to-r from-sky-100 to-sky-200 dark:from-purple-700 dark:to-purple-800 border border-gray-300 dark:border-indigo-600 dark:text-white/90 shadow-md shadow-indigo-300 text-gray-800 scale-105"
                  : "bg-white/70 dark:bg-white/80 hover:bg-white dark:hover:bg-white/95 border border-gray-200 dark:border-sky-200 shadow-md text-gray-800 "
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <KPICard title="فروش کل" value={fmt(summary?.total_revenue)} />
          <KPICard title="تعداد سفارش‌ها" value={fmt(summary?.orders_count)} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-4 rounded-3xl bg-white/30 dark:bg-white/50 backdrop-blur-lg border border-sky-200/50 shadow-xl">
  {/* عنوان */}
  <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-900 w-full sm:w-auto text-center sm:text-start">
    نمودار فروش ({activeMonth})
  </h3>
{/* Header + Controls */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 w-full">


  {/* دکمه‌ها و Toggles */}
  <div className="flex flex-col sm:flex-row sm:gap-2 w-full sm:w-auto">

    {/* ردیف دکمه‌ها */}
    <div className="flex gap-2 justify-center sm:justify-start mb-2 sm:mb-0">
      <button
        onClick={() => setActiveWeek((w) => Math.max(0, w - 1))}
        disabled={viewType === "week" || activeWeek === 0}
className="
h-10
px-4
text-xs
whitespace-nowrap
rounded-2xl
font-medium
bg-gradient-to-r from-sky-100 to-sky-200 
dark:from-purple-700 dark:to-purple-800
shadow
text-gray-800 dark:text-white
transition
disabled:opacity-40 disabled:cursor-not-allowed

sm:h-9 sm:px-3.5 sm:text-sm
lg:h-10 lg:px-4
"

      >
        هفته قبل
      </button>

      <button
        onClick={() =>
          setActiveWeek((w) => Math.min(series.length - 1, w + 1))
        }
        disabled={viewType === "week" || activeWeek === series.length - 1}
className="
h-10
px-4
text-xs
whitespace-nowrap
rounded-2xl
font-medium
bg-gradient-to-r from-sky-100 to-sky-200 
dark:from-purple-700 dark:to-purple-800
shadow
text-gray-800 dark:text-white
transition
disabled:opacity-40 disabled:cursor-not-allowed

sm:h-9 sm:px-3.5 sm:text-sm
lg:h-10 lg:px-4
"

      >
        هفته بعد
      </button>
    </div>

    {/* ردیف Toggles */}
    <div className="flex gap-2 justify-center sm:justify-start">
      <SegmentedToggle
        options={[
          { label: "هفته‌ای", value: "week" },
          { label: "روزانه", value: "day" },
        ]}
        value={viewType}
        onChange={setViewType}
      />

      <SegmentedToggle
        options={[
          { label: "قیمت", value: "revenue" },
          { label: "تعداد", value: "count" },
        ]}
        value={valueType}
        onChange={setValueType}
      />
    </div>

  </div>
</div>
            <RevenueChart
              data={dataForChart.map((i) =>
                viewType === "week"
                  ? { week: i.week, revenue: i.value }
                  : { day: i.day, revenue: i.value }
              )}
              xKey={viewType === "week" ? "week" : "day"}
            />
          </div>

          <div className="p-4 rounded-3xl bg-white/30 dark:bg-white/50 backdrop-blur-lg border border-sky-200/50 shadow-xl">
            <h3 className="font-semibold mb-4 text-gray-800 dark:text-gray-900">
              سرویس‌های پرفروش
            </h3>
            <TopServices list={topServices} />
          </div>
        </div>
      </main>
    </div>
  );
}
