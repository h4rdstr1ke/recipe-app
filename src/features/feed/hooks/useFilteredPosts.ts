import { useMemo } from 'react';
import { usePostStore } from '../../../stores/postStore';
import { useSearchStore } from '../../../stores/searchStore';
import { useUserSettingsStore } from '../../../stores/userSettingsStore';

// Вспомогательная функция 
const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;

    const lowerStr = timeStr.toLowerCase();
    const match = lowerStr.match(/\d+/);
    if (!match) return 0;

    const amount = parseInt(match[0], 10);

    if (lowerStr.includes('мин')) return amount;
    if (lowerStr.includes('час')) return amount * 60;
    if (lowerStr.includes('дн') || lowerStr.includes('день')) return amount * 24 * 60;

    return amount;
};

/**
 * Кастомный хук для получения уже отфильтрованного и отсортированного списка постов.
 */
export const useFilteredPosts = () => {
    // Собираем данные из всех трех сторов в одном месте
    const { posts } = usePostStore();
    const { query, sortBy, filters, excludeAllergens } = useSearchStore();
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
                    settings.allergens.includes(product.name)
                );
                return !hasAllergen;
            });
        }

        // --- ФИЛЬТРЫ ИЗ МОДАЛКИ ---
        const textFilters = [...(filters['Тип блюда'] || []), ...(filters['Тип приема пищи'] || [])];
        if (textFilters.length > 0) {
            result = result.filter(post => {
                return textFilters.some(filterItem =>
                    post.title.toLowerCase().includes(filterItem.toLowerCase()) ||
                    post.description.toLowerCase().includes(filterItem.toLowerCase())
                );
            });
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
    }, [posts, query, sortBy, filters, excludeAllergens, settings]);

    // Хук просто возвращает готовый массив
    return filteredAndSortedPosts;
};