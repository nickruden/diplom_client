import apiInstance from "../../instance";

export const getAllEvents = async (filters) => {
  const response = await apiInstance.get(`/events`, { params: filters });
  return response.data;
};

export const getEventById = async (id) => {
  const response = await apiInstance.get(`/events/${id}`);
  return response.data;
};

export const getEventsByCreator = async (id, filter) => {
  const response = await apiInstance.get(`/events/creator/${id}`, { params: { filter } });
  return response.data;
};

export const getEventsByCategory = async (slug, filters) => {
  const response = await apiInstance.get(`/events/category/${slug}`, { params: filters });
  return response.data;
};

export const createEvent = async (data) => {
  const response = await apiInstance.post(`/events/create`, data);
  return response.data;
};

export const updateEvent = async (id, data) => {
  const response = await apiInstance.patch(`/events/edit/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id, data) => {
  const response = await apiInstance.delete(`/events/delete/${id}?realyDel=${data.realyDel}`);
  return response.data;
};

export const deleteImage = async (publicId) => {
  const response = await apiInstance.delete(`/events/image/delete/${publicId}`);
  return response.data;
};

export const getMyFavoriteEvents = async () => {
  const response = await apiInstance.get(`/user/my-favorite-events`);
  return response.data;
};

export const favoritedEvent = async (id) => {
  const response = await apiInstance.post(`/events/set-favorite/${id}`);
  return response.data;
};

export const unsetFavoriteEvent = async (id) => {
  const response = await apiInstance.delete(`/events/unset-favorite/${id}`);
  return response.data;
};
export const getFavoriteEventsInfo = async () => {
  const response = await apiInstance.get(`/events/favorite-events/info`);
  return response.data;
};

export const getEventPuchases = async (id) => {
  const response = await apiInstance.get(`/events/puchases/${id}`);
  return response.data;
};
