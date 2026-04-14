// AdminServices.jsx
import { useState, useContext } from "react";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import Sidebar from "../Sidebar";
import ServicesModal from "./ServicesModal";
import { ServicesContext } from "./ServicesContext";
import Search from "../../Search";
import { api } from "./servicesApi";

function ConfirmToast({ message, onConfirm, onCancel }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 flex items-end sm:items-start justify-center sm:pt-6 z-[9999] px-4 pb-6 sm:pb-0 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-full max-w-sm pointer-events-auto animate-slide-up">
        <p className="text-gray-800 font-medium text-center mb-4">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition font-medium"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition font-medium"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const { categories, services, setCategories, setServices, refreshData } =
    useContext(ServicesContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("services");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState("");
  const [search, setSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState({ message: "", onConfirm: null });
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const showConfirm = (message, onConfirm) => {
    setConfirm({ message, onConfirm });
  };

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 6);

  const addCategory = async () => {
    const c = newCat.trim();
    if (c && !categories.includes(c)) {
      try {
        await api.createCategory(c);
        await refreshData();
        setNewCat("");
        showToast("دسته‌بندی با موفقیت اضافه شد");
      } catch (err) {
        showToast("خطا در ایجاد دسته‌بندی: " + err.message, "error");
      }
    }
  };

  const deleteCategory = (cat) => {
    showConfirm(`آیا از حذف "${cat}" اطمینان دارید؟`, async () => {
      setConfirm({ message: "", onConfirm: null });
      try {
        const cats = await api.getCategories();
        const catObj = cats.find((c) => c.name === cat);
        if (catObj) {
          await api.deleteCategory(catObj.id);
        }
        await refreshData();
        showToast("دسته‌بندی حذف شد");
      } catch (err) {
        showToast("خطا در حذف دسته‌بندی: " + err.message, "error");
      }
    });
  };

  const saveService = async (data) => {
    setIsLoading(true);
    try {
      const cats = await api.getCategories();
      const catObj = cats.find((c) => c.name === data.category);
      const categoryId = catObj ? catObj.id : null;

      const apiData = {
        title: data.title,
        category: categoryId,
        status: "active",
        pricing: data.pricing,
      };

      if (editItem) {
        await api.updateProduct(editItem.id, apiData);
      } else {
        await api.createProduct(apiData);
      }

      await refreshData();
      setEditItem(null);
      setModalOpen(false);
      showToast(editItem ? "سرویس ویرایش شد" : "سرویس جدید اضافه شد");
    } catch (err) {
      showToast("خطا در ذخیره‌سازی: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openEdit = async (id) => {
    setIsLoading(true);
    try {
      const product = await api.getProduct(id);
      const modalData = {
        ...product,
        category: product.category?.name || product.category,
        pricing: product.pricing || {},
      };
      setEditItem(modalData);
      setModalOpen(true);
    } catch (err) {
      showToast("خطا در دریافت اطلاعات سرویس", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteService = (id) => {
    showConfirm("آیا از حذف این سرویس اطمینان دارید؟", async () => {
      setConfirm({ message: "", onConfirm: null });
      try {
        await api.deleteProduct(id);
        await refreshData();
        showToast("سرویس حذف شد");
      } catch (err) {
        showToast("خطا در حذف سرویس: " + err.message, "error");
      }
    });
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

      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-white shadow-xl z-[9999] transition-all ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmToast
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm({ message: "", onConfirm: null })}
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:mr-64">
        <h1 className="text-2xl font-bold text-center md:text-start text-gray-800 mb-8">
          خدمات
        </h1>

        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl">در حال بارگذاری...</div>
          </div>
        )}

        <div className="space-y-10 max-w-full">
          {/* دسته‌بندی‌ها */}
          <div className="p-6 rounded-3xl bg-white backdrop-blur-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              دسته‌بندی‌ها
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="نام دسته جدید"
                className="flex-1 p-3 h-12 rounded-xl border bg-white shadow-lg text-slate-800"
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <button
                onClick={addCategory}
                disabled={isLoading}
                className="px-4 h-12 rounded-xl bg-gradient-to-r from-sky-100 to-sky-200 border border-gray-300 shadow-lg text-gray-800 flex items-center gap-2 shrink-0 hover:scale-105 transition disabled:opacity-50"
              >
                <FiPlus /> افزودن
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {visibleCategories.map((c) => (
                <div
                  key={c}
                  className="truncate px-4 py-2 rounded-xl border bg-gradient-to-r from-sky-100 to-sky-200 shadow-lg text-gray-800 flex items-center gap-3"
                >
                  <span className="truncate">{c}</span>
                  <button
                    onClick={() => deleteCategory(c)}
                    disabled={isLoading}
                  >
                    <FiTrash2 className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>

            {categories.length > 6 && (
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                {showAllCategories ? "نمایش کمتر" : "نمایش همه"}
              </button>
            )}
          </div>

          {/* خدمات */}
          <div className="p-6 rounded-3xl bg-white backdrop-blur-lg shadow-xl">
            <div className="mb-6">
              <Search
                value={search}
                onChange={setSearch}
                items={[]}
                placeholder="جستجو بر اساس عنوان سرویس..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div
                onClick={() => {
                  setEditItem(null);
                  setModalOpen(true);
                }}
                className="flex flex-col items-center justify-center rounded-2xl cursor-pointer bg-gradient-to-r from-sky-100 to-sky-200 shadow-lg text-gray-800 hover:scale-105 transition-all p-4 min-h-[220px]"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-2">
                  <FiPlus className="text-3xl" />
                </div>
                <p className="font-semibold text-sm md:text-md lg:text-lg">
                  افزودن سرویس
                </p>
              </div>

              {activeServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl bg-white shadow-xl flex flex-col justify-between min-h-[220px] hover:scale-[1.03] transition"
                >
                  <div>
                    <div className="w-full aspect-[4/3] mb-3">
                      <img
                        src={srv.image || "/images/placeholder.png"}
                        alt={srv.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <h3 className="font-bold text-center truncate text-slate-800">
                      {srv.title || "بدون عنوان"}
                    </h3>
                    <p className="text-center text-sm mt-1 text-slate-600 truncate">
                      دسته: {srv.category?.name || srv.category || "-"}
                    </p>
                  </div>

                  <div className="flex justify-between mt-3">
                    <button
                      className="text-blue-600"
                      onClick={() => openEdit(srv.id)}
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
              isOpen={modalOpen}
              categories={categories}
              editItem={editItem}
              onClose={() => setModalOpen(false)}
              onSave={saveService}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
