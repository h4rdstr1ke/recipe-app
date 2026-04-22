import { create } from 'zustand';
import type { Comment } from '../types/index';
import { MOCK_COMMENTS, MOCK_USERS } from '../mocks/mocks';
import { useAuthStore } from './authStore';


/**
 * Вспомогательная функция для генерации текущей даты и времени (формат: ДД.ММ.ГГГГ, ЧЧ:ММ) (временная)
 */
const getCurrentDateTime = () => {
    const dateStr = new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Меняем стандартную запятую на букву "в"
    return dateStr.replace(',', ' в');
};

/**
 * Вспомогательная функция для рекурсивного добавления данных автора (аватарок) в комментарии.
 */
const enrichWithAuthData = (item: any): any => {
    // Ищем юзера в базе по его никнейму (item.author)
    const userData = Object.values(MOCK_USERS).find(u => u.username === item.author);

    return {
        ...item,
        authorAvatar: userData?.authorAvatar || null,
        // Если есть ответы, прогоняем их через эту же функцию
        replies: item.replies ? item.replies.map(enrichWithAuthData) : []
    };
};

/**
 * Вспомогательная функция для рекурсивного обновления объекта в дереве комментариев.
 */
const updateRecursive = (items: any[], id: string, updater: (item: any) => any): any[] => {
    return items.map(item => {
        if (item.id === id) return updater(item);
        if (item.replies && item.replies.length > 0) {
            return { ...item, replies: updateRecursive(item.replies, id, updater) };
        }
        return item;
    });
};

/**
 * Вспомогательная функция для рекурсивного удаления объекта из дерева комментариев.
 */
const filterRecursive = (items: any[], idToRemove: string): any[] => {
    return items
        .filter(item => item.id !== idToRemove)
        .map(item => ({
            ...item,
            replies: item.replies ? filterRecursive(item.replies, idToRemove) : []
        }));
};

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

    /** Удаляет корневой комментарий */
    deleteComment: (commentId: string) => Promise<void>;

    /** Удаляет конкретный ответ из ветки комментариев */
    deleteReply: (commentId: string, replyId: string) => Promise<void>;

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
            const postComments = MOCK_COMMENTS
                .filter(comment => comment.postId === postId)
                .map(enrichWithAuthData);
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
        const newComment: Comment = enrichWithAuthData({
            id: Date.now().toString(), // Временный ID для UI
            postId: postId,
            author: user.nickname,
            text: text,
            imageUrl: image,
            likesCount: 0,
            isLiked: false,
            createdAt: getCurrentDateTime(),
            replies: []
        });

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

        const newReply = enrichWithAuthData({
            id: Date.now().toString(),
            author: user.nickname,
            text: text,
            likesCount: 0,
            isLiked: false,
            createdAt: getCurrentDateTime(),
            replies: []
        });

        // Ищем нужный коммент рекурсивно и обновляем только его массив replies
        const updatedComments = updateRecursive(comments, commentId, (item) => ({
            ...item,
            replies: [...(item.replies || []), newReply]
        }));

        set({ comments: updatedComments });

        try {
            // В будущем: await api.post(`/comments/${commentId}/reply`, newReply))
            console.log('Ответ успешно отправлен');
        } catch (error) {
            set({ comments, error: 'Ошибка отправки ответа' });
        }
    },

    editReply: async (_commentId, replyId, newText) => {
        const { comments } = get();

        // Ищем нужный коммент и внутри него нужный ответ, чтобы заменить текст
        // Теперь ищет рекурсивно по всем уровням!
        const updatedComments = updateRecursive(comments, replyId, (item) => ({
            ...item, text: newText
        }));

        set({ comments: updatedComments });

        try {
            // В будущем: await api.put(`/comments/${commentId}/reply/${replyId}`, { text: newText });
            console.log('Ответ успешно отредактирован');
        } catch (error) {
            set({ comments, error: 'Ошибка редактирования ответа' });
        }
    },
    deleteComment: async (commentId) => {
        const { comments } = get();
        // Просто фильтруем массив, убирая удаляемый коммент (теперь рекурсивно на всех уровнях)
        set({ comments: filterRecursive(comments, commentId) });

        try {
            // В будущем: await api.delete(`/comments/${commentId}`);
            console.log('Комментарий удален');
        } catch (error) {
            set({ comments, error: 'Ошибка при удалении комментария' });
        }
    },

    deleteReply: async (_commentId, replyId) => {
        const { comments } = get();
        // Ищем нужный коммент и отфильтровываем из него удаляемый ответ (рекурсивно)
        set({ comments: filterRecursive(comments, replyId) });

        try {
            // В будущем: await api.delete(`/comments/${commentId}/reply/${replyId}`);
            console.log('Ответ удален');
        } catch (error) {
            set({ comments, error: 'Ошибка при удалении ответа' });
        }
    },

    toggleCommentLike: async (commentId) => {
        const { comments } = get();

        // Теперь рекурсивно ищет лайки в том числе у ответов!
        const updatedComments = updateRecursive(comments, commentId, (item) => ({
            ...item,
            isLiked: !item.isLiked,
            likesCount: item.likesCount + (item.isLiked ? -1 : 1)
        }));

        set({ comments: updatedComments });

        try {
            // В будущем: API запрос на лайк/дизлайк
        } catch (error) {
            set({ comments });
        }
    }
}));