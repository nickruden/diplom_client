import apiInstance from "../../instance";

export const loginUser = async (body) => {
  const response = await apiInstance.post(`/auth/login`, body);
  return response.data;
};

export const registerUser = async (body) => {
  const response = await apiInstance.post(`/auth/register`, body);
  return response.data;
};

export const getNewTokens = async (body) => {
  const response = await apiInstance.post(`/auth/tokens/new`, body);
  return response.data;
};
