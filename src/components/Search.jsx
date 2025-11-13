// src/components/Search.jsx
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchBox({ allItems, onSelect }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // فیلتر هوشمند (includes)
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => item.title.toLowerCase().includes(lowerQuery));
  }, [query, allItems]);

  const handleSelect = (card) => {
    setQuery(card.title);
    setShowSuggestions(false);
    onSelect(card);
  };

  const handleSearch = () => {
    if (filtered.length === 1) handleSelect(filtered[0]);
    setShowSuggestions(false);
  };

  // وقتی query خالی شد، انتخاب پاک می‌شود
  useEffect(() => {
    if (!query.trim()) onSelect(null);
  }, [query, onSelect]);

  return (
    <div className="relative w-full">
      <div className="flex rounded-full border bg-white dark:bg-gray-800 overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="چی می‌خوای پیدا کنی؟"
          className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
        >
          <Search size={18} />
        </button>
      </div>

      {showSuggestions && query && filtered.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border rounded-xl shadow-lg max-h-60 overflow-auto z-20">
          {filtered.slice(0, 6).map(item => (
            <li
              key={`${item.category}-${item.id}`}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
            >
              <span>{item.title}</span>
              <span className="text-gray-400 text-sm">{item.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
