import axiosClient from "./axiosClient";

export const payApi = {
  visaMethod: (amount) => axiosClient.post("payment/secret", { amount }),
  momoMethod: (amount) => axiosClient.post("payment/momo", { amount }),
};
