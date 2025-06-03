import axiosClient from "./axiosClient";

export const authApi = {
  login: ({ email, password }) =>
    axiosClient.post("auth/login", { email, password }),
  signup: (data) => axiosClient.post("auth/register  ", data),
  checkAuth: () => axiosClient.post("auth/check-auth"),
};
