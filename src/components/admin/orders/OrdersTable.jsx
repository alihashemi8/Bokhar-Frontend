export default function OrdersTable({
  orders,
  cities,
  cityFilter,
  setCityFilter,
  toggleSort,
  toggleCheck,
  activeTab,
  onRowClick,
}) {
  const remainingDays = (date) => {
    const today = new Date();
    const delivery = new Date(date);
    const diff = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  return (
    <div className="bg-white/50 dark:bg-white/50 backdrop-blur-lg border border-sky-200/50 rounded-2xl mt-6 p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-black mb-4 border-b border-white/10 pb-2">
        سفارش‌ها
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right">
          <thead className="text-black border-b border-white/10">
            <tr>
              <th className="p-3">شماره سفارش</th>
              <th className="p-3">نام مشتری</th>
              <th className="p-3">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="p-1 rounded border border-sky-200/50 bg-white/70 backdrop-blur text-black focus:outline-none"
                >
                  <option value="">محله</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </th>
              <th
                className="p-3 cursor-pointer select-none"
                onClick={() => toggleSort("deliveryDate")}
              >
                مهلت
              </th>
              <th
                className="p-3 cursor-pointer select-none"
                onClick={() => toggleSort("price")}
              >
                مبلغ
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onRowClick(order)}
                className="hover:bg-white/80 dark:text-gray-900 transition border-b border-white/5 cursor-pointer"
              >
                <td className="p-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCheck(order.id);
                    }}
                    disabled={activeTab === "done"}
                    className={`px-4 py-2 rounded-xl font-bold transition ${
                      order.isChecked
                        ? "bg-green-100 border border-green-500 text-green-600"
                        : "bg-red-100 border border-red-500 text-red-600"
                    }`}
                  >
                    {order.id}
                  </button>
                </td>
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.city}</td>
                <td className="p-3">
                  {remainingDays(order.deliveryDate)} روز
                </td>
                <td className="p-3">
                  {order.price.toLocaleString()} تومان
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
