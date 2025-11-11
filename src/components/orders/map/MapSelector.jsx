import { useState, useEffect, useCallback } from "react";
import { Crosshair, ChevronDown, ChevronUp } from "lucide-react";
import MapView from "./MapView";
import AddressForm from "./AddressForm";
import SavedAddressesList from "./SavedAddressesList";
import SearchBox from "./SearchBox";

import { useSavedAddresses } from "../../../hooks/useSavedAddresses";
import { useDarkMode } from "../../../hooks/useDarkMode";

const MAPIR_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNkMmRlNzk0ZGMwZDQzNmMxM2EwOGRhODhiYWFlYmE4NDc3ZDNhMmYyNmM5MTVlYWMyMDRjOGJkMTkyY2ExZGYwNWJmMmI2OGU1YjBhZWJkIn0.eyJhdWQiOiIzNTIxMiIsImp0aSI6ImNkMmRlNzk0ZGMwZDQzNmMxM2EwOGRhODhiYWFlYmE4NDc3ZDNhMmYyNmM5MTVlYWMyMDRjOGJkIiwiaWF0IjoxNzYyNDE0OTcwLCJuYmYiOjE3NjI0MTQ5NzAsImV4cCI6MTc2NDkyMDU3MCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.cuaMmHr3rMuJYGFhFuG_3muOdJBT_vjntSAyd5zMQHvgkblJMRz_pSWFj23zJ69TeZ4txtXzEIHLjg4yCimlM3inRuISkOdQbHGMZFqYwDgA64Om6fFmRzd4lu9keWEKGGZ7Q6BCFkdo9ukjQ8LEJ3r2EtC-g_5cfKII8ZX3x-nxjErdaGWIilkl9sSCOnzi_ZFcsA4CW6CCt-oAzOHRx0vpQhS9BBFKulcivJsln0MsPS4SfOq9bxquvgQjmVDTbppwSpZb0qlQcVCKU3VyzBdy5qJYA6HO4pC6sQTcC6p5R_ogfmd_mBZGY1CfhvPyqdxG-Jfl-MvZvsR1e73oKQ";

export default function MapSelector({
  onLocationSelect,
  initialPosition = null,
  initialAddress = "",
}) {
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState(initialAddress);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    plaque: "",
    unit: "",
    note: "",
  });
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [searchResults, setSearchResults] = useState([]);
  const [mapVisible, setMapVisible] = useState(false); // کنترل نمایش نقشه
  const { savedAddresses, addAddress, removeAddress } = useSavedAddresses();
  const isDarkMode = useDarkMode();

  // 🌍 گرفتن موقعیت اولیه از GPS
  useEffect(() => {
    if (!initialPosition && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => console.warn("GPS access denied")
      );
    }
  }, [initialPosition]);

  // 🏠 گرفتن آدرس از مختصات (reverse)
  const fetchAddress = useCallback(async (coords) => {
    try {
      const res = await fetch(
        `https://map.ir/reverse?lat=${coords.lat}&lon=${coords.lng}`,
        { headers: { "x-api-key": MAPIR_TOKEN } }
      );
      const data = await res.json();
      const formatted = data.address || data.address_compact || "آدرس یافت نشد";
      setAddress(formatted);
    } catch (err) {
      console.error("خطا در دریافت آدرس:", err);
    }
  }, []);

  // فقط وقتی مختصات تغییر کرد، آدرس بگیر
  useEffect(() => {
    if (position) {
      fetchAddress(position);
      setFormVisible(true);
    }
  }, [position, fetchAddress]);

  // اطلاع‌رسانی به والد
  useEffect(() => {
    if (position && address) {
      onLocationSelect?.({
        coords: position,
        address,
        ...formData,
      });
    }
  }, [position, address, formData, onLocationSelect]);

  // 🔍 جستجو با debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://map.ir/search/v2?text=${encodeURIComponent(
            searchQuery
          )}&limit=5`,
          {
            headers: { "x-api-key": MAPIR_TOKEN },
            signal: controller.signal,
          }
        );
        const data = await res.json();
        if (data?.value) setSearchResults(data.value);
      } catch {
        setSearchResults([]);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [searchQuery]);

  const handleSelectSearch = (item) => {
    const lat = parseFloat(item.geom?.coordinates[1]);
    const lng = parseFloat(item.geom?.coordinates[0]);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition({ lat, lng });
      setAddress(item.address || item.title || "");
      setSearchQuery(item.title || item.address || "");
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://map.ir/search/v2?text=${encodeURIComponent(
          searchQuery
        )}&limit=1`,
        { headers: { "x-api-key": MAPIR_TOKEN } }
      );
      const data = await res.json();
      if (data?.value?.length) {
        const first = data.value[0];
        const lat = parseFloat(first.geom?.coordinates[1]);
        const lng = parseFloat(first.geom?.coordinates[0]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setPosition({ lat, lng });
          setAddress(first.address || first.title);
          setFormVisible(true);
          setSearchResults([]);
        }
      } else alert("مکان مورد نظر یافت نشد ❌");
    } catch {
      alert("خطا در جستجو ❌");
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.plaque || !formData.unit) {
      alert("لطفا عنوان، پلاک و واحد را وارد کنید");
      return;
    }

    const newAddress = {
      title: formData.title,
      coords: position,
      address,
      ...formData,
    };

    if (!addAddress(newAddress)) {
      alert("حداکثر ۳ آدرس مجاز است ❌");
      return;
    }

    alert("آدرس با موفقیت ذخیره شد ✅");
    setFormData({ title: "", plaque: "", unit: "", note: "" });
  };

  const handleLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert("دسترسی به موقعیت فعال نیست ❌")
      );
    } else alert("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند");
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col gap-5 max-w-3xl mx-auto w-full p-4 sm:p-6 sm:mt-15 relative z-0"
    >
      <h2 className="text-gray-800 dark:text-gray-100 font-semibold text-base md:text-lg">
        ابتدا مکان خود را روی نقشه انتخاب کنید 📍
      </h2>

      {savedAddresses.length > 0 && (
        <SavedAddressesList
          savedAddresses={savedAddresses}
          onSelect={(item) => {
            setPosition(item.coords);
            setAddress(item.address);
            setFormData({
              title: item.title || "",
              plaque: item.plaque || "",
              unit: item.unit || "",
              note: item.note || "",
            });
            setFormVisible(true);
          }}
          onRemove={removeAddress}
        />
      )}

      {/* دکمه دراپ‌داون نقشه */}
      <button
        onClick={() => setMapVisible((prev) => !prev)}
        className="flex items-center justify-between w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {mapVisible ? "بستن نقشه" : "انتخاب مکان از روی نقشه"}
        {mapVisible ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* محتویات دراپ‌داون */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          mapVisible ? "max-h-[720px]" : "max-h-0"
        }`}
      >
        {mapVisible && (
          <div className="flex flex-col gap-4">
            {/* SearchBox */}
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearchSubmit}
              results={searchResults}
              onSelect={handleSelectSearch}
            />

            {/* نقشه */}
            <div className="relative">
              <MapView
                position={position}
                setPosition={setPosition}
                isDarkMode={isDarkMode}
              />
              <button
                onClick={handleLiveLocation}
                className="absolute bottom-3 left-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center transition z-[1000]"
              >
                <Crosshair className="w-5 h-5" />
              </button>
            </div>

            {/* AddressForm */}
            <AddressForm
              address={address}
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              disableSave={
                !formData.title || !formData.plaque || !formData.unit
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
