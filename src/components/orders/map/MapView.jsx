import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export default function MapView({ initialPosition, onPositionChange, onMarkerClick }) {
  const [position, setPosition] = useState(initialPosition || { lat: 35.6892, lng: 51.3890 });

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
