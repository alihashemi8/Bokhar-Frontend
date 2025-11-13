import { useRef, useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBox({
  searchQuery,
  setSearchQuery,
  results,
  onSelect,
  onSearch,
}) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef();

  // 📡 وقتی نتایج جدید اومد، نمایش لیست
  useEffect(() => {
    if (results.length > 0) setIsOpen(true);
    else setIsOpen(false);
  }, [results]);

  // 🧹 بستن لیست با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚀 جستجوی دستی با دکمه
  const handleManualSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    await onSearch?.();
    setLoading(false);
  };

  return (
    <div ref={boxRef} className="relative flex flex-col sm:flex-row gap-2 mt-2">
      {/* input */}
      <div className="flex flex-1 items-center bg-gray-100 dark:bg-gray-800 rounded-full shadow-md overflow-hidden">
        <input
          type="text"
          placeholder="جستجوی آدرس در ایران..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          className="flex-1 px-4 py-2 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm sm:text-base"
        />
        <button
          onClick={handleManualSearch}
          disabled={loading}
          className="p-2 sm:px-4 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* نمایش نتایج */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white text-gray-800 dark:bg-gray-800 dark:text-amber-100 shadow rounded-lg z-50 max-h-60 overflow-auto mt-1"
          >
            {results.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
              >
                {item.title || item.address || item.display_name}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
