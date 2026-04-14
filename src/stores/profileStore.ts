import { create } from 'zustand';
import type { Post, UserProfile } from '../types/index';
import { MOCK_POSTS, MOCK_USERS, MOCK_TOP_AUTHORS } from '../mocks/mocks';

interface ProfileStore {
    currentProfile: UserProfile | null; // Данные человека, чей профиль открыт
    userPosts: Post[];                  // Его публикации
    favoritePosts: Post[];              // Его сохраненки (только если это МЫ)
    isLoading: boolean;
    error: string | null;

    // Загрузка данных профиля (имя, био, статы)
    fetchProfile: (userId: string) => void;
    // Загрузка постов автора
    fetchUserPosts: (authorId: string) => void;
    // Загрузка сохраненок по массиву ID
    fetchFavoritePosts: (ids: string[]) => void;
    // Очистка при уходе со страницы
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

        // Имитируем поиск пользователя в базе (MOCK_USERS)
        const userBasic = Object.values(MOCK_USERS).find(u => u.id === userId);
        // Имитируем поиск его статистики (MOCK_TOP_AUTHORS)
        const userStats = MOCK_TOP_AUTHORS.find(a => a.id === userId);

        if (userBasic) {
            set({
                currentProfile: {
                    id: userBasic.id,
                    email: 'user@example.com',
                    nickname: userBasic.username,
                    name: userBasic.firstName,
                    avatarUrl: userBasic.authorAvatar,
                    // берет bio из базы или ставит дефолт
                    bio: userBasic.bio || 'Описание профиля отсутствует',
                    subscribersCount: userStats?.subscribersCount || 0,
                    subscriptionsCount: userStats?.postsCount || 5, // Используем любые цифры из моков
                },
                isLoading: false
            });
        } else {
            set({ error: 'Пользователь не найден', isLoading: false, currentProfile: null });
        }
    },

    fetchUserPosts: (authorId) => {
        // Фильтруем общие моки по ID автора
        const filtered = MOCK_POSTS.filter(p => p.authorId === authorId);
        set({ userPosts: filtered });
    },

    fetchFavoritePosts: (ids) => {
        // Находим посты, ID которых есть в списке избранного
        const filtered = MOCK_POSTS.filter(p => ids.includes(p.id));
        set({ favoritePosts: filtered });
    },

    clearProfileData: () => set({ currentProfile: null, userPosts: [], favoritePosts: [] })
}));