import axios from "axios";

import { getAuthTokens } from "../utils/MyStorage/tokens/getAuthTokens";
import { setAuthTokens } from "../utils/MyStorage/tokens/setAuthTokens";
import { deleteAuthTokens } from "../utils/MyStorage/tokens/deleteAuthTokens";
import { getNewTokens } from "./services/auth/endpoints";

const apiInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Обработчик успешных запросов
apiInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthTokens();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.log("ошибка")
    Promise.reject(error);
  }
);

// Обработчик ошибок
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = getAuthTokens();

        if (refreshToken) {
          const data = await getNewTokens({ refreshToken });
          setAuthTokens(data.accessToken, data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiInstance(originalRequest);
        
      } catch (tokenError) {
        console.error("Не удалось обновить токены:", tokenError);
        deleteAuthTokens();
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiInstance;
