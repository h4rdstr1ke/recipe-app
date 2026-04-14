import { create } from 'zustand';
import type { Comment } from '../types/index';
import { MOCK_COMMENTS } from '../mocks/mocks';
import { useAuthStore } from './authStore';

interface CommentsStore {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;

    // Действия
    fetchCommentsByPostId: (postId: string) => Promise<void>; // загрузить ветку комментов для открытого поста
    addComment: (postId: string, text: string, image?: string) => Promise<void>; // написать новый коммент
    addReply: (commentId: string, text: string) => Promise<void>; // ответить на чужой коммент
    toggleCommentLike: (commentId: string) => Promise<void>; // лайкнуть коммент
    editReply: (commentId: string, replyId: string, newText: string) => Promise<void>; // редактирование ответа
}

export const useCommentsStore = create<CommentsStore>((set, get) => ({
    comments: [], // Изначально пустой массив
    isLoading: false,
    error: null,

    fetchCommentsByPostId: async (postId) => {
        set({ isLoading: true, error: null });
        try {
            // Имитируем задержку сети 
            await new Promise(resolve => setTimeout(resolve, 500));
            // запрос: const response = await api.get(`/posts/${postId}/comments`);
            // Временно фильтруем моки
            const postComments = MOCK_COMMENTS.filter(comment => comment.postId === postId);
            set({ comments: postComments, isLoading: false });
        } catch (error: unknown) {
            set({ error: 'Ошибка загрузки комментариев', isLoading: false });
        }
    },

    addComment: async (postId, text, image) => {
        const { comments } = get(); // Достаем текущие комменты из стейта

        const { user } = useAuthStore.getState();

        //(если вдруг неавторизованный юзер смог нажать кнопку)
        if (!user) {
            console.error("Пользователь не авторизован");
            return;
        }

        // Создаем объект нового комментария
        const newComment: Comment = {
            id: Date.now().toString(), // Генерируем временный ID
            postId: postId,
            author: user.nickname, // TODO: В будущем брать имя из authStore
            text: text,
            imageUrl: image,
            likesCount: 0,
            isLiked: false,
            createdAt: new Date().toLocaleDateString('ru-RU'), // Текущая дата
            replies: [] // У нового коммента пока нет ответов
        };

        // 2. Обновляем стейт оптимистично (добавляем новый коммент в начало массива)
        set({ comments: [newComment, ...comments] });

        try {
            // API 
            // await api.post(`/comments`, newComment);
            console.log('Комментарий успешно отправлен на сервер');
        } catch (error) {
            // 4. Если сервер выдал ошибку - откатываем стейт назад
            set({ comments });
            set({ error: 'Не удалось отправить комментарий' });
        }
    },
    addReply: async (commentId, text) => {
        const { comments } = get();

        const { user } = useAuthStore.getState();

        //(если вдруг неавторизованный юзер смог нажать кнопку)
        if (!user) {
            console.error("Пользователь не авторизован");
            return;
        }

        // Создаем объект ответа (Reply)
        const newReply = {
            id: Date.now().toString(),
            author: user.nickname, // TODO: Брать из авторизации
            text: text,
            likesCount: 0,
            isLiked: false,
            createdAt: new Date().toLocaleDateString('ru-RU'),
        };

        // Ищем нужный коммент и обновляем только его массив replies
        const updatedComments = comments.map(comment => {
            if (comment.id === commentId) {
                // Если нашли нужный коммент, возвращаем его копию с новым ответом
                return {
                    ...comment,
                    replies: [...comment.replies, newReply]
                };
            }
            // Остальные комменты возвращаем без изменений
            return comment;
        });

        // Сохраняем обновленный массив в стейт
        set({ comments: updatedComments });

        try {
            //  API await api.post(`/comments/${commentId}/reply`, newReply))
            console.log('Ответ успешно отправлен');
        } catch (error) {
            set({ comments, error: 'Ошибка отправки ответа' }); // Откат при ошибке
        }
    },

    // Функция редактирование ответа
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

        // Мгновенно обновляем интерфейс
        set({ comments: updatedComments });

        try {
            // API запрос в будущем
            // await api.put(`/comments/${commentId}/reply/${replyId}`, { text: newText });
            console.log('Ответ успешно отредактирован');
        } catch (error) {
            set({ comments, error: 'Ошибка редактирования ответа' }); // Откат при ошибке
        }
    },

    toggleCommentLike: async (commentId) => {
        const { comments } = get();

        // Ищем индекс комментария
        const commentIndex = comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) return; // Если не нашли - выходим

        const isCurrentlyLiked = comments[commentIndex].isLiked;

        // Обновляем массив
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
            // API запрос
        } catch (error) {
            // Откат при ошибке
            set({ comments });
        }
    }
}));