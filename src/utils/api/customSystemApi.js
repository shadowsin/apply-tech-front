import axiosClient from "./axiosClient";

export const customSystemApi = {
  updateOpenaiKey: (key) => axiosClient.post("custom/openai", key),
  getOpenaiKey: () => axiosClient.get("custom/openai"),
};
