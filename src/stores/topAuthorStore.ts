import { create } from 'zustand';
import type { TopAuthor } from '../types/index';
import { MOCK_TOP_AUTHORS } from '../mocks/mocks';

/**
 * Хранилище для страницы/блока рейтинга авторов.
 */
interface TopAuthorStore {
    /** Массив авторов, отсортированный по убыванию рейтинга */
    authors: TopAuthor[];
    /** Индикатор загрузки данных рейтинга */
    isLoading: boolean;
    /** Сообщение об ошибке при сбое загрузки */
    error: string | null;

    /**
     * Загружает список авторов для доски почета.
     * Ожидается, что сортировка по `ratingScore` происходит на стороне бэкенда.
     */
    fetchTopAuthors: () => Promise<void>;

    /** Сбрасывает состояние ошибки */
    clearError: () => void;
}

export const useTopAuthorStore = create<TopAuthorStore>((set) => ({
    authors: [],
    isLoading: false,
    error: null,

    fetchTopAuthors: async () => {
        set({ isLoading: true, error: null });

        try {
            await new Promise(resolve => setTimeout(resolve, 600));

            // Сортировка на фронте (временное решение для моков). 
            // В будущем : await api.get('/authors/top');
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