import axios from "axios";
import { key } from "./getGeocoding";

export const getCurrentAddress = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${key}`;

        try {
          const response = await axios.get(url);
          resolve({ lat, lng, address: response.data });
        } catch (error) {
          reject(error);
        }
      });
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};
