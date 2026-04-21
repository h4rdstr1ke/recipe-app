import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

/**
 * Хранилище для управления авторизацией, регистрацией и сессией пользователя.
 * Частично сохраняется в localStorage (токен и базовые данные юзера).
 */
interface AuthStore {
    /** Данные авторизованного пользователя. Сбрасываются в null при выходе. */
    user: User | null;
    /** JWT токен для доступа к защищенным API-методам */
    token: string | null;
    /** Индикатор загрузки при сетевых запросах авторизации */
    isLoading: boolean;
    /** Сообщение об ошибке (например, "Неверный пароль") */
    error: string | null;
    /** Флаг состояния: вошел ли пользователь в систему */
    isAuthenticated: boolean;

    /** * Временное хранилище данных при регистрации. 
     * Данные лежат здесь между шагом 1 (ввод email/пароля) и шагом 2 (ввод кода из письма).
     */
    tempData: {
        email: string;
        nickname: string;
        password?: string;
    } | null;

    /**
     * Шаг 1 (Регистрация): Отправляет проверочный код на указанный email.
     * Сохраняет введенные данные во временный стейт (`tempData`).
     * @param email - Почта пользователя
     * @param nickname - Желаемый никнейм
     * @param password - Придуманный пароль
     * @returns `true`, если запрос успешен, иначе `false`
     */
    sendVerificationCode: (email: string, nickname: string, password?: string) => Promise<boolean>;

    /**
     * Шаг 2 (Регистрация): Проверяет код подтверждения. 
     * Если код верный, берет данные из `tempData`, "регистрирует" юзера и авторизует его.
     * @param code - Код из письма (в моках: '123456')
     * @returns `true` при успешной проверке, иначе `false`
     */
    verifyCode: (code: string) => Promise<boolean>;

    /**
     * Стандартный вход по email и паролю.
     * @param email - Почта пользователя
     * @param password - Пароль
     * @returns `true` при успешном входе, иначе `false`
     */
    login: (email: string, password: string) => Promise<boolean>;

    /**
     * Выход из аккаунта. 
     * Очищает стейт и удаляет данные сессии из localStorage.
     */
    logout: () => void;

    /** Сбрасывает состояние ошибки в null (например, при начале нового ввода формы) */
    clearError: () => void;

    /**
     * Локально обновляет данные профиля текущего пользователя (имя, био).
     * @param updatedData - Объект с новыми полями пользователя
     */
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
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log('Отправка кода на:', email);

                    // В будущем: await api.post('/auth/send-code', { email })
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

                    // В будущем: const response = await api.post('/auth/verify-and-register', { code, ...tempData })
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

                    // В будущем: const response = await api.post('/auth/login', { email, password })
                    if (!email || !password) throw new Error('Заполните все поля');

                    const fakeUser: User = {
                        id: "user1",
                        email: "admin@example.com",
                        nickname: "vlad228",
                        name: "Владислав",
                        bio: "Привет! Я Влад, люблю готовить стейки и делиться рецептами!"
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

            updateProfile: (updatedData) => {
                const { user } = get();
                if (user) {
                    // Обновляем только те поля, которые были переданы
                    set({ user: { ...user, ...updatedData } });
                }
            },
        }),
        {
            name: 'auth_storage', // Ключ в localStorage
            // partialize гарантирует, что мы не сохраним в localStorage временные ошибки или статус загрузки
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);