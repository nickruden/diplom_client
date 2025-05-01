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

export const getEventsByCategory = async (slug) => {
  const response = await apiInstance.get(`/events/category/${slug}`);
  return response.data;
};

export const createEvent = async (data) => {
  const response = await apiInstance.post(`/events/create`, data);
  return response.data;
};

export const updateEvent = async (id, data) => {
  console.log(id, data)
  const response = await apiInstance.patch(`/events/edit/${id}`, data);
  return response.data;
};

export const delereEvent = async (id) => {
  console.log(id)
  const response = await apiInstance.delete(`/events/delete/${id}`);
  return response.data;
};

export const deleteImage = async (publicId) => {
  console.log("deleteImage publicId:", publicId);
  const response = await apiInstance.delete(`/events/image/delete/${publicId}`);
  return response.data;
};
