import apiInstance from "../../instance";

export const getTicketsByEvent = async (id) => {
  console.log(id)
  const response = await apiInstance.get(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (id, data) => {
  const response = await apiInstance.post(`/tickets/${id}`, data);
  return response.data;
};

export const updateTicket = async (id, data) => {
  console.log(id, data)
  const response = await apiInstance.patch(`/tickets/${id}`, data);
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await apiInstance.delete(`/tickets/${id}`);
  return response.data;
};

export const buyTickets = async (data) => {
  console.log(data)
  const response = await apiInstance.post(`/tickets/buy/ticket`, data);
  return response.data;
};
