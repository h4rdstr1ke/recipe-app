import { create } from 'zustand';
import type { Post, UserProfile, User } from '../types/index';
import { api } from '../api/api';
import axios from 'axios';
import { mapRecipeDtoToPost } from '../utils/mappers';

interface ProfileStore {
    currentProfile: UserProfile | null;
    userPosts: Post[];
    favoritePosts: Post[];
    subscribersList: User[];
    subscriptionsList: User[];
    isLoading: boolean;
    error: string | null;

    /** Загружает основную информацию о пользователе и его статистику. */
    fetchProfile: (userId: string) => Promise<void>;
    /** Загружает список публикаций, созданных указанным автором. */
    fetchUserPosts: (authorId: string) => Promise<void>;
    /** Загружает посты, добавленные в закладки. */
    fetchFavoritePosts: (ids: string[]) => Promise<void>;
    /** Загружает список подписчиков (КТО подписан на userId). */
    fetchSubscribersList: (userId: string) => Promise<void>;
    /** Загружает список подписок (на КОГО подписан userId). */
    fetchSubscriptionsList: (userId: string) => Promise<void>;
    /** Очищает данные профиля при размонтировании компонента. */
    clearProfileData: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
    currentProfile: null,
    userPosts: [],
    favoritePosts: [],
    subscribersList: [],
    subscriptionsList: [],
    isLoading: false,
    error: null,

    fetchProfile: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/api/users/${userId}`);
            const userData = response.data;

            set({
                currentProfile: {
                    id: userData.id || userId,
                    email: userData.email || '',
                    nickname: userData.userName || 'Неизвестно',
                    name: userData.name || '',
                    avatarUrl: userData.avatarUrl || null,
                    bio: userData.description || 'Описание профиля отсутствует.',
                    subscribersCount: userData.subscribersCount || userData.followersCount || 0,
                    subscriptionsCount: userData.subscriptionsCount || userData.followingCount || 0,
                },
                isLoading: false
            });
        } catch (err: unknown) {
            let errorMessage = 'Не удалось загрузить профиль';
            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.status === 404 ? 'Пользователь не найден.' : `Ошибка сервера: ${err.response?.status}`;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            set({ error: errorMessage, isLoading: false, currentProfile: null });
        }
    },

    fetchUserPosts: async (authorId) => {
        try {
            const response = await api.get(`/api/recipes/creator/${authorId}`);
            const recipes = Array.isArray(response.data) ? response.data : [];

            set({ userPosts: recipes.map(item => mapRecipeDtoToPost(item)) });
        } catch (error) {
            console.error("Ошибка загрузки публикаций пользователя", error);
            set({ userPosts: [] });
        }
    },

    fetchFavoritePosts: async (ids) => {
        if (!ids || ids.length === 0) {
            set({ favoritePosts: [] });
            return;
        }

        try {
            // Используем allSettled: он дождется завершения всех запросов (и успешных, и упавших).
            const responses = await Promise.allSettled(
                ids.map(id => api.get(`/api/recipes/${id}`))
            );

            // Собираем успешные результаты за один проход через reduce
            const mappedPosts = responses.reduce<Post[]>((acc, res) => {
                if (res.status === 'fulfilled' && res.value?.data) {
                    acc.push(mapRecipeDtoToPost(res.value.data));
                }
                return acc;
            }, []);

            set({ favoritePosts: mappedPosts });
        } catch (error) {
            console.error("Ошибка загрузки избранных публикаций", error);
            set({ favoritePosts: [] });
        }
    },

    fetchSubscribersList: async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}/followers`);
            const mappedUsers = response.data.map((u: any) => ({
                id: u.id,
                email: u.email || '',
                nickname: u.userName || 'Неизвестно',
                name: u.name || '',
                avatarUrl: u.avatarUrl || null
            }));
            set({ subscribersList: mappedUsers });
        } catch (error) {
            console.error("Ошибка загрузки подписчиков", error);
            set({ subscribersList: [] });
        }
    },

    fetchSubscriptionsList: async (userId) => {
        try {
            const response = await api.get(`/api/users/${userId}/following`);
            const mappedUsers = response.data.map((u: any) => ({
                id: u.id,
                email: u.email || '',
                nickname: u.userName || 'Неизвестно',
                name: u.name || '',
                avatarUrl: u.avatarUrl || null
            }));
            set({ subscriptionsList: mappedUsers });
        } catch (error) {
            console.error("Ошибка загрузки подписок", error);
            set({ subscriptionsList: [] });
        }
    },

    clearProfileData: () => set({
        currentProfile: null,
        userPosts: [],
        favoritePosts: [],
        subscribersList: [],
        subscriptionsList: []
    })
}));