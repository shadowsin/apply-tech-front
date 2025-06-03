import axiosClient from "./axiosClient";

export const commentApi = {
  addComment: (data) => axiosClient.post("comment", data),
  editComment: (data) => axiosClient.put(`comment/${data._id}`, data),
  deleteComment: (id) => axiosClient.delete(`comment/${id}`),
  getCommentByCompany: (id) => axiosClient.get(`comment/${id}`),
};
