import { create } from 'zustand';
import type { Comment } from '../types/index';
import { api } from '../api/api';

/**
 * Вспомогательная функция для преобразования DTO с бэкенда во фронтенд-модель.
 */
const mapCommentDto = (item: any): Comment => ({
    id: item.id,
    postId: item.recipeId || '',
    author: item.commentatorUserName || 'Пользователь',
    authorAvatar: item.commentatorAvatarUrl || null,
    text: item.value || '',
    imageUrl: (item.images && item.images.length > 0) ? item.images[0].url : null,
    likesCount: item.likesCount || 0,
    isLiked: item.isLiked || false,
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).replace(',', ' в') : '',
    // Рекурсивно мапим ответы, если они есть
    replies: item.replies ? item.replies.map(mapCommentDto) : []
});

/**
 * Хранилище для управления веткой комментариев
 */
interface CommentsStore {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;

    fetchCommentsByPostId: (postId: string) => Promise<void>;
    addComment: (postId: string, text: string, imageFile?: File) => Promise<void>;
    addReply: (postId: string, parentCommentId: string, text: string) => Promise<void>;
    editReply: (rootHint: string, commentId: string, newText: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
    toggleCommentLike: (commentId: string) => Promise<void>;
}

export const useCommentsStore = create<CommentsStore>((set, get) => ({
    comments: [],
    isLoading: false,
    error: null,

    fetchCommentsByPostId: async (postId) => {
        set({ isLoading: true, error: null });
        try {

            const response = await api.get(`/api/recipes/${postId}/comments`);
            const rawData = response.data;
            const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

            // вызываем .map у массива items, а не у response.data
            const mappedComments = items.map(mapCommentDto);

            set({ comments: mappedComments, isLoading: false });
        } catch (error: unknown) {
            // для дебага
            console.error("Ошибка при обработке комментариев:", error);
            set({ error: 'Ошибка загрузки комментариев', isLoading: false });
        }
    },

    addComment: async (postId, text, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('Value', text);
            if (imageFile) {
                formData.append('Images', imageFile);
            }

            await api.post(`/api/recipes/${postId}/comments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // После успешного создания запрашиваем свежее дерево с реальными ID
            await get().fetchCommentsByPostId(postId);
        } catch (error) {
            console.error('Не удалось отправить комментарий', error);
            set({ error: 'Не удалось отправить комментарий' });
        }
    },

    addReply: async (postId, parentCommentId, text) => {
        try {
            const formData = new FormData();
            formData.append('Value', text);
            formData.append('ParentCommentId', parentCommentId); // Связь с родителем

            await api.post(`/api/recipes/${postId}/comments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Обновляем ветку
            await get().fetchCommentsByPostId(postId);
        } catch (error) {
            console.error('Ошибка отправки ответа', error);
            set({ error: 'Ошибка отправки ответа' });
        }
    },

    editReply: async (_rootHint, commentId, newText) => {
        try {
            const formData = new FormData();
            formData.append('Value', newText);
            await api.put(`/api/recipes/comments/${commentId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // оптимистично обновляем текст в стейте, чтобы не делать лишний запрос
            set(state => {
                const updateRecursive = (items: any[]): any[] => items.map(item => {
                    if (item.id === commentId) return { ...item, text: newText };
                    if (item.replies) return { ...item, replies: updateRecursive(item.replies) };
                    return item;
                });
                return { comments: updateRecursive(state.comments) };
            });

        } catch (error) {
            console.error('Ошибка редактирования ответа', error);
            set({ error: 'Ошибка редактирования ответа' });
        }
    },

    deleteComment: async (commentId) => {
        try {
            await api.delete(`/api/recipes/comments/${commentId}`);

            // Оптимистично вырезаем из дерева
            set(state => {
                const filterRecursive = (items: any[]): any[] => items
                    .filter(item => item.id !== commentId)
                    .map(item => ({ ...item, replies: filterRecursive(item.replies || []) }));

                return { comments: filterRecursive(state.comments) };
            });
        } catch (error) {
            console.error('Ошибка при удалении', error);
            set({ error: 'Ошибка при удалении' });
        }
    },

    toggleCommentLike: async (commentId) => {
        // TODO: В Swagger пока нет эндпоинта для лайков КОММЕНТАРИЕВ.
        // /api/recipes/comments/{commentId}/like, вставим сюда вызов api.put()

        // Пока оставляем только оптимистичную отрисовку
        set(state => {
            const updateRecursive = (items: any[]): any[] => items.map(item => {
                if (item.id === commentId) {
                    return { ...item, isLiked: !item.isLiked, likesCount: item.likesCount + (item.isLiked ? -1 : 1) };
                }
                if (item.replies) return { ...item, replies: updateRecursive(item.replies) };
                return item;
            });
            return { comments: updateRecursive(state.comments) };
        });
    }
}));