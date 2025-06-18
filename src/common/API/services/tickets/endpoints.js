import apiInstance from "../../instance";

export const getTicketsByEvent = async (id) => {
  const response = await apiInstance.get(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (id, data) => {
  const response = await apiInstance.post(`/tickets/${id}`, data);
  return response.data;
};

export const updateTicket = async (id, data) => {
  const response = await apiInstance.patch(`/tickets/${id}`, data);
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await apiInstance.delete(`/tickets/${id}`);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await apiInstance.get(`/user/my-tickets`);
  return response.data;
};

export const refundTickets = async (id) => {
  const response = await apiInstance.delete(`/tickets/${id}/refund`);
  return response.data;
};
