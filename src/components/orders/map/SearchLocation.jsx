import { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin } from "lucide-react";

export default function SearchLocation({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Auto Suggest هنگام تایپ ---
  useEffect(() => {
    if (!query || query.length < 2) {
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
            },
          }
        );
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      {/* input box */}
      <div
        dir="rtl"
        className="
          flex items-center gap-2
          bg-white/80 dark:bg-white/70 border border-sky-300 dark:border-purple-800
          px-3 py-2 rounded-2xl
          shadow-sm shadow-sky-200/60
          focus-within:ring-1 focus-within:ring-sky-400 dark:focus-within:ring-purple-900
          transition-all
        "
      >
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="جستجوی آدرس..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700"
        />
      </div>

      {/* Results dropdown */}
      {results.length > 0 && (
        <ul
          dir="rtl"
          className="
            absolute w-full
            bg-white/80 dark:bg-white/70
            border border-sky-300 dark:border-purple-800
            rounded-2xl mt-2
            shadow-xl shadow-sky-200/60
            z-50
            max-h-36 overflow-y-auto
            animate-fadeIn
          "
        >
          {results.map((r) => (
            <li
              key={r.place_id}
              onClick={() => {
                onSelect({
                  lat: parseFloat(r.lat),
                  lng: parseFloat(r.lon),
                  address: r.display_name,
                });
                setQuery(r.display_name);
                setResults([]);
              }}
              className="
                flex items-start gap-3 px-4 py-3
                hover:bg-sky-100 dark:hover:bg-purple-800/60
                cursor-pointer transition
              "
            >
              <MapPin
                className="text-sky-500 shrink-0 mt-0.5"
                size={20}
              />
              <span
                className="
                  text-gray-700 text-sm leading-5
                  overflow-hidden text-ellipsis whitespace-nowrap
                  block max-w-full
                "
              >
                {r.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-xs text-gray-400 loading-dots">
          در حال جستجو
        </div>
      )}
    </div>
  );
}
