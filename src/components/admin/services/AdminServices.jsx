import { useState, useContext } from "react";
import { FiPlus, FiTrash2, FiEdit, FiSearch } from "react-icons/fi";
import Sidebar from "../Sidebar";
import ServicesModal from "./ServicesModal";
import { ServicesContext } from "./ServicesContext";

export default function AdminServices() {
  const { categories, services, setCategories, setServices } = useContext(ServicesContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("services");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState("");
  const [search, setSearch] = useState("");

  // افزودن دسته‌بندی جدید
  const addCategory = () => {
    const c = newCat.trim();
    if (c && !categories.includes(c)) {
      setCategories([...categories, c]); // wrapper context هم state و هم localStorage رو آپدیت می‌کنه
      setNewCat("");
    }
  };

  // حذف دسته‌بندی و خدمات مرتبط
  const deleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
    setServices(services.filter(s => s.category !== cat));
  };

  // ذخیره/ویرایش خدمات
  const saveService = (data) => {
    const defaultData = {
      title: "بدون عنوان",
      basePrice: 0,
      features: [],
      material: "-",
      people: "-",
      status: "active",
      image: "/images/placeholder.png",
    };
    const serviceData = { ...defaultData, ...data };

    let newServices;
    if (editItem) {
      newServices = services.map(s => s.id === editItem.id ? { ...s, ...serviceData } : s);
    } else {
      newServices = [...services, { ...serviceData, id: Date.now() }];
    }

    setServices(newServices); // استفاده از wrapper context
    setEditItem(null);
    setModalOpen(false);
  };

  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  // فیلتر خدمات
  const filteredServices = services.filter(s =>
    (s.title?.toLowerCase().includes(search.toLowerCase()) || search === "" || s.category === search)
  );

  const activeServices = filteredServices.filter(s => s.status === "active");

  return (
    <div dir="rtl" className="flex min-h-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 p-4 sm:p-6 ${!isSidebarOpen ? "md:mr-64" : ""}`}>
        <div className="space-y-10">

          {/* دسته‌بندی */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">دسته‌بندی‌ها</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                placeholder="نام دسته جدید"
                className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-right text-gray-900 dark:text-white border dark:border-gray-600"
                onKeyDown={e => e.key === "Enter" && addCategory()}
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

          {/* کارت‌ها */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">خدمات</h2>

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

<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

  {/* کارت افزودن */}
  <div
    onClick={() => { setEditItem(null); setModalOpen(true); }}
    className="flex flex-col items-center justify-center rounded-2xl cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md hover:scale-105 transition-all duration-300 aspect-[3/4] p-4"
  >
    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-2">
      <FiPlus className="text-white text-3xl" />
    </div>
    <p className="font-semibold text-lg text-center">افزودن سرویس</p>
  </div>

{activeServices.map(srv => (
  <div key={srv.id} className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 shadow flex flex-col justify-between aspect-[3/4]">
    
    <div className="flex-1 flex flex-col justify-start">
      <img
        src={srv.image || "/images/placeholder.png"}
        className="w-full h-32 object-cover mb-3 rounded-xl"
      />
      <h3 className="font-bold text-center text-gray-900 dark:text-white">{srv.title || "بدون عنوان"}</h3>
      <p className="text-center text-sm mt-1 text-gray-700 dark:text-gray-300 line-clamp-2">
        دسته: {srv.category || "-"}
      </p>
      {/* نمایش جنس‌ها و قیمت‌ها */}
      {srv.materialPrices && Object.keys(srv.materialPrices).length > 0 && (
        <div className="text-center mt-1 text-sm text-gray-800 dark:text-gray-200">
          {Object.entries(srv.materialPrices).map(([mat, price]) => (
            <span key={mat} className="block">
              {mat}: {Number(price).toLocaleString()} تومان
            </span>
          ))}
        </div>
      )}

      {/* نمایش قیمت بر اساس نوع ابعاد */}
      {srv.sizeType === "singleDouble" && (
        <p className="text-center text-purple-600 dark:text-purple-400 font-semibold mt-1">
          تک نفره: {(srv.singlePrice ?? 0).toLocaleString()} تومان | دو نفره: {(srv.doublePrice ?? 0).toLocaleString()} تومان
        </p>
      )}
      {srv.sizeType === "meter" && (
        <p className="text-center text-purple-600 dark:text-purple-400 font-semibold mt-1">
          متراژ: {srv.meter?.width || 0}x{srv.meter?.height || 0} متر | هر متر: {(srv.pricePerMeter ?? 0).toLocaleString()} تومان
        </p>
      )}
    </div>

    <div className="flex justify-between mt-3">
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
