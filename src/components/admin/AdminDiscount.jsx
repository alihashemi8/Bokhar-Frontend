import { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import { FiSearch, FiPercent, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AdminDiscount() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("discounts");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // دسته‌بندی‌ها
  const categories = ["پیراهن", "شلوار", "مردانه", "زنانه", "بچگانه", "خانه و خواب", "کیف", "کفش", "لباس گرم", "ورزشی", "سایر"];

  // آیتم‌ها
  const items = [
    "تیشرت","پیراهن","شلوارک","تیشرت طرحدار","شومیز","پیراهن نگین دار","جلیقه","بلوز آستین بلند",
    "کت","زیر پیراهن","کراوات","پوشت","قبا","پاپیون","دستمال گردن","جلیقه کار","دشداشه عربی","عبا",
    "لباس کار سرهمی","شال","لباس زنانه","مانتو","پالتو","تاپ زنانه","مانتو پاییزی","چادر","دامن",
    "لباس شب","روسری","بلوز","اورال","سارافون","دامن بلند","پلیسه","لباس عروس","جوراب شلواری",
    "کت مجلسی","تور ساده لباس عروس","لباس خواب","عروسک","تشک","کالسکه","کریر","لباس بچگانه","گهواره",
    "کاپشن","صندلی بچه","لحاف","پتو","پتو مسافرتی","حوله","روفرشی","روبالشی","بالشت","حوله تن پوش",
    "کاور لحاف","کاور تشک","رو مبلی","روتختی","پرده زبرا","کوسن","رو.میزی","سفره","زیر سفره",
    "بالشت پشت گردنی","سرویس آشپزخانه","کفش","کتونی","کیف","کوله پشتی","بوت","کیف پول","کیف زنانه",
    "صندل","ساک","چمدان","چکمه","لباس بارانی","پلیور سوییشرت","هودی","دورس","اورکت","بافت","جکت",
    "شال گردن","کاپشن اسکی","ست ورزشی","شلوار اسکی","دستکش بوکس","دستکش دروازبانی","کیسه خواب",
    "مایو","پیشبند","روپوش","دستکش","جانماز","پرچم","کلاه","سجاده"
  ];

  // فیلتر بر اساس دسته و سرچ
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.toLowerCase().includes(search.toLowerCase());
      // اگر دسته انتخاب شده، فقط آیتم‌های مربوطه نشان داده شود
      if (!selectedCategory || selectedCategory === "سایر") return matchesSearch;
      // دسته‌بندی‌های پیش‌فرض
      const categoryMap = {
        "پیراهن": ["پیراهن","پیراهن نگین دار","شومیز"],
        "شلوار": ["شلوارک","شلوار اسکی"],
        "مردانه": ["تیشرت","جلیقه","بلوز آستین بلند","کت","کراوات","پوشت","قبا","پاپیون","دستمال گردن","جلیقه کار","دشداشه عربی","عبا","لباس کار سرهمی"],
        "زنانه": ["لباس زنانه","مانتو","پالتو","تاپ زنانه","مانتو پاییزی","چادر","دامن","لباس شب","روسری","بلوز","اورال","سارافون","دامن بلند","پلیسه","لباس عروس","جوراب شلواری","کت مجلسی","تور ساده لباس عروس","لباس خواب"],
        "بچگانه": ["عروسک","تشک","کالسکه","کریر","لباس بچگانه","گهواره","صندلی بچه"],
        "خانه و خواب": ["لحاف","پتو","پتو مسافرتی","حوله","روفرشی","روبالشی","بالشت","حوله تن پوش","کاور لحاف","کاور تشک","رو مبلی","روتختی","پرده زبرا","کوسن","رو.میزی","سفره","زیر سفره","بالشت پشت گردنی","سرویس آشپزخانه"],
        "کیف": ["کیف","کوله پشتی","کیف پول","کیف زنانه","ساک","چمدان"],
        "کفش": ["کفش","کتونی","بوت","صندل","چکمه"],
        "لباس گرم": ["پلیور سوییشرت","هودی","دورس","اورکت","بافت","جکت","شال گردن","کاپشن اسکی"],
        "ورزشی": ["ست ورزشی","شلوار اسکی","دستکش بوکس","دستکش دروازبانی","کیسه خواب","مایو"],
      };
      return categoryMap[selectedCategory]?.includes(item) && matchesSearch;
    });
  }, [search, selectedCategory]);

  const addDiscount = (item) => {
    if (!item || !discountValue) return;

    if (editingId) {
      setDiscounts((prev) =>
        prev.map((d) =>
          d.id === editingId ? { ...d, discount: discountValue } : d
        )
      );
      setEditingId(null);
    } else {
      const newDiscount = {
        id: Date.now(),
        type: "item",
        target: item,
        discount: discountValue,
      };
      setDiscounts([...discounts, newDiscount]);
    }

    setDiscountValue("");
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setDiscountValue(d.discount);
  };

  const deleteDiscount = (id) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
  };

  return (
    <div dir="RTL" className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-all">

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className={`flex-1 p-6 md:p-8 transition-all duration-300 ${!isSidebarOpen ? "md:mr-64" : ""}`}>
        
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          مدیریت تخفیف‌ها
        </h1>

        {/* باکس بزرگ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">

          {/* دسته‌بندی‌ها */}
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">دسته‌بندی</p>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full border font-medium ${!selectedCategory ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
            >
              همه
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border font-medium ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* سرچ */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-3 text-gray-400 dark:text-gray-500" size={20}/>
            <input
              type="text"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-12 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* کارت آیتم‌ها */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow flex flex-col justify-between hover:shadow-xl transition"
              >
                <p className="text-gray-900 dark:text-white font-semibold mb-3">{item}</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="% تخفیف"
                    value={editingId === item ? discountValue : ""}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-1/2 p-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                  />
                  <button
                    onClick={() => addDiscount(item)}
                    className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    ثبت
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* لیست تخفیف‌های ثبت شده */}
          {discounts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                تخفیف‌های فعال
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {discounts.map((d) => (
                  <div key={d.id} className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow flex justify-between items-center hover:shadow-xl transition">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{d.target}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{d.discount}%</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(d)} className="text-blue-500 hover:text-blue-600"><FiEdit2 size={18} /></button>
                      <button onClick={() => deleteDiscount(d.id)} className="text-red-500 hover:text-red-600"><FiTrash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
