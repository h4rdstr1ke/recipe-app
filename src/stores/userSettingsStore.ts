import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '../types/index';
import { MOCK_USER_SETTINGS } from '../mocks/mocks';

/**
 * Хранилище личных настроек текущего пользователя (аллергены, подписки, закладки).
 * Автоматически синхронизирует состояние `settings` с localStorage браузера.
 */
interface UserSettingsStore {
    /** * Текущие настройки пользователя. 
     * Может быть null, пока данные не загружены с сервера или из кэша. 
     */
    settings: UserSettings | null;
    /** Индикатор загрузки данных по сети */
    isLoading: boolean;
    /** Текст ошибки, если запрос завершился неудачно */
    error: string | null;

    /**
     * Загружает настройки пользователя с сервера.
     * Если данные уже восстановлены из localStorage, повторный сетевой запрос не делается.
     */
    fetchSettings: () => Promise<void>;

    /**
     * Перезаписывает настройки пользователя (например, при редактировании профиля).
     * @param settings - Полный объект новых настроек
     */
    updateSettings: (settings: UserSettings) => Promise<void>;

    /**
     * Подписывает текущего пользователя на автора или отписывает от него.
     * Выполняется оптимистично: UI обновляется мгновенно, до ответа сервера.
     * @param authorId - ID целевого автора (пользователя)
     */
    toggleSubscription: (authorId: string) => Promise<void>;

    /**
     * Вспомогательная функция для UI: проверяет, есть ли подписка на автора.
     * @param authorId - ID проверяемого автора
     * @returns `true`, если подписка есть, иначе `false`
     */
    isSubscribed: (authorId: string) => boolean;

    /**
     * Добавляет или удаляет публикацию из списка оцененных (лайкнутых) постов.
     * Выполняется оптимистично.
     * @param postId - ID оцениваемой публикации
     */
    toggleLike: (postId: string) => Promise<void>;

    /**
     * Добавляет или удаляет публикацию из личных закладок пользователя.
     * Выполняется оптимистично.
     * @param postId - ID сохраняемой публикации
     */
    toggleFavorite: (postId: string) => Promise<void>;

    /** Сбрасывает состояние ошибки в null */
    clearError: () => void;
}

export const useUserSettingsStore = create<UserSettingsStore>()(
    persist(
        (set, get) => ({
            settings: null,
            isLoading: false,
            error: null,

            fetchSettings: async () => {
                if (get().settings) return;

                set({ isLoading: true, error: null });

                try {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    // В будущем: const response = await api.get('/user/settings');
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
                    // В будущем: await api.put('/user/settings', settings);
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

                set({ settings: { ...settings, subscriptions: newSubs } });

                try {
                    // В будущем:
                    // if (isSubbed) await api.delete(`/users/${authorId}/subscribe`);
                    // else await api.post(`/users/${authorId}/subscribe`);
                    console.log(isSubbed ? 'Отписался от:' : 'Подписался на:', authorId);
                } catch (error) {
                    set({ settings, error: 'Ошибка изменения подписки' });
                }
            },

            isSubscribed: (authorId) => {
                const { settings } = get();
                return settings?.subscriptions.includes(authorId) || false;
            },

            toggleLike: async (postId) => {
                const { settings } = get();
                if (!settings || !postId) return;

                const isLiked = settings.likedPosts.includes(postId);
                const newLiked = isLiked
                    ? settings.likedPosts.filter(id => id !== postId)
                    : [...settings.likedPosts, postId];

                set({ settings: { ...settings, likedPosts: newLiked } });

                try {
                    // В будущем: API запрос
                    console.log(isLiked ? 'Убран лайк:' : 'Лайкнут пост:', postId);
                } catch (error) {
                    set({ settings, error: 'Ошибка изменения лайка' });
                }
            },

            toggleFavorite: async (postId) => {
                const { settings } = get();
                if (!settings || !postId) return;

                const isFavorited = settings.favoritePosts.includes(postId);
                const newFavs = isFavorited
                    ? settings.favoritePosts.filter(id => id !== postId)
                    : [...settings.favoritePosts, postId];

                set({ settings: { ...settings, favoritePosts: newFavs } });

                try {
                    // В будущем: API запрос
                    console.log(isFavorited ? 'Убрано из избранного:' : 'Добавлено в избранное:', postId);
                } catch (error) {
                    set({ settings, error: 'Ошибка изменения избранного' });
                }
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'user_settings',
            partialize: (state) => ({ settings: state.settings }),
        }
    )
);