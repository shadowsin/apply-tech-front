import axiosClient from "./axiosClient";

export const notificationApi = {
  getNotifications: () => axiosClient.get("notification"),
  updateNotification: (data) => axiosClient.put("notification", data),
  deleteNotification: () => axiosClient.delete("notification"),
  checkAll: () => axiosClient.put("notification/check-all"),
};
