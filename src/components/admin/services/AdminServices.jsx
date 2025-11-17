import { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiSearch } from "react-icons/fi";
import Sidebar from "../Sidebar";
import ServicesModal from "./ServicesModal";

const initialCategories = ["بچگانه", "زنانه", "مردانه", "خانه و خواب", "سایر"];
const initialServices = [
  {
    id: 1,
    title: "عروسک",
    basePrice: 15000,
    category: "بچگانه",
    status: "active",
    features: [],
    material: "",
    size: "",
    people: "یک نفره",
    image: "/images/doll.png",
  },
];

export default function AdminServices() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("services");

  const [categories, setCategories] = useState(initialCategories);
  const [services, setServices] = useState(initialServices);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState("");
  const [search, setSearch] = useState("");

  const addCategory = () => {
    const c = newCat.trim();
    if (c && !categories.includes(c)) {
      setCategories(prev => [...prev, c]);
      setNewCat("");
    }
  };

  const deleteCategory = (cat) => {
    setCategories(p => p.filter(c => c !== cat));
    setServices(p => p.filter(s => s.category !== cat));
  };

  const saveService = (data) => {
    if (editItem) {
      setServices(prev => prev.map(s => s.id === editItem.id ? { ...s, ...data } : s));
    } else {
      setServices(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setEditItem(null);
    setModalOpen(false);
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const filteredServices = services.filter(s => {
    const matchTitle = s.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = search === "" || s.category === search;
    return matchTitle || matchCategory;
  });

  const activeServices = filteredServices.filter(s => s.status === "active");

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 p-4 sm:p-6 ${!isSidebarOpen ? "md:mr-64" : ""}`}>
        <div className="space-y-10">
          
          {/* مدیریت دسته‌بندی */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">مدیریت دسته‌بندی‌ها</h2>

            <div className="flex gap-2 mb-4">
              <input
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                placeholder="نام دسته جدید"
                className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-right text-gray-900 dark:text-white border dark:border-gray-600"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <FiPlus /> افزودن
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map(c => (
                <div key={c} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center gap-3 text-gray-900 dark:text-white">
                  <span>{c}</span>
                  <button onClick={() => deleteCategory(c)}>
                    <FiTrash2 className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* مدیریت خدمات */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">مدیریت خدمات</h2>

            {/* جستجو */}
            <div className="mb-6 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 text-xl" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="جستجو بر اساس عنوان..."
                className="w-full p-3 pr-4 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              />
            </div>

{/* فیلتر دسته بندی */}
<div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
  {categories.map((cat) => (
    <button
      key={cat}
      onClick={() => setSearch(cat)}
      className={
        `rounded-full border transition-all whitespace-nowrap font-medium
         px-6 py-3.5
         sm:px-5 sm:py-2.5
         md:px-5 md:py-2.5
         text-xs sm:text-sm md:text-base ` +
        (search === cat
          ? "bg-purple-600 text-white border-purple-600 shadow-md"
          : "bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600")
      }
    >
      {cat}
    </button>
  ))}

  <button
    onClick={() => setSearch("")}
    className={
      `rounded-full border transition-all whitespace-nowrap font-medium
       px-4 py-2
       sm:px-5 sm:py-2.5
       md:px-7 md:py-3
       text-xs sm:text-sm md:text-base ` +
      (search === ""
        ? "bg-purple-600 text-white border-purple-600 shadow-md"
        : "bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600")
    }
  >
    همه
  </button>
</div>



            {/* کارت‌های خدمات */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">

              {/* کارت افزودن */}
              <div
                onClick={() => { setEditItem(null); setModalOpen(true); }}
                className="flex flex-col items-center justify-center h-64 rounded-2xl cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-2">
                  <FiPlus className="text-white text-3xl" />
                </div>
                <p className="font-semibold text-lg">افزودن سرویس</p>
              </div>

              {/* کارت‌های سرویس */}
              {activeServices.map(srv => (
                <div
                  key={srv.id}
                  className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 shadow hover:shadow-xl transition-all h-64 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={srv.image || "/images/placeholder.png"}
                      className="w-full h-28 object-contain mb-3 rounded-xl"
                    />
                    <h3 className="font-bold text-center text-gray-900 dark:text-white">{srv.title}</h3>
                    <p className="text-center text-purple-600 dark:text-purple-400 font-semibold mt-1">
                      {srv.basePrice.toLocaleString()} تومان
                    </p>
                    <p className="text-center text-sm mt-1 text-gray-700 dark:text-gray-300 line-clamp-1">
                      {srv.features?.join(", ")} | {srv.material} | {srv.people}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      onClick={() => { setEditItem(srv); setModalOpen(true); }}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      onClick={() => deleteService(srv.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {modalOpen && (
            <ServicesModal
              categories={categories}
              editItem={editItem}
              onClose={() => setModalOpen(false)}
              onSave={saveService}
            />
          )}
        </div>
      </main>
    </div>
  );
}
