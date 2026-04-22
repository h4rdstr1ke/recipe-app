import { create } from 'zustand';

/**
 * Хранилище для управления глобальным поиском, фильтрами и сортировкой.
 */
interface SearchStore {
    // Поисковая строка
    query: string;
    setQuery: (query: string) => void;

    // Фильтры (чекбоксы)
    // Храним в виде объекта: { 'Тип блюда': ['Салаты', 'Супы'], 'Время приготовления': ['До 15 минут'] }
    filters: Record<string, string[]>;
    toggleFilter: (category: string, item: string) => void;
    clearFilters: () => void;

    // Тоггл "Исключить аллергены"
    excludeAllergens: boolean;
    setExcludeAllergens: (val: boolean) => void;

    // Сортировка
    sortBy: 'new' | 'popular' | 'rating' | null;
    setSortBy: (sort: 'new' | 'popular' | 'rating' | null) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
    query: '',
    setQuery: (query) => set({ query }),

    filters: {},

    toggleFilter: (category, item) => {
        const { filters } = get();
        const categoryFilters = filters[category] || [];

        const updatedCategoryFilters = categoryFilters.includes(item)
            ? categoryFilters.filter(i => i !== item)
            : [...categoryFilters, item];

        set({
            filters: { ...filters, [category]: updatedCategoryFilters }
        });
    },

    clearFilters: () => set({ filters: {}, excludeAllergens: false }),

    excludeAllergens: false,
    setExcludeAllergens: (val) => set({ excludeAllergens: val }),

    sortBy: null,
    setSortBy: (sort) => set({ sortBy: sort }),
}));