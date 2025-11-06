import { MapPin } from "lucide-react";

export default function SavedAddressesList({ savedAddresses, onSelect, onRemove }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
      <p className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
        آدرس‌های ذخیره‌شده:
      </p>
      <div className="flex flex-col gap-2">
        {savedAddresses.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between bg-purple-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-3 rounded-lg border border-purple-200 dark:border-gray-600 hover:bg-purple-100 dark:hover:bg-gray-600 transition"
          >
            <div onClick={() => onSelect(item)} className="cursor-pointer flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-sm">{item.title}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.address}
              </p>
            </div>

            <button
              onClick={() => onRemove(i)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
