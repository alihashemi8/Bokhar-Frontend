import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// آیکون سفارشی بنفش
const customIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Marker قابل‌کشیدن + کلیک روی نقشه
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable
      icon={customIcon}
      eventHandlers={{
        dragend: (e) => setPosition(e.target.getLatLng()),
      }}
    >
      <Popup className="bg-purple-700 text-white font-semibold rounded-lg p-2 shadow-lg">
        مکان انتخاب شده:
        <br />
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
}

// حرکت نرم نقشه به مکان جدید
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position]);
  return null;
}

// اعتبارسنجی توضیحات
const isDescriptionValid = (desc) => {
  const keywords = ["کوچه", "واحد", "زنگ"];
  return keywords.some((k) => desc.includes(k));
};

export default function MapSelectorPro({
  onLocationSelect,
  initialPosition = null,
  initialAddress = "",
  initialDescription = "",
}) {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState(initialAddress);
  const [description, setDescription] = useState(initialDescription);
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const checkDark = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const lightUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkUrl =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

  useEffect(() => {
    if (!initialPosition && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        fetchAddress(coords);
      });
    }
  }, [initialPosition]);

  const fetchAddress = async (coords) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await res.json();
      setAddress(data.display_name || "");
    } catch (err) {
      console.error("خطا در دریافت آدرس:", err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (!value) return setSearchResults([]);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            value
          )}`
        );
        const data = await res.json();
        const unique = data.filter(
          (v, i, a) =>
            a.findIndex((t) => t.display_name === v.display_name) === i
        );
        setSearchResults(unique);
      } catch (err) {
        console.error(err);
      }
    }, 400);
  };

  const handleSelectSearch = (item) => {
    const newPos = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    setPosition(newPos);
    setAddress(item.display_name);
    setSearchQuery(item.display_name);
    setSearchResults([]);
  };

  const handleClickSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setAddress(display_name);
      } else alert("مکان پیدا نشد");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    if (!description || !isDescriptionValid(description)) {
      alert("لطفا پلاک و واحد خود را وارد کنید");
      return;
    }
    if (!position && !isPickup) {
      alert("لطفاً یک مکان روی نقشه انتخاب کنید یا تحویل حضوری را انتخاب کنید");
      return;
    }
    onLocationSelect({ coords: position, address, description, pickup: isPickup });
    alert("مکان با موفقیت ثبت شد ✅");
  };

  return (
    <div dir="rtl" className="flex flex-col gap-5 max-w-3xl mx-auto w-full p-4 sm:p-6 sm:mt-15 relative z-0">
      
{/* هدر راهنما با لینک تحویل حضوری (ریسپانسیو) */}
<h2 className="text-gray-800 dark:text-gray-100 font-semibold text-sm sm:text-base md:text-lg flex flex-wrap items-center gap-1 sm:gap-2">
  <span>آدرس خود را مشخص کنید.</span>

</h2>


      {/* 🔍 نوار جستجو */}
      <div className="relative flex flex-col sm:flex-row gap-2 mt-2">
        <div className="flex flex-1 items-center bg-gray-100 dark:bg-gray-800 rounded-full shadow-md overflow-hidden">
          <button
            onClick={handleClickSearch}
            className="p-2 sm:hidden bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition"
          >
            <Search className="w-5 h-5 " />
          </button>

          <input
            type="text"
            placeholder="جستجوی آدرس..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleClickSearch()}
            className="flex-1 px-4 py-2 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          />

          <button
            onClick={handleClickSearch}
            className="hidden sm:flex p-2 sm:px-4 bg-purple-600 hover:bg-purple-700 text-white items-center justify-center transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white text-gray-800 dark:bg-gray-800 dark:text-amber-100 shadow rounded-lg z-50 max-h-60 overflow-auto mt-1">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSearch(item)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
              >
                {item.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🗺️ نقشه */}
      <div className="relative w-80 md:w-full mx-auto rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
        <div className="w-80 md:w-full h-80 md:h-96 z-0 relative">
          <MapContainer
            center={position || [35.6892, 51.389]}
            zoom={15}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url={isDarkMode ? darkUrl : lightUrl}
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              style={
                isDarkMode ? { filter: "hue-rotate(220deg) saturate(1.2)" } : {}
              }
            />
            <LocationMarker position={position} setPosition={setPosition} />
            <MapUpdater position={position} />
          </MapContainer>
        </div>
      </div>

      {/* 📍 باکس توضیحات */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 space-y-2 text-sm sm:text-base">
        <textarea
          placeholder="خیابان ، کوچه ، پلاک ، واحد ... "
          className="w-full p-2 border rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full font-semibold mt-2"
        >
          ثبت مکان
        </button>
      </div>

      {/* 🛒 دکمه سبد خرید */}
      <button
        dir="ltr"
        onClick={() => navigate("/order")}
        className="flex items-center mb-20 sm:mb-0 justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg transition-all text-sm sm:text-base mt-4 mx-auto"
      >
        <ShoppingCart size={20} />
        <span>ادامه فرایند خرید</span>
      </button>
    </div>
  );
}
