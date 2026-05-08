import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Интерцептор ЗАПРОСОВ (добавляем токен)
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Интерцептор ОТВЕТОВ (обрабатываем протухший токен)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post('/auth/refresh', {}, {
                    baseURL: api.defaults.baseURL,
                    withCredentials: true
                });

                const newToken = refreshResponse.data.token || refreshResponse.data.accessToken;

                if (newToken) {
                    useAuthStore.getState().refreshTokenSuccess(newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Критическая ошибка авторизации. Сессия истекла.");
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);