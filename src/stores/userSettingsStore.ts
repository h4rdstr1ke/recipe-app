// Для персональных настроек в личном кабинете
import { create } from 'zustand';

export interface UserSettings {
    allergens: string[];    // ['молоко', 'глютен', 'орехи']
    unwanted: string[];     // ['мясо', 'чеснок', 'сахар']
}

interface UserSettingsStore {
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: UserSettings) => Promise<void>;
    clearError: () => void;
}

export const useUserSettingsStore = create<UserSettingsStore>((set, _get) => ({
    settings: null,
    isLoading: false,
    error: null,

    fetchSettings: async () => {
        set({ isLoading: true });

        try {
            // API запрос
            // const response = await api.get('/user/settings');

            // Временные тестовые данные 
            const mockSettings: UserSettings = {
                allergens: ['молоко', 'орехи'],
                unwanted: ['чеснок', 'острое']
            };

            // Имитация задержки
            await new Promise(resolve => setTimeout(resolve, 300));

            set({ settings: mockSettings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateSettings: async (settings) => {
        set({ isLoading: true });

        try {
            // API запрос
            // await api.put('/user/settings', settings);

            console.log('Сохранены настройки:', settings);
            set({ settings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    clearError: () => set({ error: null })
}));