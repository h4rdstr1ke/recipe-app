import { create } from 'zustand';
import type { TopAuthor } from '../types/index';
import { api } from '../api/api';

interface TopAuthorStore {
    authors: TopAuthor[];
    isLoading: boolean;
    error: string | null;

    /** Загружает топ авторов с сервера, отсортированных по рейтингу */
    fetchTopAuthors: () => Promise<void>;
    /** Сбрасывает текст ошибки */
    clearError: () => void;
}

export const useTopAuthorStore = create<TopAuthorStore>((set) => ({
    authors: [],
    isLoading: false,
    error: null,

    fetchTopAuthors: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get('/api/users/rating/top');

            const mappedAuthors: TopAuthor[] = response.data.map((author: any) => ({
                id: author.id,
                nickname: author.userName || 'Неизвестный',
                avatarUrl: author.avatarUrl || null,
                ratingScore: author.rating || author.ratingScore || author.score || 0,
                subscribersCount: author.subscribersCount || author.followersCount || 0,
                recipesCount: author.recipesCount || 0
            }));

            set({ authors: mappedAuthors, isLoading: false });
        } catch (error: unknown) {
            console.error("Ошибка при загрузке топа авторов:", error);
            set({ error: 'Ошибка загрузки топ-авторов', isLoading: false });
        }
    },

    clearError: () => set({ error: null })
}));