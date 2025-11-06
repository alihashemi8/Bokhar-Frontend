import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { formatAddress } from "../../utils/address";

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

export default function LocationMarker({ position, setPosition }) {
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
        مکان انتخاب‌شده:
        <br />
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </Popup>
    </Marker>
  );
}
