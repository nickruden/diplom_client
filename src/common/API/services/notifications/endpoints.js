import apiInstance from "../../instance";

export const getUserNotifications = async (id) => {
  const response = await apiInstance.get(`/notifications/${id}`);
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await apiInstance.post(`/notifications/${id}/read`);
  return response.data;
};