import axios from "axios";

export const key = "7fb1986b8db3439c914fde1c905986bc";

export const getGeocoding = async (address) => {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&format=json&apiKey=${key}`;

  const { data } = await axios.get(url);

  if (data.results && data.results.length) {
    return { lat: data.results[0].lat, lon: data.results[0].lon };
  }

  return { lat: data.results.lat, lon: data.results.lon };
};
