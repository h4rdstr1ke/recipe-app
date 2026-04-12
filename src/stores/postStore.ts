import { create } from 'zustand';
import type { Post } from '../types/index';
import { MOCK_POSTS } from '../mocks/mocks';

interface PostStore {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;

    // Действия
    fetchPosts: (reset?: boolean) => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    toggleFavorite: (postId: string) => Promise<void>;
    fetchPostById: (id: string) => Promise<Post | null>;
    clearError: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
    posts: [],
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
        const { posts } = get();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const isCurrentlyLiked = posts[postIndex].isLiked;

        // Оптимистичное обновление UI
        set(state => ({
            posts: state.posts.map(p => p.id === postId ? {
                ...p,
                isLiked: !isCurrentlyLiked,
                likesCount: p.likesCount + (isCurrentlyLiked ? -1 : 1)
            } : p)
        }));

        try {
            // API запрос: 
            // if (isCurrentlyLiked) await api.delete(`/posts/${postId}/like`);
            // else await api.post(`/posts/${postId}/like`);
            console.log(isCurrentlyLiked ? 'Убран лайк:' : 'Лайкнут пост:', postId);
        } catch (error) {
            // Откат при ошибке
            set({ posts, error: 'Не удалось изменить лайк' });
        }
    },

    toggleFavorite: async (postId: string) => {
        const { posts } = get();
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const isCurrentlyFavorited = posts[postIndex].isFavorited;

        set(state => ({
            posts: state.posts.map(p => p.id === postId ? {
                ...p,
                isFavorited: !isCurrentlyFavorited,
                favoritesCount: p.favoritesCount + (isCurrentlyFavorited ? -1 : 1)
            } : p)
        }));

        try {
            // API запрос
            console.log(isCurrentlyFavorited ? 'Убрано из избранного:' : 'Добавлено в избранное:', postId);
        } catch (error) {
            set({ posts, error: 'Не удалось изменить избранное' });
        }
    },

    fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const existingPost = get().posts.find(p => p.id === id);
            if (existingPost) {
                set({ isLoading: false });
                return existingPost;
            }

            const mockPost = MOCK_POSTS.find(p => p.id === id);
            set({ isLoading: false });
            return mockPost || null;
        } catch (error: unknown) {
            set({
                error: error instanceof Error ? error.message : 'Ошибка загрузки поста',
                isLoading: false
            });
            return null;
        }
    },

    clearError: () => set({ error: null })
}));