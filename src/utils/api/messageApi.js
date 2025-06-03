import axiosClient from "./axiosClient";

export const messageApi = {
  ask: ({ userId, message }) =>
    axiosClient.post(`/messages/${userId}/ask-ai`, { message }),
  send: (data) => axiosClient.post("/messages/send", data),
  get: ({ from, to }) => axiosClient.get(`/messages/get/${from}/${to}`),
  getText: (message) => axiosClient.post("/messages/get-text", { message }),
};
