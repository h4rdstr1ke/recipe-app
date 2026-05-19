import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '' /*`http://${window.location.hostname}:5297`*/,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    },
    withCredentials: true
});

// ==========================================
// НОВАЯ ЛОГИКА ОЧЕРЕДИ (Блокировка гонки)
// ==========================================
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// ==========================================

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

            // ЕСЛИ ТОКЕН УЖЕ ОБНОВЛЯЕТСЯ ДРУГИМ ЗАПРОСОМ:
            // Ставим текущий запрос в очередь ожидания
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest); // Повторяем запрос после получения токена
                }).catch(err => {
                    return Promise.reject(err);
                });
            }


            // ЕСЛИ МЫ ПЕРВЫЕ:
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.post('/auth/refresh', {}, {
                    baseURL: api.defaults.baseURL,
                    withCredentials: true
                });

                const newToken = refreshResponse.data.token || refreshResponse.data.accessToken;

                if (newToken) {
                    useAuthStore.getState().refreshTokenSuccess(newToken);

                    processQueue(null, newToken);

                    // Повторяем наш оригинальный запрос
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Если refresh-токен реально протух (например, прошел месяц)
                processQueue(refreshError, null); // Убиваем ждущие запросы
                console.error("Критическая ошибка авторизации. Сессия истекла.");
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            } finally {
                // В любом случае опускаем флаг
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);