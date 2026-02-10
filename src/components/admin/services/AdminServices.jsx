import { useState, useContext } from "react";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import Sidebar from "../Sidebar";
import ServicesModal from "./ServicesModal";
import { ServicesContext } from "./ServicesContext";
import Search from "../../Search";

export default function AdminServices() {
  const { categories, services, setCategories, setServices } =
    useContext(ServicesContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("services");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState("");
  const [search, setSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);

  const addCategory = () => {
    const c = newCat.trim();
    if (c && !categories.includes(c)) {
      setCategories([...categories, c]);
      setNewCat("");
    }
  };

  const deleteCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
    setServices(services.filter((s) => s.category !== cat));
  };

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

    setServices((prev) =>
      editItem
        ? prev.map((s) => (s.id === editItem.id ? { ...s, ...serviceData } : s))
        : [...prev, { ...serviceData, id: Date.now() }],
    );

    setEditItem(null);
    setModalOpen(false);
  };

  const deleteService = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const filteredServices = services.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const activeServices = filteredServices.filter((s) => s.status === "active");

  return (
    <div dir="rtl" className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        <h1 className="text-2xl text-center md:text-start font-extrabold mb-6 md:mb-8 text-gray-900 dark:text-gray-100 tracking-wide">
          خدمات
        </h1>{" "}
        <div className="space-y-10 max-w-full">
          {/* دسته‌بندی‌ها */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              دسته‌بندی‌ها
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="نام دسته جدید"
                className="flex-1 min-w-0 p-3 h-12 bg-white border-sky-300/50
                           rounded-xl shadow-lg dark:bg-gray-700 border"
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <button
                onClick={addCategory}
                className="px-4 h-12 rounded-xl bg-gradient-to-r
                           from-sky-50 via-sky-100 to-sky-200
                           shadow-indigo-300 text-gray-800 shadow-md
                           flex items-center gap-2 shrink-0"
              >
                <FiPlus /> افزودن
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {visibleCategories.map((c) => (
                <div
                  key={c}
                  className="truncate px-4 py-2 bg-gradient-to-r
                             from-sky-50 via-sky-100 to-sky-200
                             shadow-indigo-300 text-gray-800 shadow-md
                             rounded-xl flex items-center gap-3
                             dark:text-white"
                >
                  <span className="truncate">{c}</span>
                  <button onClick={() => deleteCategory(c)}>
                    <FiTrash2 className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* خدمات */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow">
            <div className="mb-6">
              <Search
                value={search}
                onChange={setSearch}
                items={[]}
                placeholder="جستجو بر اساس عنوان سرویس..."
              />
            </div>

            {/* گرید نهایی بدون تداخل */}
            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                gap-6
              "
            >
              {/* افزودن سرویس */}
              <div
                onClick={() => {
                  setEditItem(null);
                  setModalOpen(true);
                }}
                className="
                  flex flex-col items-center justify-center
                  rounded-2xl cursor-pointer
                  bg-gradient-to-r from-sky-50 via-sky-100 to-sky-200
                  shadow-md hover:scale-105 transition-all
                  p-4
                  min-h-[220px]
                "
              >
                <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center mb-2">
                  <FiPlus className="text-3xl" />
                </div>
                <p className="font-semibold text-sm md:text-md lg:text-lg">
                  افزودن سرویس
                </p>
              </div>

              {/* کارت‌های سرویس */}
              {activeServices.map((srv) => (
                <div
                  key={srv.id}
                  className="
                    bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 shadow
                    flex flex-col justify-between
                    min-h-[220px]
                  "
                >
                  <div>
                    <div className="w-full aspect-[4/3] mb-3">
                      <img
                        src={srv.image || "/images/placeholder.png"}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    <h3 className="font-bold text-center truncate text-gray-900 dark:text-white">
                      {srv.title || "بدون عنوان"}
                    </h3>

                    <p className="text-center text-sm mt-1 text-gray-700 dark:text-gray-300 truncate">
                      دسته: {srv.category || "-"}
                    </p>
                  </div>

                  <div className="flex justify-between mt-3">
                    <button
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => {
                        setEditItem(srv);
                        setModalOpen(true);
                      }}
                    >
                      <FiEdit />
                    </button>

                    <button
                      className="text-red-600 dark:text-red-400"
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
              isOpen={modalOpen}
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
