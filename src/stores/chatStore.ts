import { create } from 'zustand';
import { api } from '../api/api';

// Типы, взятые из openapi.json
export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    role: ChatRole;
    content: string;
}

interface ChatStore {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;

    // Функция отправки сообщения
    sendMessage: (content: string, recipeId?: string) => Promise<void>;
    // Очистка истории чата 
    clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    // приветствен сообщения от гида 
    messages: [
        { role: 'assistant', content: 'Привет! Я ваш кулинарный ИИ-гид. Чем могу помочь?' }
    ],
    isLoading: false,
    error: null,

    sendMessage: async (content, recipeId) => {
        // Сразу добавляем сообщение пользователя в UI для мгновенной реакции
        const userMessage: ChatMessage = { role: 'user', content };
        set({
            messages: [...get().messages, userMessage],
            isLoading: true,
            error: null
        });

        try {
            //  мы пишем /ai/api/chat, чтобы сработал наш Vite-прокси
            const response = await api.post('/ai/api/chat', {
                messages: get().messages, // Отправляем историю, чтобы ИИ помнил контекст
                recipe_id: recipeId || null
            });

            // Получаем ответ (в Swagger указано, что приходит поле reply)
            const botMessage: ChatMessage = {
                role: 'assistant',
                content: response.data.reply
            };

            // Добавляем ответ ИИ в список
            set({
                messages: [...get().messages, botMessage],
                isLoading: false
            });

        } catch (error) {
            console.error("Ошибка при запросе к ИИ:", error);
            set({
                error: 'ИИ-гид сейчас недоступен. Попробуйте позже.',
                isLoading: false
            });
        }
    },

    clearChat: () => set({
        messages: [{ role: 'assistant', content: 'Привет! Я ваш кулинарный ИИ-гид. Чем могу помочь?' }],
        error: null
    })
}));