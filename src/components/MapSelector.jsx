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

// اصلاح آیکون Marker پیش‌فرض
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Marker draggable و کلیک روی نقشه
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
      draggable={true}
      eventHandlers={{
        dragend: (e) => setPosition(e.target.getLatLng()),
      }}
    >
      <Popup>
        مکان انتخاب شده: <br />
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
}

// برای حرکت smooth نقشه روی Marker
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position]);
  return null;
}

export default function MapSelectorPro({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);

  // موقعیت فعلی کاربر
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        fetchAddress(coords);
      });
    }
  }, []);

  // Reverse Geocoding
  const fetchAddress = async (coords) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await res.json();
      setAddress(data.display_name || "آدرس یافت نشد");
    } catch (err) {
      console.error("خطا در دریافت آدرس:", err);
    }
  };

  // جستجوی آنلاین زنده
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
        setSearchResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
  };

  // انتخاب یکی از نتایج جستجو
  const handleSelectSearch = (item) => {
    const newPos = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
    setPosition(newPos);
    setAddress(item.display_name);
    setSearchQuery(item.display_name);
    setSearchResults([]);
  };

  // دکمه Search
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
        const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(newPos);
        setAddress(display_name);
      } else {
        alert("مکان پیدا نشد");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    if (!position) {
      alert("لطفاً یک مکان روی نقشه انتخاب کنید");
      return;
    }
    onLocationSelect({ coords: position, address, description });
    alert("مکان با موفقیت ثبت شد ✅");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* جستجوی آنلاین */}
      <div className="relative flex gap-2">
        <input
          type="text"
          placeholder="جستجوی آدرس..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 p-2 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          onKeyDown={(e) => e.key === "Enter" && handleClickSearch()}
        />
        <button
          onClick={handleClickSearch}
          className="px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          جستجو
        </button>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white shadow rounded-lg z-50 max-h-60 overflow-auto mt-1">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSearch(item)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {item.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نقشه */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden shadow">
        <MapContainer
          center={position || [35.6892, 51.389]}
          zoom={16}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <MapUpdater position={position} />
        </MapContainer>
      </div>

      {/* آدرس و توضیحات */}
      {position && (
        <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
          <p className="text-gray-700 text-sm font-semibold">
            آدرس انتخاب‌شده:
          </p>
          <p className="text-gray-600 text-sm truncate">{address}</p>
          <textarea
            placeholder="توضیحات (مثلاً پلاک، طبقه، زنگ...)"
            className="w-full p-2 border rounded-lg text-sm"
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
      )}
    </div>
  );
}
