import { useEffect, useState } from "react";
import { Tag, Clock, Wallet } from "lucide-react";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("reminders");
  const [reminders, setReminders] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/notifications/", {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server returned ${res.status}: ${text}`);
        }

        const data = await res.json();
        setReminders(Array.isArray(data.reminders) ? data.reminders : []);
        setDiscounts(Array.isArray(data.discounts) ? data.discounts : []);
        setTransactions(
          Array.isArray(data.transactions) ? data.transactions : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("⚠️ Failed to load notifications:", err);
          setError("خطا در بارگذاری اعلان‌ها. لطفاً دوباره تلاش کنید.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    return () => controller.abort();
  }, []);

  const unreadCount = reminders.filter((r) => !r.read).length;
  const discountsCount = discounts.length;
  const transactionsCount = transactions.length;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-200 mt-20">
     {/* دکمه‌های قرصی در یک ردیف */}
<div className="flex justify-center items-center gap-3 mb-6">
  <PillButton
    active={activeTab === "reminders"}
    onClick={() => setActiveTab("reminders")}
    icon={<Clock size={18} />}
    label="یادآوری‌ها"
    badge={unreadCount}
  />
  <PillButton
    active={activeTab === "discounts"}
    onClick={() => setActiveTab("discounts")}
    icon={<Tag size={18} />}
    label="تخفیف‌ها"
    badge={discountsCount}
  />
  <PillButton
    active={activeTab === "transactions"}
    onClick={() => setActiveTab("transactions")}
    icon={<Wallet size={18} />}
    label="تراکنش‌ها"
    badge={transactionsCount}
  />
</div>


      {/* محتوای تب‌ها */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-5 md:p-6 transition-all duration-300 border border-gray-200 dark:border-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[color:var(--bk-primary,#06b6d4)]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : (
          <>
            {activeTab === "reminders" && <Reminders reminders={reminders} />}
            {activeTab === "discounts" && <Discounts discounts={discounts} />}
            {activeTab === "transactions" && (
              <Transactions transactions={transactions} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- PillButton ---------- */
function PillButton({ active, onClick, icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex justify-center items-center gap-2 px-2 py-2 rounded-full border transition-all focus:outline-none
        ${
          active
            ? "bg-purple-600/70 text-white border-transparent shadow-md"
            : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
    >
      {icon}
      <span className="font-medium whitespace-nowrap">{label}</span>
      {badge > 0 && (
        <span
          className={`ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full 
            ${
              active
                ? "bg-white text-purple-600/70"
                : "bg-purple-600/70 text-white"
            }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}


/* ---------- Reminders ---------- */
function Reminders({ reminders }) {
  if (!reminders.length)
    return (
      <p className="text-gray-500 text-sm text-center">
        هیچ یادآوری‌ای وجود ندارد.
      </p>
    );

  return (
    <div className="space-y-3">
      {reminders.map((r) => (
        <div
          key={r.id}
          className={`p-4 border rounded-2xl flex justify-between items-center transition-all
            ${
              r.read
                ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                : "bg-[color:var(--bk-accent,#e6fcf5)] border-[color:var(--bk-primary,#06b6d4)] shadow-sm"
            }`}
        >
          <div>
            <p className="font-medium">{r.title}</p>
            {r.time && (
              <p className="text-sm text-gray-500 mt-1">{formatTime(r.time)}</p>
            )}
          </div>
          {!r.read && (
            <span className="text-xs text-[color:var(--bk-primary,#06b6d4)] font-semibold">
              جدید
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Discounts ---------- */
function Discounts({ discounts }) {
  if (!discounts.length)
    return (
      <p className="text-gray-500 text-sm text-center">
        تخفیف فعالی وجود ندارد.
      </p>
    );

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {discounts.map((d) => (
        <div
          key={d.id}
          className="p-4 border rounded-2xl flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{d.title}</p>
            {d.valid_until && (
              <p className="text-sm text-gray-500 mt-1">
                اعتبار تا: {formatDate(d.valid_until)}
              </p>
            )}
          </div>
          <span className="text-[color:var(--bk-primary,#06b6d4)] font-bold">
            %{d.percent}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Transactions ---------- */
function Transactions({ transactions }) {
  if (!transactions.length)
    return (
      <p className="text-gray-500 text-sm text-center">هیچ تراکنشی ثبت نشده.</p>
    );

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="p-4 border rounded-2xl flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{t.title}</p>
            {t.date && (
              <p className="text-sm text-gray-500 mt-1">{formatDate(t.date)}</p>
            )}
          </div>
          <span className="font-bold text-[color:var(--bk-primary,#06b6d4)]">
            {formatAmount(t.amount)} تومان
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Helper functions ---------- */
function formatDate(d) {
  const dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString("fa-IR");
}

function formatTime(t) {
  const dt = new Date(t);
  return isNaN(dt) ? t : dt.toLocaleString("fa-IR");
}

function formatAmount(num) {
  return typeof num === "number" ? num.toLocaleString("fa-IR") : num;
}
