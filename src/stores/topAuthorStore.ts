import { create } from 'zustand';
import type { TopAuthor } from '../types/index';
import { MOCK_TOP_AUTHORS } from '../mocks/mocks';

interface TopAuthorStore {
    authors: TopAuthor[];
    isLoading: boolean;
    error: string | null;

    fetchTopAuthors: () => Promise<void>;
    clearError: () => void;
}

export const useTopAuthorStore = create<TopAuthorStore>((set) => ({
    authors: [],
    isLoading: false,
    error: null,

    fetchTopAuthors: async () => {
        set({ isLoading: true, error: null });

        try {
            // Имитация сетевой задержки
            await new Promise(resolve => setTimeout(resolve, 600));

            // Сортируем моки по рейтингу (от большего к меньшему)
            const sortedMock = [...MOCK_TOP_AUTHORS].sort((a, b) => b.ratingScore - a.ratingScore);

            set({
                authors: sortedMock,
                isLoading: false
            });
        } catch (error: unknown) {
            set({
                error: error instanceof Error ? error.message : 'Ошибка загрузки топ-авторов',
                isLoading: false
            });
        }
    },

    clearError: () => set({ error: null })
}));