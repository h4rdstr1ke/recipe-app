import { create } from 'zustand';
import type { Post } from '../types/index';
import { api } from '../api/api';
import { mapRecipeDtoToPost } from '../utils/mappers';
import { useSearchStore } from './searchStore';

interface PostStore {
    posts: Post[];
    currentPost: Post | null;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;

    /** Загружает ленту постов с пагинацией. Защищена от двойного вызова. */
    fetchPosts: (reset?: boolean) => Promise<void>;
    /** Загружает конкретный пост по ID (ищет в кэше, если нет — грузит с сервера). */
    fetchPostById: (id: string) => Promise<Post | null>;
    /** Создает новый рецепт. Возвращает ID созданного поста или null при ошибке. */
    createRecipe: (formData: FormData) => Promise<string | null>;
    /** Добавляет шаг приготовления к существующему рецепту. */
    createRecipeStep: (recipeId: string, formData: FormData) => Promise<boolean>;
    updateRecipe: (recipeId: string, formData: FormData) => Promise<boolean>;
    updateRecipeStep: (recipeId: string, stepId: string, formData: FormData) => Promise<boolean>;
    deleteRecipeStep: (recipeId: string, stepId: string) => Promise<boolean>;
    deleteRecipe: (id: string) => Promise<boolean>;
    /** Устанавливает оценку (рейтинг) рецепту. */
    setRecipeRating: (recipeId: string, value: number) => Promise<void>;
    /** Оптимистично обновляет счетчик лайков в стейте. */
    updateLikeCount: (postId: string, increment: boolean) => void;
    /** Оптимистично обновляет счетчик закладок в стейте. */
    updateFavoriteCount: (postId: string, increment: boolean) => void;
    /** Очищает выбранный пост (вызывать при размонтировании страницы рецепта). */
    clearCurrentPost: () => void;
    /** Сбрасывает текст ошибки. */
    clearError: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,

    fetchPosts: async (reset = false) => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
            const currentPage = reset ? 1 : get().page;
            const LIMIT = 10; // константа лимита страниц

            // 1. Достаем актуальное состояние фильтров из стора поиска
            const searchState = useSearchStore.getState();

            // Проверяем, включен ли хотя бы один фильтр или введен текст
            const hasActiveFilters =
                !!searchState.query ||
                !!searchState.sortBy ||
                searchState.excludeAllergens ||
                searchState.includedIngredients.length > 0 ||
                searchState.excludedIngredients.length > 0 ||
                Object.values(searchState.filters).some(arr => arr.length > 0);

            // Динамически выбираем роут: если фильтры пусты — обычная лента, если активны — поиск
            const url = hasActiveFilters ? '/api/recipes/search' : '/api/recipes';

            // Формируем базовые параметры пагинации
            const params: Record<string, any> = {
                Page: currentPage,
                PageSize: LIMIT
            };

            // Упаковываем фильтры 
            if (hasActiveFilters) {
                // 1. Поиск по тексту
                if (searchState.query) params.Title = searchState.query;

                // 2. Ингредиенты
                if (searchState.includedIngredients.length) params.ContainsIngredientIds = searchState.includedIngredients.map(i => i.id);
                if (searchState.excludedIngredients.length) params.ExcludedIngredientIds = searchState.excludedIngredients.map(i => i.id);

                // 3. Аллергены
                if (searchState.excludeAllergens) params.ExcludeUserAllergens = true;

                // 4. Категории
                if (searchState.filters['Тип приема пищи']?.length) params.MealType = searchState.filters['Тип приема пищи'];
                if (searchState.filters['Тип блюда']?.length) params.DishType = searchState.filters['Тип блюда'];

                // 5. Перевод времени в формат (00:00:00)
                if (searchState.filters['Время приготовления']?.length) {
                    const times = searchState.filters['Время приготовления'];
                    let maxMin = 0;
                    if (times.includes('Более часа')) maxMin = 120;
                    else if (times.includes('До 60 минут')) maxMin = 60;
                    else if (times.includes('До 45 минут')) maxMin = 45;
                    else if (times.includes('До 30 минут')) maxMin = 30;
                    else if (times.includes('До 15 минут')) maxMin = 15;

                    if (maxMin > 0) {
                        const hh = String(Math.floor(maxMin / 60)).padStart(2, '0');
                        const mm = String(maxMin % 60).padStart(2, '0');
                        params.MaxCookingTime = `${hh}:${mm}:00`;
                    }
                }

                // 6. Перевод калорий в числа
                if (searchState.filters['Калорийность на 100г.']?.length) {
                    const cals = searchState.filters['Калорийность на 100г.'];
                    let max = 0;
                    if (cals.includes('Более 800 кКал')) max = 5000;
                    else if (cals.includes('600 - 800 кКал')) max = 800;
                    else if (cals.includes('400 - 600 кКал')) max = 600;
                    else if (cals.includes('200 - 400 кКал')) max = 400;
                    else if (cals.includes('До 200 кКал')) max = 200;

                    if (max > 0) params.MaxCalories = max;
                }
            }

            // Запрос
            const response = await api.get(url, {
                params,
                paramsSerializer: { indexes: null }
            });

            const items = Array.isArray(response.data) ? response.data : (response.data?.items || []);

            // ----------------------------------------------------------------------------------
            // TODO БЛОК: собирает аватарки/username авторов по их ID
            // ----------------------------------------------------------------------------------
            const uniqueAuthorIds = [...new Set(items.map((item: any) => item.creatorId).filter(Boolean))] as string[];
            const authorDataMap: Record<string, { avatar: string | null; username: string }> = {};

            await Promise.allSettled(
                uniqueAuthorIds.map(async (authorId) => {
                    const userRes = await api.get(`/api/users/${authorId}`);
                    authorDataMap[authorId] = {
                        avatar: userRes.data.avatarUrl || null,
                        username: userRes.data.userName || userRes.data.name || 'Пользователь'
                    };
                })
            );
            // ----------------------------------------------------------------------------------
            // Конец TODO блока

            // Используем маппер, подсовывая ему собранные асинхронно данные профилей
            const mappedPosts = items.map((item: any) =>
                mapRecipeDtoToPost(
                    item,
                    authorDataMap[item.creatorId]?.avatar,    // Передаем аватарку
                    authorDataMap[item.creatorId]?.username   // Передаем никнейм
                )
            );

            set(state => ({
                posts: reset ? mappedPosts : [...state.posts, ...mappedPosts],
                page: currentPage + 1,
                hasMore: items.length === LIMIT,
                isLoading: false
            }));
        } catch (error: any) {
            console.error("Ошибка загрузки ленты:", error);
            set({ error: 'Не удалось загрузить публикации', isLoading: false });
        }
    },

    fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            // Ищем в уже загруженных постах
            let post = get().posts.find(p => p.id === id) || null;

            // Если страница перезагружена и в ленте пусто — качаем с сервера
            if (!post) {
                const response = await api.get(`/api/recipes/${id}`);
                const recipeData = response.data;

                // Переменные для хранения дефолтных или подгруженных значений автора
                let authorAvatar = null;
                let authorUsername = 'Пользователь';

                // Подтягиваем аватарку и никнейм чужого автора по его creatorId
                const creatorId = recipeData.creatorId;
                if (creatorId) {
                    try {
                        const userRes = await api.get(`/api/users/${creatorId}`);
                        authorAvatar = userRes.data.avatarUrl || null;
                        authorUsername = userRes.data.userName || userRes.data.name || 'Пользователь';
                    } catch (userErr) {
                        console.error("Не удалось подгрузить профиль автора для этого рецепта:", userErr);
                    }
                }

                // Передаем собранные данные автора в маппер
                post = mapRecipeDtoToPost(recipeData, authorAvatar, authorUsername);
            }

            set({ currentPost: post, isLoading: false });
            return post;
        } catch (error: any) {
            console.error("Ошибка загрузки рецепта:", error);
            set({ error: 'Ошибка загрузки рецепта', isLoading: false, currentPost: null });
            return null;
        }
    },

    updateLikeCount: (postId, increment) => {
        set(state => {
            const diff = increment ? 1 : -1;
            return {
                posts: state.posts.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + diff } : p),
                currentPost: state.currentPost?.id === postId
                    ? { ...state.currentPost, likesCount: state.currentPost.likesCount + diff }
                    : state.currentPost
            };
        });
    },

    updateFavoriteCount: (postId, increment) => {
        set(state => {
            const diff = increment ? 1 : -1;
            return {
                posts: state.posts.map(p => p.id === postId ? { ...p, favoritesCount: p.favoritesCount + diff } : p),
                currentPost: state.currentPost?.id === postId
                    ? { ...state.currentPost, favoritesCount: state.currentPost.favoritesCount + diff }
                    : state.currentPost
            };
        });
    },

    createRecipe: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/api/recipes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set({ isLoading: false });
            return response.data?.id || response.data;
        } catch (error: any) {
            console.error("Ошибка создания рецепта:", error);
            set({ error: 'Не удалось создать рецепт. Проверьте данные.', isLoading: false });
            return null;
        }
    },
    deleteRecipe: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/api/recipes/${id}`);
            // Убираем удаленный пост из локального списка, чтобы лента обновилась
            set(state => ({
                posts: state.posts.filter(p => p.id !== id),
                isLoading: false
            }));
            return true;
        } catch (error: any) {
            console.error("Ошибка при удалении рецепта:", error);
            set({ error: 'Не удалось удалить рецепт', isLoading: false });
            return false;
        }
    },
    createRecipeStep: async (recipeId, formData) => {
        try {
            await api.post(`/api/recipes/${recipeId}/steps`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return true;
        } catch (error) {
            console.error("Ошибка при добавлении шага:", error);
            return false;
        }
    },
    updateRecipe: async (recipeId, formData) => {
        set({ isLoading: true, error: null });
        try {
            await api.put(`/api/recipes/${recipeId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            set({ isLoading: false });
            return true;
        } catch (error: any) {
            console.error("Ошибка обновления рецепта:", error);
            set({ error: 'Не удалось обновить рецепт.', isLoading: false });
            return false;
        }
    },

    updateRecipeStep: async (recipeId, stepId, formData) => {
        try {
            await api.put(`/api/recipes/${recipeId}/steps/${stepId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return true;
        } catch (error) {
            console.error("Ошибка обновления шага:", error);
            return false;
        }
    },

    deleteRecipeStep: async (recipeId, stepId) => {
        try {
            await api.delete(`/api/recipes/${recipeId}/steps/${stepId}`);
            return true;
        } catch (error) {
            console.error("Ошибка удаления шага:", error);
            return false;
        }
    },
    setRecipeRating: async (recipeId, value) => {
        try {
            await api.put(`/api/recipes/${recipeId}/rating`, { value });

            const response = await api.get(`/api/recipes/${recipeId}`);
            const updatedPost = mapRecipeDtoToPost(response.data);

            // Точечно обновляем стей
            set(state => ({
                posts: state.posts.map(p => p.id === recipeId ? updatedPost : p),
                currentPost: state.currentPost?.id === recipeId ? updatedPost : state.currentPost
            }));

        } catch (error) {
            console.error("Ошибка при установке рейтинга:", error);
            throw error;
        }
    },

    clearCurrentPost: () => set({ currentPost: null }),
    clearError: () => set({ error: null })
}));