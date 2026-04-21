import { create } from 'zustand';
import type { Post, UserProfile } from '../types/index';
import { MOCK_POSTS, MOCK_USERS, MOCK_TOP_AUTHORS } from '../mocks/mocks';

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
    isLoading: false,
    error: null,

    fetchProfile: (userId) => {
        set({ isLoading: true, error: null });

        // В будущем: const response = await api.get(`/users/${userId}/profile`);
        const userBasic = Object.values(MOCK_USERS).find(u => u.id === userId);
        const userStats = MOCK_TOP_AUTHORS.find(a => a.id === userId);

        if (userBasic) {
            set({
                currentProfile: {
                    id: userBasic.id,
                    email: 'user@example.com',
                    nickname: userBasic.username,
                    name: userBasic.firstName,
                    avatarUrl: userBasic.authorAvatar,
                    bio: userBasic.bio || 'Описание профиля отсутствует',
                    subscribersCount: userStats?.subscribersCount || 0,
                    subscriptionsCount: userStats?.postsCount || 5,
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
        // В будущем: бэкенд может принимать массив ID или отдавать сохраненки по специальному роуту
        // например: await api.get(`/posts/favorites`, { params: { ids } });
        const filtered = MOCK_POSTS.filter(p => ids.includes(p.id));
        set({ favoritePosts: filtered });
    },

    clearProfileData: () => set({ currentProfile: null, userPosts: [], favoritePosts: [] })
}));