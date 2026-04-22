import { create } from 'zustand';
import type { Post, UserProfile, User } from '../types/index';
import { MOCK_POSTS, MOCK_USERS } from '../mocks/mocks'; // MOCK_TOP_AUTRHORS

/**
 * Хранилище для страницы профиля пользователя.
 * Управляет загрузкой данных как для "своего" профиля, так и для профилей других авторов.
 */
interface ProfileStore {
    /** Данные пользователя, чей профиль открыт в данный момент */
    currentProfile: UserProfile | null;
    /** Массив рецептов, созданных этим пользователем */
    userPosts: Post[];
    /** Массив сохраненных рецептов (заполняется только если мы смотрим свой собственный профиль) */
    favoritePosts: Post[];
    /** Массив пользователей, которые подписаны на текущий профиль */
    subscribersList: User[];
    /** Массив авторов, на которых подписан текущий профиль */
    subscriptionsList: User[];
    /** Индикатор загрузки данных по сети */
    isLoading: boolean;
    /** Текст ошибки, если профиль или данные не найдены */
    error: string | null;

    /**
     * Загружает основную информацию о пользователе (имя, био, аватар) и его статистику.
     * @param userId - ID пользователя, профиль которого нужно отобразить
     */
    fetchProfile: (userId: string) => void;

    /**
     * Загружает список публикаций, созданных указанным автором.
     * @param authorId - ID автора (обычно совпадает с currentProfile.id)
     */
    fetchUserPosts: (authorId: string) => void;

    /**
     * Загружает посты, добавленные в закладки. 
     * Принимает массив ID из личных настроек пользователя (UserSettings).
     * @param ids - Массив ID сохраненных постов
     */
    fetchFavoritePosts: (ids: string[]) => void;

    /** Загружает список подписчиков (КТО подписан на userId) */
    fetchSubscribersList: (userId: string) => Promise<void>;

    /** Загружает список подписок (на КОГО подписан userId) */
    fetchSubscriptionsList: (userId: string) => Promise<void>;

    /**
     * Очищает данные профиля.
     * Обязательно вызывать при размонтировании компонента (уходе со страницы), 
     * чтобы при открытии другого профиля не было мерцания старых данных.
     */
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

    fetchProfile: (userId) => {
        set({ isLoading: true, error: null });

        // В будущем: const response = await api.get(`/users/${userId}/profile`);
        const userBasic = Object.values(MOCK_USERS).find(u => u.id === userId);
        //const userStats = MOCK_TOP_AUTHORS.find(a => a.id === userId);

        if (userBasic) {
            set({
                currentProfile: {
                    id: userBasic.id,
                    email: 'user@example.com',
                    nickname: userBasic.username,
                    name: userBasic.firstName,
                    avatarUrl: userBasic.authorAvatar,
                    bio: userBasic.bio || 'Описание профиля отсутствует',
                    subscribersCount: Object.values(MOCK_USERS).filter(u =>
                        (u.subscriptions as readonly string[] | undefined)?.includes(userBasic.id)
                    ).length,
                    subscriptionsCount: userBasic.subscriptions?.length || 0,
                },
                isLoading: false
            });
        } else {
            set({ error: 'Пользователь не найден', isLoading: false, currentProfile: null });
        }
    },

    fetchUserPosts: (authorId) => {
        // В будущем: const response = await api.get(`/users/${authorId}/posts`);
        const filtered = MOCK_POSTS.filter(p => p.authorId === authorId);
        set({ userPosts: filtered });
    },

    fetchFavoritePosts: (ids) => {
        // await api.get(`/posts/favorites`, { params: { ids } });
        const filtered = MOCK_POSTS.filter(p => ids.includes(p.id));
        set({ favoritePosts: filtered });
    },

    fetchSubscribersList: async (userId) => {
        const allUsers = Object.values(MOCK_USERS);

        // ИСПРАВЛЕНИЕ TS: Используем readonly string[]
        const actualSubscribers = allUsers.filter(u =>
            (u.subscriptions as readonly string[] | undefined)?.includes(userId)
        );

        const mappedSubscribers = actualSubscribers.map(u => ({
            id: u.id,
            email: 'user@example.com',
            nickname: u.username,
            name: u.firstName,
            avatarUrl: u.authorAvatar
        }));
        set({ subscribersList: mappedSubscribers });
    },

    fetchSubscriptionsList: async (userId) => {
        const allUsers = Object.values(MOCK_USERS);
        const targetUser = allUsers.find(u => u.id === userId);

        const targetUserSubs = (targetUser?.subscriptions as readonly string[]) || [];

        const actualSubscriptions = allUsers.filter(u => targetUserSubs.includes(u.id));

        const mappedSubscriptions = actualSubscriptions.map(u => ({
            id: u.id,
            email: 'user@example.com',
            nickname: u.username,
            name: u.firstName,
            avatarUrl: u.authorAvatar
        }));
        set({ subscriptionsList: mappedSubscriptions });
    },

    clearProfileData: () => set({
        currentProfile: null,
        userPosts: [],
        favoritePosts: [],
        subscribersList: [],
        subscriptionsList: []
    })
}));