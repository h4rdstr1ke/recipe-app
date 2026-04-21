import { create } from 'zustand';
import type { Comment } from '../types/index';
import { MOCK_COMMENTS } from '../mocks/mocks';
import { useAuthStore } from './authStore';

/**
 * Хранилище для управления веткой комментариев конкретного (открытого) поста.
 */
interface CommentsStore {
    /** Массив корневых комментариев (ответы лежат внутри каждого комментария в поле replies) */
    comments: Comment[];
    /** Индикатор процесса отправки или загрузки данных */
    isLoading: boolean;
    /** Текст ошибки, если запрос завершился неудачно */
    error: string | null;

    /**
     * Загружает ветку комментариев для открытого поста.
     * @param postId - ID поста, комментарии которого нужно загрузить
     */
    fetchCommentsByPostId: (postId: string) => Promise<void>;

    /**
     * Отправляет новый корневой комментарий к посту (Оптимистичное обновление).
     * @param postId - ID поста, под которым оставляют комментарий
     * @param text - Текст комментария
     * @param image - (Опционально) URL прикрепленного изображения
     */
    addComment: (postId: string, text: string, image?: string) => Promise<void>;

    /**
     * Оставляет ответ на существующий комментарий (Оптимистичное обновление).
     * @param commentId - ID корневого комментария, на который отвечаем
     * @param text - Текст ответа
     */
    addReply: (commentId: string, text: string) => Promise<void>;

    /**
     * Ставит или убирает лайк с корневого комментария (Оптимистичное обновление).
     * @param commentId - ID комментария
     */
    toggleCommentLike: (commentId: string) => Promise<void>;

    /**
     * Редактирует текст существующего ответа.
     * @param commentId - ID корневого комментария, в котором находится ответ
     * @param replyId - Уникальный ID самого ответа
     * @param newText - Новый текст ответа
     */
    editReply: (commentId: string, replyId: string, newText: string) => Promise<void>;
}

export const useCommentsStore = create<CommentsStore>((set, get) => ({
    comments: [],
    isLoading: false,
    error: null,

    fetchCommentsByPostId: async (postId) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Временно фильтруем моки. В будущем: const response = await api.get(`/posts/${postId}/comments`);
            const postComments = MOCK_COMMENTS.filter(comment => comment.postId === postId);
            set({ comments: postComments, isLoading: false });
        } catch (error: unknown) {
            set({ error: 'Ошибка загрузки комментариев', isLoading: false });
        }
    },

    addComment: async (postId, text, image) => {
        const { comments } = get(); // Достаем текущие комменты из стейта
        const { user } = useAuthStore.getState();

        if (!user) {
            console.error("Пользователь не авторизован");
            return;
        }

        // Создаем объект нового комментария
        const newComment: Comment = {
            id: Date.now().toString(), // Временный ID для UI
            postId: postId,
            author: user.nickname,
            text: text,
            imageUrl: image,
            likesCount: 0,
            isLiked: false,
            createdAt: new Date().toLocaleDateString('ru-RU'),
            replies: []
        };

        // Оптимистичное обновление UI: добавляем новый коммент в начало массива
        set({ comments: [newComment, ...comments] });

        try {
            // В будущем: await api.post(`/comments`, newComment);
            console.log('Комментарий успешно отправлен на сервер');
        } catch (error) {
            // Если сервер выдал ошибку - откатываем стейт назад
            set({ comments, error: 'Не удалось отправить комментарий' });
        }
    },

    addReply: async (commentId, text) => {
        const { comments } = get();
        const { user } = useAuthStore.getState();

        if (!user) {
            console.error("Пользователь не авторизован");
            return;
        }

        const newReply = {
            id: Date.now().toString(),
            author: user.nickname,
            text: text,
            likesCount: 0,
            isLiked: false,
            createdAt: new Date().toLocaleDateString('ru-RU'),
        };

        // Ищем нужный коммент и обновляем только его массив replies
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...comment.replies, newReply]
                };
            }
            return comment;
        });

        set({ comments: updatedComments });

        try {
            // В будущем: await api.post(`/comments/${commentId}/reply`, newReply))
            console.log('Ответ успешно отправлен');
        } catch (error) {
            set({ comments, error: 'Ошибка отправки ответа' });
        }
    },

    editReply: async (commentId, replyId, newText) => {
        const { comments } = get();

        // Ищем нужный коммент и внутри него нужный ответ, чтобы заменить текст
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply.id === replyId ? { ...reply, text: newText } : reply
                    )
                };
            }
            return comment;
        });

        set({ comments: updatedComments });

        try {
            // В будущем: await api.put(`/comments/${commentId}/reply/${replyId}`, { text: newText });
            console.log('Ответ успешно отредактирован');
        } catch (error) {
            set({ comments, error: 'Ошибка редактирования ответа' });
        }
    },

    toggleCommentLike: async (commentId) => {
        const { comments } = get();

        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) return;

        const isCurrentlyLiked = comments[commentIndex].isLiked;

        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    isLiked: !isCurrentlyLiked,
                    likesCount: comment.likesCount + (isCurrentlyLiked ? -1 : 1)
                };
            }
            return comment;
        });

        set({ comments: updatedComments });

        try {
            // В будущем: API запрос на лайк/дизлайк
        } catch (error) {
            set({ comments });
        }
    }
}));