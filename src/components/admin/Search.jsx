import { Search as SearchIcon } from "lucide-react";

export default function Search({
  value,
  onChange,
  items = [],
  onSelect,
  renderItem,
  loading = false,
  placeholder = "جستجو...",
}) {
  return (
    <div className="relative w-full">
      <div
        dir="rtl"
        className="flex items-center gap-2 bg-white/70 border border-sky-300/50 px-3 py-2 rounded-2xl"
      >
        <SearchIcon className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {loading && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          در حال جستجو...
        </div>
      )}

      {items.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-2xl mt-2 z-50 shadow">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => onSelect(item)}
              className="px-4 py-2 hover:bg-sky-100 cursor-pointer"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
