const API_KEY = import.meta.env.VITE_NESHAN_API_KEY;

const headers = {
  "Api-Key": API_KEY,
};

export async function searchLocation(term) {
  if (!term?.trim()) return [];

  const response = await fetch(
    `https://api.neshan.org/v4/geocoding?term=${encodeURIComponent(term)}&lat=35.699756&lng=51.338076`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  const data = await response.json();

  return data.items || [];
}

export async function reverseGeocode(lat, lng) {
  const response = await fetch(
    `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error("Reverse geocode request failed");
  }

  return response.json();
}