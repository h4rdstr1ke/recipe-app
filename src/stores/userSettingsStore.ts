import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '../types/index';
import { MOCK_USER_SETTINGS } from '../mocks/mocks';

interface UserSettingsStore {
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;

    // Действия
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: UserSettings) => Promise<void>;
    toggleSubscription: (authorId: string) => Promise<void>;
    isSubscribed: (authorId: string) => boolean;
    clearError: () => void;
}

export const useUserSettingsStore = create<UserSettingsStore>()(
    persist(
        (set, get) => ({
            settings: null,
            isLoading: false,
            error: null,

            fetchSettings: async () => {
                // Если настройки уже загружены из кэша (благодаря persist), не делаем лишний запрос
                if (get().settings) return;

                set({ isLoading: true, error: null });

                try {
                    // Имитация API
                    await new Promise(resolve => setTimeout(resolve, 300));
                    set({ settings: MOCK_USER_SETTINGS, isLoading: false });
                } catch (error: unknown) {
                    set({
                        error: error instanceof Error ? error.message : 'Ошибка загрузки настроек',
                        isLoading: false
                    });
                }
            },

            updateSettings: async (settings) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: API запрос await api.put('/user/settings', settings);
                    set({ settings, isLoading: false });
                } catch (error: unknown) {
                    set({ error: 'Ошибка сохранения настроек', isLoading: false });
                }
            },

            toggleSubscription: async (authorId) => {
                const { settings } = get();
                if (!settings || !authorId) return;

                const isSubbed = settings.subscriptions.includes(authorId);
                const newSubs = isSubbed
                    ? settings.subscriptions.filter(id => id !== authorId)
                    : [...settings.subscriptions, authorId];

                // Оптимистичное обновление UI (persist сам сохранит в localStorage)
                set({ settings: { ...settings, subscriptions: newSubs } });

                try {
                    // API запрос:
                    // if (isSubbed) await api.delete(`/users/${authorId}/subscribe`);
                    // else await api.post(`/users/${authorId}/subscribe`);
                    console.log(isSubbed ? 'Отписался от:' : 'Подписался на:', authorId);
                } catch (error) {
                    // Откат при ошибке сети
                    set({ settings, error: 'Ошибка изменения подписки' });
                }
            },

            isSubscribed: (authorId) => {
                const { settings } = get();
                return settings?.subscriptions.includes(authorId) || false;
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'user_settings', // Ключ в localStorage
            // Указываем, что сохранять нужно только сами настройки, а статус загрузки и ошибки сбрасывать
            partialize: (state) => ({ settings: state.settings }),
        }
    )
);