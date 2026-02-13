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
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl mt-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">شماره سفارش</th>
              <th className="p-3">نام مشتری</th>
              <th className="p-3">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="p-1 rounded border dark:bg-gray-700"
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
                className="p-3 cursor-pointer"
                onClick={() => toggleSort("deliveryDate")}
              >
                مهلت
              </th>
              <th
                className="p-3 cursor-pointer"
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
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
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
                        ? "bg-green-100 border border-green-500 text-green-500"
                        : "bg-red-100 border border-red-600 text-red-600"
                    }`}
                  >
                    {order.id}
                  </button>
                </td>
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.city}</td>
                <td className="p-3">{remainingDays(order.deliveryDate)} روز</td>
                <td className="p-3">{order.price.toLocaleString()} تومان</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
