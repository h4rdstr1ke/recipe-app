import { create } from 'zustand';
import type { Post } from '../types/index';
import { MOCK_POSTS } from '../mocks/mocks';

interface PostStore {
    posts: Post[];
    currentPost: Post | null;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;

    // Действия
    fetchPosts: (reset?: boolean) => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    toggleFavorite: (postId: string) => Promise<void>;
    fetchPostById: (id: string) => Promise<Post | null>;
    clearCurrentPost: () => void; // Чтобы чистить при уходе со страницы
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

    toggleLike: async (postId: string) => {
        // Сохраняем текущее состояние для отката в случае ошибки API
        const { posts, currentPost } = get();

        // Определяем, был ли лайк (ищем либо в ленте, либо в открытом посте)
        const postInList = posts.find(p => p.id === postId);
        const isCurrentlyLiked = postInList ? postInList.isLiked : currentPost?.id === postId ? currentPost.isLiked : null;

        if (isCurrentlyLiked === null) return; // Пост не найден нигде

        // Оптимистичное обновление UI (сразу обновляем и ленту, и текущий пост)
        set(state => {
            const updatedPosts = state.posts.map(p => p.id === postId ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: p.likesCount + (p.isLiked ? -1 : 1)
            } : p);

            let updatedCurrentPost = state.currentPost;
            if (state.currentPost?.id === postId) {
                updatedCurrentPost = {
                    ...state.currentPost,
                    isLiked: !state.currentPost.isLiked,
                    likesCount: state.currentPost.likesCount + (state.currentPost.isLiked ? -1 : 1)
                };
            }

            return { posts: updatedPosts, currentPost: updatedCurrentPost };
        });

        // API запрос
        try {
            // if (isCurrentlyLiked) await api.delete(`/posts/${postId}/like`);
            // else await api.post(`/posts/${postId}/like`);
            console.log(isCurrentlyLiked ? 'Убран лайк:' : 'Лайкнут пост:', postId);
        } catch (error) {
            // Откат при ошибке (возвращаем старый список и старый currentPost)
            set({ posts, currentPost, error: 'Не удалось изменить лайк' });
        }
    },

    toggleFavorite: async (postId: string) => {
        const { posts, currentPost } = get();

        const postInList = posts.find(p => p.id === postId);
        const isCurrentlyFavorited = postInList ? postInList.isFavorited : currentPost?.id === postId ? currentPost.isFavorited : null;

        if (isCurrentlyFavorited === null) return;

        set(state => {
            const updatedPosts = state.posts.map(p => p.id === postId ? {
                ...p,
                isFavorited: !p.isFavorited,
                favoritesCount: p.favoritesCount + (p.isFavorited ? -1 : 1)
            } : p);

            let updatedCurrentPost = state.currentPost;
            if (state.currentPost?.id === postId) {
                updatedCurrentPost = {
                    ...state.currentPost,
                    isFavorited: !state.currentPost.isFavorited,
                    favoritesCount: state.currentPost.favoritesCount + (state.currentPost.isFavorited ? -1 : 1)
                };
            }

            return { posts: updatedPosts, currentPost: updatedCurrentPost };
        });

        try {
            // API запрос
            console.log(isCurrentlyFavorited ? 'Убрано из избранного:' : 'Добавлено в избранное:', postId);
        } catch (error) {
            set({ posts, currentPost, error: 'Не удалось изменить избранное' });
        }
    },

    fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            // Ищем в уже загруженных постах (из ленты)
            let post = get().posts.find(p => p.id === id);

            // Если в ленте нет (зашли по прямой ссылке), запрашиваем (в нашем случае берем из моков)
            if (!post) {
                post = MOCK_POSTS.find(p => p.id === id);
                // В будущем: post = await api.get(`/posts/${id}`);
            }

            if (post) {
                // Обязательно сохраняем в currentPost
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