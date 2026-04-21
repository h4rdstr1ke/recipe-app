import { create } from 'zustand';
import type { Post } from '../types/index';
import { MOCK_POSTS } from '../mocks/mocks';

/**
 * Хранилище для управления лентой публикаций и просмотром конкретного рецепта.
 */
interface PostStore {
    /** Массив постов для отображения в общей ленте */
    posts: Post[];
    /** Данные поста, открытого в данный момент на отдельной странице (PublicationPage) */
    currentPost: Post | null;
    /** Индикатор процесса загрузки данных по сети */
    isLoading: boolean;
    /** Текст ошибки, если запрос завершился неудачно (или null, если всё ок) */
    error: string | null;
    /** Флаг наличия следующих страниц на сервере (для бесконечной прокрутки) */
    hasMore: boolean;
    /** Текущая загруженная страница пагинации */
    page: number;

    /**
     * Загружает следующую порцию постов для ленты.
     * Защищена от двойного вызова во время загрузки.
     * * @param reset - Если true, сбрасывает пагинацию и загружает первую страницу (полезно для Pull-to-Refresh)
     */
    fetchPosts: (reset?: boolean) => Promise<void>;

    /**
     * Изменяет счетчик лайков на конкретном посте (оптимистичное обновление UI).
     * Обновляет пост как в общей ленте (`posts`), так и в открытом посте (`currentPost`).
     * * @param postId - ID целевого поста
     * @param increment - `true` (добавить лайк) или `false` (убрать лайк)
     */
    updateLikeCount: (postId: string, increment: boolean) => Promise<void>;

    /**
     * Изменяет счетчик добавлений в избранное на посте (оптимистичное обновление UI).
     * * @param postId - ID целевого поста
     * @param increment - `true` (добавить) или `false` (убрать)
     */
    updateFavoriteCount: (postId: string, increment: boolean) => Promise<void>;

    /**
     * Запрашивает данные конкретного поста для отображения на его странице.
     * Сначала пытается найти пост в кэше ленты (`posts`), чтобы избежать лишнего запроса.
     * * @param id - Уникальный ID запрашиваемого поста
     * @returns Найденный объект поста или null в случае ошибки/отсутствия
     */
    fetchPostById: (id: string) => Promise<Post | null>;

    /** * Очищает `currentPost`. 
     * Обязательно вызывать при уходе со страницы (unmount), чтобы при открытии 
     * следующего рецепта не мелькал старый контент.
     */
    clearCurrentPost: () => void;

    /** Сбрасывает состояние ошибки в null */
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
        // Защита от двойного вызова, если уже грузим
        if (get().isLoading) return;

        set({ isLoading: true, error: null });

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const currentPage = reset ? 1 : get().page;

            set(state => ({
                posts: reset ? MOCK_POSTS : [...state.posts, ...MOCK_POSTS],
                page: currentPage + 1,
                hasMore: false, // Временно false из-за моков
                isLoading: false
            }));
        } catch (error: unknown) {
            set({
                error: error instanceof Error ? error.message : 'Ошибка загрузки постов',
                isLoading: false
            });
        }
    },

    updateLikeCount: async (postId: string, increment: boolean) => {
        set(state => {
            const updatedPosts = state.posts.map(p => p.id === postId ? {
                ...p,
                likesCount: p.likesCount + (increment ? 1 : -1)
            } : p);

            let updatedCurrentPost = state.currentPost;
            if (state.currentPost?.id === postId) {
                updatedCurrentPost = {
                    ...state.currentPost,
                    likesCount: state.currentPost.likesCount + (increment ? 1 : -1)
                };
            }

            return { posts: updatedPosts, currentPost: updatedCurrentPost };
        });
    },

    updateFavoriteCount: async (postId: string, increment: boolean) => {
        set(state => {
            const updatedPosts = state.posts.map(p => p.id === postId ? {
                ...p,
                favoritesCount: p.favoritesCount + (increment ? 1 : -1)
            } : p);

            let updatedCurrentPost = state.currentPost;
            if (state.currentPost?.id === postId) {
                updatedCurrentPost = {
                    ...state.currentPost,
                    favoritesCount: state.currentPost.favoritesCount + (increment ? 1 : -1)
                };
            }

            return { posts: updatedPosts, currentPost: updatedCurrentPost };
        });
    },

    fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            let post = get().posts.find(p => p.id === id);

            if (!post) {
                post = MOCK_POSTS.find(p => p.id === id);
                // В будущем: post = await api.get(`/posts/${id}`);
            }

            if (post) {
                set({ currentPost: post, isLoading: false });
                return post;
            } else {
                set({ currentPost: null, isLoading: false, error: 'Пост не найден' });
                return null;
            }
        } catch (error: unknown) {
            set({
                error: error instanceof Error ? error.message : 'Ошибка загрузки поста',
                isLoading: false,
                currentPost: null
            });
            return null;
        }
    },

    clearCurrentPost: () => set({ currentPost: null }),

    clearError: () => set({ error: null })
}));