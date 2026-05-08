// utils/mappers.ts
import type { Post } from '../types/index';

/**
 * Преобразует DTO (объект от бэкенда) в интерфейс Post для фронтенда.
 * @param item - Объект рецепта, полученный от API.
 * @param overrideAvatar - Опциональная ссылка на аватар (если загружаем отдельным запросом).
 * @returns Готовый объект типа Post.
 */
export const mapRecipeDtoToPost = (item: any, overrideAvatar?: string | null, overrideUsername?: string): Post => ({
    id: item.id,
    authorId: item.creatorId || '',
    username: overrideUsername || item.creatorUserName || item.creatorName || 'Пользователь',
    name: item.creatorName || 'Пользователь',
    authorAvatar: overrideAvatar || item.creatorAvatar || null,
    title: item.title || 'Без названия',
    description: item.description || '',
    image: (item.images && item.images.length > 0) ? item.images[0].url : '',
    timeCooking: item.cookingTime || 'Время не указано',
    portions: item.portionsCount || 0,
    mealType: item.mealType || '',
    dishType: item.dishType || '',
    rating: {
        rating: item.averageRating || 0,
        quantity: item.ratingsCount || 0
    },
    likesCount: item.likesCount || 0,
    commentsCount: item.commentsCount || 0,
    favoritesCount: item.favoritesCount || 0,
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : '',
    products: (item.ingredients || []).map((ing: any) => ({
        id: ing.ingredientId,
        name: ing.ingredientTitle,
        weight: ing.weight
    })),
    steps: (item.steps || []).map((step: any, index: number) => ({
        stepNumber: step.order !== undefined ? step.order + 1 : index + 1,
        description: step.description || '',
        image: step.image?.url || '',
        timer: step.cookingTime || null
    }))
});