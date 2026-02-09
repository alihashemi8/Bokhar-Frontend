import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import { ArrowLeft } from "lucide-react";

// آیکون آبی مغازه
const storeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
  shadowSize: [45, 45],
});


// حرکت نرم نقشه به لوکیشن
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16, { animate: true });
  }, [position]);
  return null;
}

export default function PickupInfo() {
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

  const store = {
    name: "فروشگاه مرکزی",
    address: "تهران، خیابان ولیعصر، پلاک 123",
    phone: "021-12345678",
    image: "https://via.placeholder.com/400x200?text=Store+Image",
    lat: 35.6892,
    lng: 51.389,
  };

  const tileUrl = isDarkMode
    ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // تابع اشتراک‌گذاری موقعیت
  const handleShareLocation = () => {
    const url = `https://www.google.com/maps?q=${store.lat},${store.lng}`;
    if (navigator.share) {
      navigator
        .share({
          title: store.name,
          text: `موقعیت ${store.name}`,
          url,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert("لینک موقعیت فروشگاه کپی شد ✅");
    }
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center md:mt-16 gap-3">
        <h1 className="text-lg font-semibold text-gray-800">اطلاعات دریافت حضوری</h1>

        {/* Back Button */}
        <button
          onClick={() => navigate("/customer-dashboard")}
          className="ms-auto w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:mt-2">
        شما می‌توانید سفارش خود را مستقیماً از فروشگاه دریافت کنید. آدرس و موقعیت مغازه را مشاهده کنید و ادامه خرید را انجام دهید.
      </p>

      {/* کارت فروشگاه */}
      <div className="bg-white mb-20 md:mb-0 shadow-lg rounded-2xl overflow-hidden border border-gray-200 relative z-0">
        <img
          src={store.image}
          alt="عکس فروشگاه"
          className="w-full h-48 sm:h-64 object-cover"
        />

        <div className="p-4 space-y-2">
          <h2 className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-gray-100">
            {store.name}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base flex items-start gap-2">
            <span className="font-semibold">آدرس:</span>
            <span>{store.address}</span>
          </p>

          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base flex items-start gap-2">
            <span className="font-semibold">شماره تماس:</span>
            <span>{store.phone}</span>
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base italic">
            می‌توانید اطلاعات کامل‌تر و سایر شعبه‌ها را در قسمت{" "}
            <span className="font-semibold">درباره ما</span> پیدا کنید.
          </p>

          <div className="flex justify-end mb-2">
            <button
              onClick={handleShareLocation}
              className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-full text-sm font-medium transition"
            >
              <FiShare2 />
            </button>
          </div>

          <div className="w-full h-64 mt-4 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-inner relative z-10">
            <MapContainer
              center={[store.lat, store.lng]}
              zoom={16}
              scrollWheelZoom
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url={tileUrl} />
              <Marker position={[store.lat, store.lng]} icon={storeIcon}>
                <Popup className="font-semibold">{store.name}</Popup>
              </Marker>
              <MapUpdater position={[store.lat, store.lng]} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
