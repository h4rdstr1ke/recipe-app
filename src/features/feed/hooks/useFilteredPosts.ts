import { useMemo } from 'react';
import { usePostStore } from '../../../stores/postStore';
import { useSearchStore } from '../../../stores/searchStore';
import { useUserSettingsStore } from '../../../stores/userSettingsStore';

const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr.includes('Время не указано')) return 0;

    // Если бэкенд возвращает строку вида "01:15:00" (TimeSpan из C#)
    if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            const hours = parseInt(parts[0], 10) || 0;
            const minutes = parseInt(parts[1], 10) || 0;
            return hours * 60 + minutes; // Переводим всё в чистые минуты
        }
    }

    // Текстовый парсер на случай строк вида "30 мин"
    const lowerStr = timeStr.toLowerCase();
    const match = lowerStr.match(/\d+/);
    if (!match) return 0;
    const amount = parseInt(match[0], 10);
    if (lowerStr.includes('мин')) return amount;
    if (lowerStr.includes('час')) return amount * 60;
    return amount;
};

export const useFilteredPosts = () => {
    const { posts } = usePostStore();
    const { query, sortBy, filters, excludeAllergens, includedIngredients, excludedIngredients } = useSearchStore();
    const { settings } = useUserSettingsStore();

    const filteredAndSortedPosts = useMemo(() => {
        let result = [...posts];

        // --- ПОИСК ПО ТЕКСТУ ---
        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(post =>
                post.title.toLowerCase().includes(lowerQuery) ||
                post.description.toLowerCase().includes(lowerQuery)
            );
        }

        // --- ИСКЛЮЧЕНИЕ АЛЛЕРГЕНОВ ---
        if (excludeAllergens && settings?.allergens?.length) {
            result = result.filter(post => {
                const hasAllergen = post.products?.some(product =>
                    settings.allergens.some(allergen => allergen.id === product.id)
                );
                return !hasAllergen;
            });
        }

        // --- ИСКАТЬ ТОЛЬКО С ЭТИМИ ПРОДУКТАМИ ---
        if (includedIngredients?.length > 0) {
            result = result.filter(post =>
                includedIngredients.every(incItem =>
                    post.products?.some(product => product.id === incItem.id)
                )
            );
        }

        // --- ИСКЛЮЧИТЬ ЭТИ ПРОДУКТЫ ---
        if (excludedIngredients?.length > 0) {
            result = result.filter(post =>
                !excludedIngredients.some(excItem =>
                    post.products?.some(product => product.id === excItem.id)
                )
            );
        }

        // --- ФИЛЬТРЫ ИЗ МОДАЛКИ ---
        const mealFilters = filters['Тип приема пищи'];
        if (mealFilters && mealFilters.length > 0) {
            result = result.filter(post => mealFilters.includes(post.mealType));
        }

        const dishFilters = filters['Тип блюда'];
        if (dishFilters && dishFilters.length > 0) {
            result = result.filter(post => dishFilters.includes(post.dishType));
        }

        if (filters['Время приготовления'] && filters['Время приготовления'].length > 0) {
            result = result.filter(post => {
                const minutes = parseTimeToMinutes(post.timeCooking);
                return filters['Время приготовления'].some(filterItem => {
                    if (filterItem === 'До 15 минут') return minutes <= 15;
                    if (filterItem === 'До 30 минут') return minutes <= 30;
                    if (filterItem === 'До 45 минут') return minutes <= 45;
                    if (filterItem === 'До 60 минут') return minutes <= 60;
                    if (filterItem === 'Более часа') return minutes > 60;
                    return false;
                });
            });
        }

        if (filters['Калорийность на 100г.'] && filters['Калорийность на 100г.'].length > 0) {
            result = result.filter(post => {
                const cal = post.nutrition?.calories || 0;
                return filters['Калорийность на 100г.'].some(filterItem => {
                    if (filterItem === 'До 200 кКал') return cal <= 200;
                    if (filterItem === '200 - 400 кКал') return cal > 200 && cal <= 400;
                    if (filterItem === '400 - 600 кКал') return cal > 400 && cal <= 600;
                    if (filterItem === '600 - 800 кКал') return cal > 600 && cal <= 800;
                    if (filterItem === 'Более 800 кКал') return cal > 800;
                    return false;
                });
            });
        }

        // --- СОРТИРОВКА ---
        if (sortBy === 'new') {
            result.sort((a, b) => {
                const dateA = new Date(a.date.split('.').reverse().join('-')).getTime();
                const dateB = new Date(b.date.split('.').reverse().join('-')).getTime();
                return dateB - dateA;
            });
        } else if (sortBy === 'popular') {
            result.sort((a, b) => b.likesCount - a.likesCount);
        } else if (sortBy === 'rating') {
            result.sort((a, b) => (b.rating?.rating || 0) - (a.rating?.rating || 0));
        }

        return result;
    }, [posts, query, sortBy, filters, excludeAllergens, settings, includedIngredients, excludedIngredients]);

    return filteredAndSortedPosts;
};