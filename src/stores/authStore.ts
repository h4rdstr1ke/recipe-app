import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/index';
import { api } from '../api/api';
import axios from 'axios';

// Структукра JWT токена
interface TokenPayload {
    sub?: string;
    id?: string;
    name?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    tempData: {
        email: string;
        nickname: string;
        password?: string;
    } | null;

    /** Вычисляемый метод: проверяет, авторизован ли пользователь (есть ли токен) */
    isAuthenticated: () => boolean;

    /** Запрашивает код подтверждения на email при регистрации */
    sendVerificationCode: (email: string, nickname: string, password?: string) => Promise<boolean>;
    /** Отправляет код подтверждения и завершает регистрацию, после чего сразу логинит */
    verifyCode: (code: string) => Promise<boolean>;
    /** Авторизация пользователя по email и паролю */
    login: (email: string, password: string) => Promise<boolean>;
    /** Выход из аккаунта и полная очистка сессии */
    logout: () => void;
    /** Сброс текста ошибки */
    clearError: () => void;
    /** Обновление данных профиля (имя, био, аватар) */
    updateProfile: (updatedData: Partial<User> & { avatarFile?: File | null }) => Promise<boolean>;
    /** Запрашивает свежие данные текущего юзера с сервера (синхронизация) */
    fetchAuthUser: () => Promise<void>;

    refreshTokenSuccess: (newToken: string) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            tempData: null,

            // функция. Она всегда вернет актуальный статус.
            isAuthenticated: () => !!get().token,

            sendVerificationCode: async (email, nickname, password) => {
                set({ isLoading: true, error: null });
                try {
                    await api.post('/auth/register/email-code', { Email: email });
                    set({ tempData: { email, nickname, password }, isLoading: false });
                    return true;
                } catch (error: unknown) {
                    set({ error: 'Ошибка отправки кода', isLoading: false });
                    return false;
                }
            },

            verifyCode: async (code) => {
                set({ isLoading: true, error: null });
                const { tempData, login } = get();

                try {
                    if (!tempData) throw new Error('Нет данных для регистрации');

                    const formData = new FormData();
                    formData.append('UserName', tempData.nickname);
                    formData.append('Email', tempData.email);
                    formData.append('Name', tempData.nickname);
                    formData.append('Password', tempData.password || '');
                    formData.append('ConfirmPassword', tempData.password || '');
                    formData.append('EmailVerificationCode', code);

                    await api.post('/auth/register', formData);

                    // Сразу логиним юзера после успешной регистрации
                    return await login(tempData.email, tempData.password || '');
                } catch (error: unknown) {
                    let errorMessage = 'Ошибка регистрации';
                    if (axios.isAxiosError(error) && error.response?.data?.errors?.EmailVerificationCode) {
                        errorMessage = error.response.data.errors.EmailVerificationCode[0];
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    set({ error: errorMessage, isLoading: false });
                    return false;
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const token = response.data.token || response.data.accessToken;

                    const decodedToken = jwtDecode<TokenPayload>(token);

                    const id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decodedToken.sub || decodedToken.id || '';
                    const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decodedToken.name || email.split('@')[0];

                    set({ user: { id, email, nickname: name, name }, token, isLoading: false });
                    return true;
                } catch (error: unknown) {
                    set({ error: 'Неверный логин или пароль', isLoading: false });
                    return false;
                }
            },

            fetchAuthUser: async () => {
                const { user, isAuthenticated } = get();
                if (!isAuthenticated() || !user?.id) return;

                try {
                    const response = await api.get(`/api/users/${user.id}`);
                    const freshData = response.data;

                    set({
                        user: {
                            ...user,
                            nickname: freshData.userName || user.nickname,
                            name: freshData.name || user.name,
                            avatarUrl: freshData.avatarUrl || null
                        }
                    });
                } catch (error) {
                    console.error("Ошибка загрузки данных текущего пользователя", error);
                }
            },

            logout: () => set({ user: null, token: null, error: null, tempData: null }),

            clearError: () => set({ error: null }),

            updateProfile: async (updatedData) => {
                set({ isLoading: true, error: null });
                try {
                    const formData = new FormData();

                    if (updatedData.nickname) formData.append('UserName', updatedData.nickname);
                    if (updatedData.name) formData.append('Name', updatedData.name);
                    if (updatedData.bio !== undefined) formData.append('Description', updatedData.bio);
                    if (updatedData.avatarFile) formData.append('Avatar', updatedData.avatarFile);

                    await api.patch('/auth/profile', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    // логика обновления аватара и имени в `fetchAuthUser`
                    await get().fetchAuthUser();

                    set({ isLoading: false });
                    return true;
                } catch (error: unknown) {
                    console.error("Ошибка обновления профиля", error);
                    set({ error: 'Ошибка обновления профиля', isLoading: false });
                    return false;
                }
            },
            refreshTokenSuccess: (newToken) => {
                try {
                    const decodedToken = jwtDecode<TokenPayload>(newToken);

                    const id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decodedToken.sub || decodedToken.id || '';
                    const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decodedToken.name || '';
                    const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';

                    // Обновляем и токен, и юзера централизованно!
                    set({
                        token: newToken,
                        user: { id, email, nickname: name, name }
                    });
                } catch (error) {
                    console.error("Ошибка расшифровки токена при обновлении", error);
                }
            },
        }),

        {
            name: 'auth_storage',
            // В LocalStorage сохраняем ТОЛЬКО токен и базовые данные юзера. 
            // isAuthenticated больше не кэшируется, что защищает от рассинхрона.
            partialize: (state) => ({
                user: state.user,
                token: state.token
            }),
        }
    )
);