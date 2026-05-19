import { create } from 'zustand';

export interface IngredientItem {
    id: string;
    name: string;
}

interface SearchStore {
    query: string;
    setQuery: (query: string) => void;
    filters: Record<string, string[]>;
    toggleFilter: (category: string, item: string) => void;
    clearFilters: () => void;
    excludeAllergens: boolean;
    setExcludeAllergens: (val: boolean) => void;
    sortBy: 'new' | 'popular' | 'rating' | null;
    setSortBy: (sort: 'new' | 'popular' | 'rating' | null) => void;

    includedIngredients: IngredientItem[];
    excludedIngredients: IngredientItem[];

    // МЕТОД ДЛЯ ПРИМЕНЕНИЯ ВСЕХ ФИЛЬТРОВ СРАЗУ
    setAllFilters: (data: {
        filters: Record<string, string[]>;
        excludeAllergens: boolean;
        includedIngredients: IngredientItem[];
        excludedIngredients: IngredientItem[];
    }) => void;
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
        set({ filters: { ...filters, [category]: updatedCategoryFilters } });
    },
    clearFilters: () => set({ filters: {}, excludeAllergens: false, includedIngredients: [], excludedIngredients: [] }),
    excludeAllergens: false,
    setExcludeAllergens: (val) => set({ excludeAllergens: val }),
    sortBy: null,
    setSortBy: (sort) => set({ sortBy: sort }),

    includedIngredients: [],
    excludedIngredients: [],

    setAllFilters: (data) => set({
        filters: data.filters,
        excludeAllergens: data.excludeAllergens,
        includedIngredients: data.includedIngredients,
        excludedIngredients: data.excludedIngredients
    })
}));