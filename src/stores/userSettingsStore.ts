import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '../types/index';
import { useAuthStore } from './authStore';
import { useProfileStore } from './profileStore';
import { api } from '../api/api';
import { usePostStore } from './postStore';
//import axios from 'axios';

interface UserSettingsStore {
    settings: UserSettings | null;
    isLoading: boolean;
    error: string | null;

    /** Загружает все настройки пользователя (лайки, закладки, подписки, аллергены). */
    fetchSettings: () => Promise<void>;
    /** Подписывает на автора или отписывает от него (оптимистичное обновление UI). */
    toggleSubscription: (authorId: string) => Promise<void>;
    /** Проверяет, подписан ли текущий пользователь на указанного автора. */
    isSubscribed: (authorId: string) => boolean;
    /** Ставит или убирает лайк с поста (оптимистичное обновление UI). */
    toggleLike: (postId: string) => Promise<void>;
    /** Добавляет или удаляет пост из закладок (оптимистичное обновление UI). */
    toggleFavorite: (postId: string) => Promise<void>;
    /** Сохраняет новый список аллергенов на сервере и обновляет стейт. */
    updateAllergens: (items: { id: string, title: string }[]) => Promise<void>;
    /** Сохраняет новый список нежелательных продуктов на сервере и обновляет стейт. */
    updateUnwanted: (items: { id: string, title: string }[]) => Promise<void>;
    /** Полная очистка настроек при выходе. */
    clearSettings: () => void;
    /** Очищает текст ошибки. */
    clearError: () => void;
}

export const useUserSettingsStore = create<UserSettingsStore>()(
    persist(
        (set, get) => ({
            settings: null,
            isLoading: false,
            error: null,

            fetchSettings: async () => {
                set({ isLoading: true, error: null });

                try {
                    const authState = useAuthStore.getState();
                    if (!authState.isAuthenticated || !authState.user?.id) {
                        set({ isLoading: false });
                        return;
                    }
                    const userId = authState.user.id;

                    // Запускаем все запросы независимо друг от друга
                    const results = await Promise.allSettled([
                        api.get('/api/recipes/liked'),
                        api.get('/api/recipes/favorites'),
                        api.get(`/api/users/${userId}/following`),
                        api.get('/api/allergens'),
                        api.get('/api/unwanted-ingredients')
                    ]);

                    // Функция-помощник: безопасно достает массив из успешного ответа
                    const extractData = (res: PromiseSettledResult<any>) =>
                        res.status === 'fulfilled' && res.value?.data ? res.value.data : [];

                    const likedData = extractData(results[0]);
                    const favsData = extractData(results[1]);
                    const subsData = extractData(results[2]);
                    const allergensData = extractData(results[3]);
                    const unwantedData = extractData(results[4]);

                    const newSettings: UserSettings = {
                        likedPosts: likedData.map((item: any) => typeof item === 'string' ? item : item.id),
                        favoritePosts: favsData.map((item: any) => typeof item === 'string' ? item : item.id),
                        subscriptions: subsData.map((item: any) => typeof item === 'string' ? item : item.id),
                        allergens: allergensData.map((item: any) => ({
                            id: item.id || item.ingredientId,
                            title: item.title || item.name
                        })),
                        unwanted: unwantedData.map((item: any) => ({
                            id: item.id || item.ingredientId,
                            title: item.title || item.name
                        }))
                    };

                    set({ settings: newSettings, isLoading: false });

                } catch (error: unknown) {
                    set({
                        error: error instanceof Error ? error.message : 'Ошибка загрузки настроек',
                        isLoading: false
                    });
                }
            },

            toggleSubscription: async (authorId) => {
                const { settings } = get();
                if (!settings || !authorId) return;

                const isSubbed = settings.subscriptions.includes(authorId);
                const amount = isSubbed ? -1 : 1;
                // Оптимистичное обновление
                set({
                    settings: {
                        ...settings,
                        subscriptions: isSubbed
                            ? settings.subscriptions.filter(id => id !== authorId)
                            : [...settings.subscriptions, authorId]
                    }
                });

                //Оптимистичное обновление профиля
                const profileStore = useProfileStore.getState();
                const currentProfile = profileStore.currentProfile;
                const myId = useAuthStore.getState().user?.id;

                if (currentProfile) {
                    // Сценарий А: Мы находимся на странице ЭТОГО автора (меняется число ЕГО подписчиков)
                    if (currentProfile.id === authorId) {
                        profileStore.updateCounters(amount, 'subscribers');
                    }
                    // Сценарий Б: Мы находимся в СВОЕМ профиле и отписываемся через модалку (меняется число НАШИХ подписок)
                    else if (currentProfile.id === myId) {
                        profileStore.updateCounters(amount, 'subscriptions');
                    }
                }

                try {
                    await api.put(`/api/users/${authorId}/subscription`, { isSubscribed: !isSubbed });
                } catch (error: unknown) {
                    // Умный откат: отменяем действие на базе САМОГО СВЕЖЕГО стейта
                    set(state => {
                        if (!state.settings) return state;
                        const currentSubs = state.settings.subscriptions;
                        return {
                            ...state,
                            settings: {
                                ...state.settings,
                                subscriptions: isSubbed
                                    ? [...currentSubs, authorId] // Возвращаем, если отписка упала
                                    : currentSubs.filter(id => id !== authorId) // Убираем, если подписка упала
                            },
                            error: 'Ошибка изменения подписки'
                        };
                    });
                    // Откат счетчиков
                    if (currentProfile) {
                        if (currentProfile.id === authorId) {
                            profileStore.updateCounters(-amount, 'subscribers');
                        } else if (currentProfile.id === myId) {
                            profileStore.updateCounters(-amount, 'subscriptions');
                        }
                    }
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

                // 1. Оптимистичное обновление массива лайков
                set({
                    settings: {
                        ...settings,
                        likedPosts: isLiked
                            ? settings.likedPosts.filter(id => id !== postId)
                            : [...settings.likedPosts, postId]
                    }
                });

                // 2. СРАЗУ синхронно обновляем счетчик в ленте
                usePostStore.getState().updateLikeCount(postId, !isLiked);

                try {
                    await api.put(`/api/recipes/${postId}/like`, { isLiked: !isLiked });
                    if (!isLiked) {
                        const userId = useAuthStore.getState().user?.id;
                        if (userId) {
                            api.post('/ai/api/recommendations/interactions', {
                                user_ids: [userId],
                                recipe_ids: [postId],
                                interactions: [{ user_id: userId, recipe_id: postId, rating: 5.0 }]
                            }).catch(err => console.log("ИИ пропустил лог лайка:", err));
                        }
                    }
                } catch (error: unknown) {
                    // Умный откат (если сервер ответил ошибкой)
                    set(state => {
                        if (!state.settings) return state;
                        const currentLikes = state.settings.likedPosts;
                        return {
                            ...state,
                            settings: {
                                ...state.settings,
                                likedPosts: isLiked
                                    ? [...currentLikes, postId]
                                    : currentLikes.filter(id => id !== postId)
                            },
                            error: 'Ошибка при постановке лайка'
                        };
                    });
                    // Откатываем счетчик обратно
                    usePostStore.getState().updateLikeCount(postId, isLiked);
                }
            },

            toggleFavorite: async (postId) => {
                const { settings } = get();
                if (!settings || !postId) return;

                const isFavorited = settings.favoritePosts.includes(postId);

                // 1. Оптимистичное обновление массива избранного
                set({
                    settings: {
                        ...settings,
                        favoritePosts: isFavorited
                            ? settings.favoritePosts.filter(id => id !== postId)
                            : [...settings.favoritePosts, postId]
                    }
                });

                // 2. СРАЗУ синхронно обновляем счетчик избранного
                usePostStore.getState().updateFavoriteCount(postId, !isFavorited);

                try {
                    await api.put(`/api/recipes/${postId}/favorite`, { isFavorite: !isFavorited });
                    if (!isFavorited) {
                        const userId = useAuthStore.getState().user?.id;
                        if (userId) {
                            api.post('/ai/api/recommendations/interactions', {
                                user_ids: [userId],
                                recipe_ids: [postId],
                                interactions: [{ user_id: userId, recipe_id: postId, rating: 5.0 }]
                            }).catch(err => console.log("ИИ пропустил лог закладки:", err));
                        }
                    }
                } catch (error: unknown) {
                    // Умный откат
                    set(state => {
                        if (!state.settings) return state;
                        const currentFavs = state.settings.favoritePosts;
                        return {
                            ...state,
                            settings: {
                                ...state.settings,
                                favoritePosts: isFavorited
                                    ? [...currentFavs, postId]
                                    : currentFavs.filter(id => id !== postId)
                            },
                            error: 'Ошибка при добавлении в избранное'
                        };
                    });
                    // Откатываем счетчик избранного обратно
                    usePostStore.getState().updateFavoriteCount(postId, isFavorited);
                }
            },

            updateAllergens: async (newItems) => {
                try {
                    await api.post('/api/allergens', { ingredientIds: newItems.map(a => a.id) });
                    await get().fetchSettings();
                } catch (error) {
                    set({ error: 'Ошибка обновления аллергенов' });
                }
            },

            updateUnwanted: async (newItems) => {
                try {
                    await api.post('/api/unwanted-ingredients', { ingredientIds: newItems.map(a => a.id) });
                    await get().fetchSettings();
                } catch (error) {
                    set({ error: 'Ошибка обновления нежелательных продуктов' });
                }
            },
            clearSettings: () => set({ settings: null, error: null, isLoading: false }),

            clearError: () => set({ error: null })
        }),
        {
            name: 'user_settings',
            partialize: (state) => ({ settings: state.settings }),
        }
    )
);