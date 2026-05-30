import { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin } from "lucide-react";

export default function SearchLocation({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Auto Suggest ---
useEffect(() => {
  if (!query || query.trim().length < 2) {
    setResults([]);
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 6,
            countrycodes: "ir",
          },
        }
      );

      setResults(res.data || []);
    } catch (err) {
      console.error("Search Error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 400);

  return () => clearTimeout(timeout);
}, [query]);

  return (
    <div className="relative w-full">
      {/* INPUT */}
      <div
        dir="rtl"
        className="
          flex items-center gap-2
          bg-white/80 dark:bg-white/70
          border border-sky-300 dark:border-purple-700
          px-3 py-2 rounded-2xl
          shadow-sm shadow-sky-200/60
          focus-within:ring-1
          focus-within:ring-sky-400
          dark:focus-within:ring-purple-800
          transition-all
        "
      >
        <Search
          className="text-gray-500"
          size={20}
        />

        <input
          type="text"
          placeholder="جستجوی آدرس..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            text-gray-700
            dark:text-gray-900
          "
        />
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <ul
          dir="rtl"
          className="
            absolute
            bottom-full
            mb-2
            w-full

            bg-white/95
            dark:bg-white/90

            border
            border-sky-300
            dark:border-purple-800

            rounded-2xl

            shadow-xl
            shadow-sky-200/60

            z-50

            max-h-64
            overflow-y-auto
            scroll-smooth
            overscroll-contain
          "
        >
{results.map((item) => (
  <li
    key={item.place_id}
    onClick={() => {
      onSelect({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        address: item.display_name,
      });

      setQuery(item.display_name);
      setResults([]);
    }}
    className="
      flex items-start gap-3
      px-4 py-3
      hover:bg-sky-100
      dark:hover:bg-purple-800/60
      cursor-pointer
      transition
    "
  >
    <MapPin
      className="
        text-sky-500
        shrink-0
        mt-0.5
      "
      size={20}
    />

    <span
      className="
        text-gray-700
        text-sm
        leading-5
        overflow-hidden
        text-ellipsis
        whitespace-nowrap
        block
        max-w-full
      "
    >
      {item.display_name}
    </span>
  </li>
))}
        </ul>
      )}

      {/* LOADING */}
      {loading && (
        <div
          className="
            absolute
            left-5
            top-1/2
            -translate-y-1/2
            text-xs
            text-gray-400
          "
        >
          در حال جستجو...
        </div>
      )}
    </div>
  );
}