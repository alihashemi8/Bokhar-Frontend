import { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiSearch } from "react-icons/fi";
import Sidebar from "../Sidebar";
import ServicesModal from "./ServicesModal";

/* ------------------- Initial Data ------------------- */
const initialCategories = ["بچگانه", "زنانه", "مردانه", "خانه و خواب", "سایر"];

const initialServices = [
  {
    id: 1,
    title: "عروسک",
    basePrice: 15000,
    category: "بچگانه",
    status: "active", // active | pending
    features: [],
    material: "",
    size: "",
    people: "یک نفره",
    image: "/images/doll.png",
  },
];

export default function AdminServices({
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  setActiveMenu,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [services, setServices] = useState(initialServices);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [newCat, setNewCat] = useState("");
  const [search, setSearch] = useState("");

  const addCategory = () => {
    const c = newCat.trim();
    if (c && !categories.includes(c)) {
      setCategories((prev) => [...prev, c]);
      setNewCat("");
    }
  };

  const deleteCategory = (cat) => {
    setCategories((p) => p.filter((c) => c !== cat));
    setServices((p) => p.filter((s) => s.category !== cat));
  };

  const saveService = (data) => {
    if (editItem) {
      setServices((prev) =>
        prev.map((s) => (s.id === editItem.id ? { ...s, ...data } : s))
      );
    } else {
      setServices((prev) => [...prev, { ...data, id: Date.now() }]);
    }

    setEditItem(null);
    setModalOpen(false);
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const pendingServices = services.filter((s) => s.status === "pending");
  const activeServices = services.filter((s) => s.status === "active");

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 p-4 sm:p-6 ${
          !isSidebarOpen ? "md:mr-64" : ""
        }`}
      >
        <div className="space-y-10">
          {/* دسته‌بندی‌ها */}
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">مدیریت دسته‌بندی‌ها</h2>

            <div className="flex gap-2 mb-4">
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="نام دسته جدید"
                className="flex-1 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-right"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white flex items-center gap-2"
              >
                <FiPlus /> افزودن
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <div
                  key={c}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center gap-3"
                >
                  <span>{c}</span>
                  <button onClick={() => deleteCategory(c)}>
                    <FiTrash2 className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* خدمات */}
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">مدیریت خدمات</h2>
            </div>

            {/* سرچ */}
            <div className="flex items-center bg-gray-200 dark:bg-gray-800 p-3 rounded-xl gap-3 mb-6">
              <FiSearch className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی خدمات..."
                className="bg-transparent flex-1 outline-none text-right"
              />
            </div>

            {/* Pending Section */}
{/* Pending Section */}
{pendingServices.length > 0 && (
  <div className="mb-6">
    <h3 className="font-bold text-lg mb-3">در انتظار تایید ادمین</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pendingServices.map((srv) => (
        <div
          key={srv.id}
          className="bg-yellow-100 dark:bg-yellow-700 rounded-2xl p-4 shadow"
        >
          <h4 className="font-bold text-center">{srv.title}</h4>
          <p className="text-center text-gray-600 text-sm">
            {Array.isArray(srv.features) ? srv.features.join(", ") : srv.features} |{" "}
            {Array.isArray(srv.material) ? srv.material.join(", ") : srv.material} |{" "}
            {srv.people} | {srv.size}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{/* Active Services */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {/* Add Card */}
  <div
    onClick={() => {
      setEditItem(null);
      setModalOpen(true);
    }}
    className="
      flex flex-col items-center justify-center
      h-40 rounded-2xl cursor-pointer 
      bg-gradient-to-br from-purple-500 to-indigo-500
      text-white shadow-md hover:scale-105
      transition-all duration-300
    "
  >
    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-2">
      <FiPlus className="text-white text-3xl" />
    </div>
    <p className="font-semibold text-lg">افزودن سرویس</p>
  </div>

  {activeServices.map((srv) => (
    <div
      key={srv.id}
      className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow hover:shadow-lg transition-all"
    >
      <img
        src={srv.image || "/images/placeholder.png"}
        className="w-full h-36 object-contain mb-3"
      />
      <h3 className="font-bold text-center">{srv.title}</h3>
      <p className="text-center text-purple-600 font-semibold mt-1">
        {srv.basePrice.toLocaleString()} تومان
      </p>
      <p className="text-center text-sm mt-1 text-gray-600">
        {Array.isArray(srv.features) ? srv.features.join(", ") : srv.features} |{" "}
        {Array.isArray(srv.material) ? srv.material.join(", ") : srv.material} |{" "}
        {srv.people} | {srv.size}
      </p>

      <div className="flex justify-between mt-4">
        <button
          className="text-blue-600"
          onClick={() => {
            setEditItem(srv);
            setModalOpen(true);
          }}
        >
          <FiEdit />
        </button>

        <button
          className="text-red-600"
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
