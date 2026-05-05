import { useState, useEffect } from "react";
import {
  TicketPercent,
  Users,
  Plus,
  Search,
  Edit2,
  Percent,
  Banknote,
  User,
  CheckCircle2,
  XCircle,
  Calendar,
  Tag,
  ArrowRight
} from "lucide-react";
import CouponModal from "../modals/CouponModal";
import { fetchCoupons } from "../../../../api/discountsApi";
import { fetchCustomers } from "../../../../context/AuthContext";

export default function CouponTab() {
  const [coupons, setCoupons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ================= load data =================
  useEffect(() => {
    loadCoupons();
    loadCustomers();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await fetchCoupons();
      setCoupons(res);
    } catch (err) {
      console.error("Fetch coupons error:", err);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await fetchCustomers();
      setCustomers(res);
    } catch (err) {
      console.error("Fetch customers error:", err);
    }
  };

  // ================= handlers =================
  const openCreateModal = (customer = null) => {
    setEditItem(null);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditItem(coupon);
    setSelectedCustomer(coupon.user || null);
    setModalOpen(true);
  };

  // ================= stats =================
  const activeCoupons = coupons.filter(c => c.is_active).length;
  const generalCoupons = coupons.filter(c => !c.user).length;
  const exclusiveCoupons = coupons.filter(c => c.user).length;

  // ================= render helpers =================
  const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
      active 
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" 
        : "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
    }`}>
      {active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {active ? "فعال" : "غیرفعال"}
    </span>
  );

  const TypeBadge = ({ type, value }) => (
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${
        type === "percent" 
          ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300"
          : "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300"
      }`}>
        {type === "percent" ? <Percent size={16} /> : <Banknote size={16} />}
      </div>
      <span className="font-medium text-gray-700 dark:text-gray-200">
        {type === "percent" ? `${value}%` : `${value.toLocaleString()} تومان`}
      </span>
    </div>
  );

  return (
    <div className="p-6 md:p-8 md:mr-3 rounded-[2rem] bg-white/40 dark:bg-white/10 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-2xl overflow-x-hidden space-y-8">
      
      {/* ================= Header & Stats ================= */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-sky-500 rounded-2xl shadow-lg shadow-purple-500/25">
              <TicketPercent className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                مدیریت کدهای تخفیف
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                مدیریت کوپن‌های عمومی و اختصاصی مشتریان
              </p>
            </div>
          </div>
      
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">کل کدهای تخفیف</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{coupons.length}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-300">
                <Tag size={24} />
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">کدهای فعال</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{activeCoupons}</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 size={24} />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">تخفیف اختصاصی</p>
                <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">{exclusiveCoupons}</p>
              </div>
              <div className="p-3 bg-sky-100 dark:bg-sky-500/20 rounded-xl text-sky-600 dark:text-sky-300">
                <User size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Customers Section ================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700/50">
          <Users className="text-purple-600 dark:text-purple-400" size={20} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            مشتریان
          </h3>
          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
            {customers.length}
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-700/30 bg-white/50 dark:bg-black/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700/50">
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">مشتری</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">شماره تماس</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700 dark:text-gray-300">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {customers.map((c) => (
                  <tr 
                    key={c.id} 
                    className="group hover:bg-purple-50/50 dark:hover:bg-purple-500/5 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {c.fullname?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{c.fullname}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300 font-mono text-right dir-ltr">
                      {c.phone}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                        <CheckCircle2 size={12} />
                        فعال
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openCreateModal(c)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-xl transition-all duration-200 group-hover:shadow-md"
                      >
                        <TicketPercent size={16} />
                        اعمال کد تخفیف
                      </button>
                    </td>
                  </tr>
                ))}
                
                {!customers.length && (
                  <tr>
                    <td colSpan="4" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
                        <Users size={48} className="opacity-50" />
                        <p>مشتری‌ای یافت نشد</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= Coupons Section ================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <TicketPercent className="text-sky-600 dark:text-sky-400" size={20} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              لیست کدهای تخفیف
            </h3>
            <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 rounded-full text-xs font-medium">
              {coupons.length}
            </span>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="جستجو در کدها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-700/30 bg-white/50 dark:bg-black/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700/50">
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">کد تخفیف</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">نوع و مقدار</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 dark:text-gray-300">مشتری</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700 dark:text-gray-300">محدودیت</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700 dark:text-gray-300">وضعیت</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700 dark:text-gray-300">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {coupons
                  .filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((c) => (
                  <tr 
                    key={c.id} 
                    className="group hover:bg-sky-50/50 dark:hover:bg-sky-500/5 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                          <Tag size={18} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wider font-mono">
                          {c.code}
                        </code>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <TypeBadge type={c.type} value={c.value} />
                    </td>

                    <td className="py-4 px-6">
                      {c.user ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300 text-xs font-bold">
                            {c.user.fullname?.charAt(0)}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{c.user.fullname}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          <Users size={12} />
                          عمومی
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {c.usage_limit || "∞"}
                      </span>
                      <span className="text-xs text-gray-400 mr-1">بار</span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <StatusBadge active={c.is_active} />
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openEditModal(c)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 rounded-xl transition-all duration-200 hover:shadow-md"
                      >
                        <Edit2 size={16} />
                        ویرایش
                      </button>
                    </td>
                  </tr>
                ))}

                {!coupons.length && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-600">
                        <TicketPercent size={48} className="opacity-50" />
                        <p>کد تخفیفی وجود ندارد</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= Modal ================= */}
      {modalOpen && (
        <CouponModal
          isOpen={modalOpen}
          editItem={editItem}
          customer={selectedCustomer}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            loadCoupons();
          }}
        />
      )}
    </div>
  );
}
