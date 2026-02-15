import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

/* ===== ساخت آیکن SVG ===== */
const createMarkerIcon = (color) =>
  L.divIcon({
    className: "",
    html: `
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="${color}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

/* ===== Fly To ===== */
function FlyToLocation({ targetPosition }) {
  const map = useMap();

  useEffect(() => {
    if (targetPosition) {
      map.flyTo(targetPosition, 16, { duration: 0.8 });
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }, [targetPosition, map]);

  return null;
}

export default function MapView({
  initialPosition,
  onPositionChange,
  onMarkerClick,
}) {
  const [position, setPosition] = useState(
    initialPosition || { lat: 35.6892, lng: 51.389 }
  );

  const [isDark, setIsDark] = useState(false);

  /* ===== تشخیص Dark Mode (Tailwind) ===== */
  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const MarkerHandler = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onPositionChange?.(e.latlng);
      },
    });
    return null;
  };

  useEffect(() => {
    if (initialPosition) setPosition(initialPosition);
  }, [initialPosition]);

  const markerIcon = isDark
    ? createMarkerIcon("#8b5cf6") // بنفش
    : createMarkerIcon("#0ea5e9"); // آبی

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className="h-[300px] md:h-[400px] w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToLocation targetPosition={position} />

      <Marker
        position={position}
        icon={markerIcon}
        eventHandlers={{
          click() {
            onMarkerClick?.(position);
          },
        }}
      />

      <MarkerHandler />
    </MapContainer>
  );
}
