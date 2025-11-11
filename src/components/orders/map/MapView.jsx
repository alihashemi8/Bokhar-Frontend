import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// 🎯 آیکون مارکر
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 📍 انتخاب با کلیک روی نقشه
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={markerIcon}></Marker>
  ) : null;
}

// 🚀 حرکت دادن نقشه وقتی position تغییر می‌کنه
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && map) {
      map.flyTo([position.lat, position.lng], 15, { animate: true });
    }
  }, [position, map]);

  return null;
}

// 🗺️ کامپوننت اصلی MapView
export default function MapView({ position, setPosition, isDarkMode }) {
  const lightUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkUrl =
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

  const defaultCenter = { lat: 35.6892, lng: 51.389 }; // تهران

  return (
    <div className="relative w-full h-80 md:h-96 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={position || defaultCenter}
        zoom={15}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={isDarkMode ? darkUrl : lightUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <LocationMarker position={position} setPosition={setPosition} />
        {position && <MapUpdater position={position} />}
      </MapContainer>
    </div>
  );
}
