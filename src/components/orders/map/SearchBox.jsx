import { Search } from "lucide-react";

export default function SearchBox({ searchQuery, setSearchQuery, results, onSelect }) {
  return (
    <div className="relative flex flex-col sm:flex-row gap-2 mt-2">
      <div className="flex flex-1 items-center bg-gray-100 dark:bg-gray-800 rounded-full shadow-md overflow-hidden">
        <input
          type="text"
          placeholder="جستجوی آدرس در ایران..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm sm:text-base"
        />
        <button
          onClick={() => {}}
          className="p-2 sm:px-4 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white text-gray-800 dark:bg-gray-800 dark:text-amber-100 shadow rounded-lg z-50 max-h-60 overflow-auto mt-1">
          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(item)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
