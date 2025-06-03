import axiosClient from "./axiosClient";

export const faqApi = {
  gets: () => axiosClient.get("faq"),
  create: (data) => axiosClient.post("faq", data),
  update: (data) => axiosClient.put(`faq/${data._id}`, data),
  delete: (id) => axiosClient.delete(`faq/${id}`),
};
