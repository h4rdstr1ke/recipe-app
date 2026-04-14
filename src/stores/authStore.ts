import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthStore {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Временные данные для регистрации
    tempData: {
        email: string;
        nickname: string;
        password?: string;
    } | null;

    // Действия
    sendVerificationCode: (email: string, nickname: string, password?: string) => Promise<boolean>;
    verifyCode: (code: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    // НОВАЯ ФУНКЦИЯ ДЛЯ РЕДАКТИРОВАНИЯ ПРОФИЛЯ
    updateProfile: (updatedData: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            tempData: null,

            sendVerificationCode: async (email, nickname, password) => {
                set({ isLoading: true, error: null });
                try {
                    // Имитация API
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log('Отправка кода на:', email);

                    set({ tempData: { email, nickname, password }, isLoading: false });
                    return true;
                } catch (error: unknown) {
                    set({ error: 'Ошибка отправки кода', isLoading: false });
                    return false;
                }
            },

            verifyCode: async (code) => {
                set({ isLoading: true, error: null });
                const { tempData } = get();

                try {
                    await new Promise(resolve => setTimeout(resolve, 500));

                    if (code !== '123456') throw new Error('Неверный код подтверждения');

                    const fakeUser: User = {
                        id: Date.now().toString(),
                        email: tempData!.email,
                        nickname: tempData!.nickname,
                        name: "Пользователь"
                    };
                    const fakeToken = 'fake-token-' + Date.now();

                    set({
                        user: fakeUser,
                        token: fakeToken,
                        isAuthenticated: true,
                        isLoading: false,
                        tempData: null
                    });
                    return true;
                } catch (error: unknown) {
                    set({
                        error: error instanceof Error ? error.message : 'Ошибка подтверждения',
                        isLoading: false
                    });
                    return false;
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    if (!email || !password) throw new Error('Заполните все поля');

                    const fakeUser: User = {
                        id: "user1", // <-- СТАВИМ ЖЕСТКО user1 (это vlad228 из моков)
                        email: "admin@example.com",
                        nickname: "vlad228",
                        name: "Владислав"
                    };
                    const fakeToken = 'fake-token-' + Date.now();

                    set({
                        user: fakeUser,
                        token: fakeToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                    return true;
                } catch (error: unknown) {
                    set({
                        error: error instanceof Error ? error.message : 'Ошибка входа',
                        isLoading: false
                    });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false, error: null, tempData: null });
            },

            clearError: () => set({ error: null }),

            // НОВАЯ ФУНКЦИЯ
            updateProfile: (updatedData) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, ...updatedData } });
                }
            },
        }),
        {
            name: 'auth_storage',

            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);