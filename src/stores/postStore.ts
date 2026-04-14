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
    updateLikeCount: (postId: string, increment: boolean) => Promise<void>;
    updateFavoriteCount: (postId: string, increment: boolean) => Promise<void>;
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
            // Ищем в уже загруженных постах (из ленты)
            let post = get().posts.find(p => p.id === id);

            // Если в ленте нет (зашли по прямой ссылке), запрашиваем (берем из моков)
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