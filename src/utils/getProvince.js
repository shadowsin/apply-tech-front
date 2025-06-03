import axios from "axios";
const host = "https://vapi.vnappmob.com";

export const getProvinces = async () => {
  fetch(`${host}/api/province`)
    .then((res) => res.json())
    .then((res) => console.log(res.data));
  return [];
};

export const getDistricts = async (id) => {
  const res = await axios.get(`${host}/api/province/district/${id}`);
  if (res && res.data) return res.data;
  return [];
};

export const getWards = async (id) => {
  const res = await axios.get(`${host}/api/province/ward/${id}`);
  if (res && res.data) return res.data;
  return [];
};
