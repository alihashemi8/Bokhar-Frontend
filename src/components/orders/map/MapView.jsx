import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

function FlyToLocation({ targetPosition }) {
  const map = useMap();

  useEffect(() => {
    if (targetPosition) {
      map.flyTo(targetPosition, 16, { duration: 0.8 });
    }
  }, [targetPosition]);

  return null;
}

export default function MapView({ initialPosition, onPositionChange, onMarkerClick }) {
  const [position, setPosition] = useState(
    initialPosition || { lat: 35.6892, lng: 51.3890 }
  );

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

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* انیمیشن پرواز به موقعیت جدید */}
      <FlyToLocation targetPosition={position} />

      <Marker
        position={position}
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
