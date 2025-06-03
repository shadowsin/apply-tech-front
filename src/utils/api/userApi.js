import axiosClient from "./axiosClient";

export const userApi = {
  getUsers: () => axiosClient.get("user"),
  getUserById: (userId) => axiosClient.get(`user/${userId}`),
  updateUserById: (user) => axiosClient.put(`user/${user._id}`, user),
  updateAddress: (address) =>
    axiosClient.put(`user/update-address`, { address }),
  jobApply: (data) => axiosClient.post("user/apply", data),
  getCVapplied: (userId) => axiosClient.get(`user/${userId}/cv-applied`),
  getJobsApplied: () => axiosClient.get(`user/jobs-applied`),
  updateSkills: (skills) => axiosClient.put("user/update-skills", { skills }),
};
