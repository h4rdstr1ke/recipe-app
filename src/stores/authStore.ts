import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    nickname: string;
    name: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;

    // Временные данные для регистрации
    tempData: {
        email: string;
        nickname: string;
        password: string;
    } | null;

    // Действия
    initialize: () => void;
    sendVerificationCode: (email: string, nickname: string, password: string) => Promise<boolean>;
    verifyCode: (code: string) => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    tempData: null,
    isInitialized: false,
    // функция инициализации для того что бы при перезагрузке не выкидывало на страницу входа
    initialize: () => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                set({
                    user: user,
                    token: token,
                    isAuthenticated: true,
                    isInitialized: true
                });
            } catch (error) {
                // Если данные повреждены, просто очищаем
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ isInitialized: true });
            }
        } else {
            set({ isInitialized: true });
        }
    },

    // Отправка кода подтверждения
    sendVerificationCode: async (email, nickname, password) => {
        set({ isLoading: true, error: null });

        try {
            // Запрос к API (в будущем)
            console.log('Отправка кода на:', email);

            // Сохраняем временные данные
            set({
                tempData: { email, nickname, password },
                isLoading: false
            });

            // Для теста: всегда успешно
            return true;
        } catch (error: any) {
            set({
                error: error.message || 'Ошибка отправки кода',
                isLoading: false
            });
            return false;
        }
    },

    // Подтверждение кода
    verifyCode: async (code) => {
        set({ isLoading: true, error: null });

        const { tempData } = get();

        try {
            // Запрос к API (в будущем)

            // Для теста: код 123456
            if (code !== '123456') {
                throw new Error('Неверный код подтверждения');
            }

            // Создаем пользователя
            const fakeUser = {
                id: Date.now().toString(),
                email: tempData!.email,
                nickname: tempData!.nickname,
                name: "Пользователь"  // 👈 имя = "Пользователь"
            };

            const fakeToken = 'fake-token-' + Date.now();

            // Сохраняем в localStorage
            localStorage.setItem('token', fakeToken);
            localStorage.setItem('user', JSON.stringify(fakeUser));

            set({
                user: fakeUser,
                token: fakeToken,
                isAuthenticated: true,
                isLoading: false,
                tempData: null
            });

            return true;
        } catch (error: any) {
            set({
                error: error.message || 'Ошибка подтверждения',
                isLoading: false
            });
            return false;
        }
    },

    // Вход
    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            // Запрос к API (в будущем)

            // Простая валидация для теста
            if (!email || !password) {
                throw new Error('Заполните все поля');
            }

            const fakeUser = {
                id: Date.now().toString(),
                email: email,
                nickname: "vlad228",
                name: "Пользователь"
            };

            const fakeToken = 'fake-token-' + Date.now();

            localStorage.setItem('token', fakeToken);
            localStorage.setItem('user', JSON.stringify(fakeUser));

            set({
                user: fakeUser,
                token: fakeToken,
                isAuthenticated: true,
                isLoading: false
            });

            return true;
        } catch (error: any) {
            set({
                error: error.message || 'Ошибка входа',
                isLoading: false
            });
            return false;
        }
    },

    // Выход
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
            tempData: null
        });
    },

    clearError: () => set({ error: null })
}));