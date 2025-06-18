import apiInstance from "../../instance"

export const createPeyment = async (data) => {
    const response = await apiInstance.post('/payment/create', data);
    return response.data;
}

export const confirmPeyment = async (data) => {
    const response = await apiInstance.post('/payment/confirm', data);
    return response.data;
}

export const cancelPeyment = async (data) => {
    const response = await apiInstance.post('/payment/cancel', data);
    return response.data;
}

export const refundTickets = async (id) => {
    const response = await apiInstance.post(`/payment/return/${id}`);
    return response.data;
}