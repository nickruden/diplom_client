import apiInstance from "../../instance";

export const getAllCategories = async () => {
    const response = await apiInstance.get(`/categories`);
    return response.data;
};
