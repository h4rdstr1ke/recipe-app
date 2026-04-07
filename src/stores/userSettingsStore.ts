// Для персональных настроек в личном кабинете
import { create } from 'zustand';

export interface UserSettings {
    allergens: string[];    // ['молоко', 'глютен', 'орехи']
    unwanted: string[];     // ['мясо', 'чеснок', 'сахар']
    subscriptions: string[]; // ID авторов, на которых подписан пользователь
}

interface UserSettingsStore {
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: UserSettings) => Promise<void>;

    // Действия для подписок
    subscribeToAuthor: (authorId: string) => Promise<void>;
    unsubscribeFromAuthor: (authorId: string) => Promise<void>;
    isSubscribed: (authorId: string) => boolean;

    clearError: () => void;
}

// Ключ для localStorage
const STORAGE_KEY = 'user_settings';

// Загрузка настроек из localStorage
/*
const loadFromStorage = (): UserSettings | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error);
    }
    return null;
};*/

// Сохранение в localStorage
const saveToStorage = (settings: UserSettings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
    }
};

export const useUserSettingsStore = create<UserSettingsStore>((set, get) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async () => {
        set({ isLoading: true });

        try {
            /*
            // Пробуем загрузить из localStorage
            const savedSettings = loadFromStorage();
                    if (savedSettings) {
                        set({ settings: savedSettings, isLoading: false });
                        return;
                    } */

            // Если в localStorage пусто - используем моковые данные
            const mockSettings: UserSettings = {
                allergens: ['молоко', 'орехи'],
                unwanted: ['чеснок', 'острое'],
                subscriptions: ['user1', 'user3'] // Начальные подписки
            };

            // Имитация задержки
            await new Promise(resolve => setTimeout(resolve, 300));

            set({ settings: mockSettings, isLoading: false });

            saveToStorage(mockSettings);
        } catch (error: any) {
            set({ error: error.message || 'Ошибка загрузки настроек', isLoading: false });
        }
    },

    updateSettings: async (settings) => {
        set({ isLoading: true });

        try {
            // API запрос 
            // await api.put('/user/settings', settings);

            console.log('Сохранены настройки:', settings);
            set({ settings, isLoading: false });
            saveToStorage(settings);
        } catch (error: any) {
            set({ error: error.message || 'Ошибка сохранения настроек', isLoading: false });
        }
    },

    // Подписаться на автора
    subscribeToAuthor: async (authorId: string) => {
        const { settings } = get();

        // Минимальная валидация
        if (!authorId) {
            console.log('Нет ID автора');
            return;
        }

        if (!settings) {
            console.log('Настройки не загружены');
            return;
        }

        // Проверка, не подписан ли уже
        if (settings.subscriptions.includes(authorId)) {
            console.log('Уже подписан на этого автора');
            return;
        }

        // Оптимистичное обновление
        const newSubscriptions = [...settings.subscriptions, authorId];
        const newSettings = { ...settings, subscriptions: newSubscriptions };

        set({ settings: newSettings });
        saveToStorage(newSettings);

        try {
            // API запрос 
            // await api.post(`/users/${authorId}/subscribe`);
            console.log('Подписался на автора:', authorId);
        } catch (error: any) {
            // Откат при ошибке
            set({ settings, error: error.message });
            saveToStorage(settings);
        }
    },

    // Отписаться от автора
    unsubscribeFromAuthor: async (authorId: string) => {
        const { settings } = get();

        if (!settings) return;

        // Проверка, подписан ли вообще
        if (!settings.subscriptions.includes(authorId)) {
            console.log('Не подписан на этого автора');
            return;
        }

        // Оптимистичное обновление
        const newSubscriptions = settings.subscriptions.filter(id => id !== authorId);
        const newSettings = { ...settings, subscriptions: newSubscriptions };

        set({ settings: newSettings });
        saveToStorage(newSettings);

        try {
            // API запрос
            // await api.delete(`/users/${authorId}/subscribe`);
            console.log('Отписался от автора:', authorId);
        } catch (error: any) {
            // Откат при ошибке
            set({ settings, error: error.message });
            saveToStorage(settings);
        }
    },

    // Проверка, подписан ли на автора
    isSubscribed: (authorId: string) => {
        const { settings } = get();
        return settings?.subscriptions.includes(authorId) || false;
    },

    clearError: () => set({ error: null })
}));