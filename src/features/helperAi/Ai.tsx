import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';

export default function Ai({ onClose }: { onClose: () => void }) {
    const { messages, isLoading, sendMessage } = useChatStore();

    // Стейт только для инпута
    const [inputValue, setInputValue] = useState('');

    // Реф для автоматического скролла вниз при новом сообщении
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Блокировка скролла основного экрана
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Скроллим вниз при каждом обновлении сообщений или изменении статуса загрузки
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Функция отправки сообщения
    const handleSendMessage = async () => {
        // Блокируем отправку, если пусто или ИИ уже думает над прошлым вопросом
        if (!inputValue.trim() || isLoading) return;

        const textToSend = inputValue;
        setInputValue(''); // Сразу очищаем инпут для лучшего UX

        // Отправляем реальный запрос на Python-сервер
        await sendMessage(textToSend);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Предотвращаем дефолтное поведение, чтобы не было прыжков
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div
            className="fixed top-0 md:top-[100px] left-0 right-0 bottom-0 bg-black/20 md:backdrop-blur-sm z-50 flex justify-center items-start pt-[10px] md:pt-[20px] pb-[10px] md:pb-[40px] md:px-4"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col w-full md:max-w-[800px] md:h-[80vh] h-[100%] md:min-h-[600px] md:max-h-[800px] rounded-[20px] shadow-2xl overflow-hidden bg-gradient-to-b from-[#3BB5FF] to-[#8ED9FF]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Шапка */}
                <div className="flex justify-center items-center relative h-[80px] shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute left-1 md:left-[30px] w-10 h-10 flex items-center justify-center text-[28px] font-light text-black hover:text-gray-700 rounded-full transition-colors"
                        aria-label="Закрыть"
                    >
                        ✕
                    </button>
                    <h1 className="font-montserrat text-[24px] sm:text-[32px] font-bold tracking-[0.2px] text-black">
                        Твой ИИ-помощник!
                    </h1>
                </div>

                {/* Зона сообщений (чат) */}
                <div className="flex-1 overflow-y-auto px-[20px] sm:px-[40px] py-[20px] flex flex-col gap-[16px]">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[85%] sm:max-w-[70%] px-[20px] py-[14px] bg-white text-black font-montserrat text-[15px] leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'self-end rounded-[20px] rounded-br-[4px]' // Сообщения пользователя справа
                                    : 'self-start rounded-[20px] rounded-bl-[4px]' // Сообщения ИИ слева
                                }`}
                        >
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                        </div>
                    ))}

                    {/* Индикатор загрузки (ИИ печатает...) */}
                    {isLoading && (
                        <div className="self-start max-w-[85%] sm:max-w-[70%] px-[20px] py-[14px] bg-white/70 text-gray-500 font-montserrat text-[15px] leading-relaxed shadow-sm rounded-[20px] rounded-bl-[4px] flex items-center gap-2">
                            <span className="animate-pulse">печатает</span>
                            <span className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                        </div>
                    )}

                    <div ref={messagesEndRef} /> {/* Невидимый элемент для скролла */}
                </div>

                {/* Зона ввода (нижняя панель) */}
                <div className="p-[20px] sm:px-[40px] sm:pb-[30px] flex items-center gap-[12px]">
                    {/* Кнопка с троеточием (опционально - можно повесить очистку истории) */}
                    <button
                        className="w-[44px] h-[44px] shrink-0 rounded-full bg-white/90 hover:bg-white flex justify-center items-center shadow-sm transition-colors text-gray-500"
                        title="Дополнительные опции"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                        </svg>
                    </button>

                    {/* Поле ввода */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading} // Блокируем ввод, пока ИИ отвечает
                        placeholder={isLoading ? "Подождите, ИИ думает..." : "Что хотите приготовить сегодня?"}
                        className="flex-1 h-[44px] rounded-[12px] bg-white/90 focus:bg-white px-[20px] font-montserrat text-[16px] md:text-[15px] outline-none placeholder:text-gray-400 shadow-sm transition-all focus:ring-2 focus:ring-white/50 disabled:opacity-70 disabled:cursor-not-allowed"
                    />

                    {/* Кнопка отправки */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading} // Отключаем кнопку
                        className={`w-[44px] h-[44px] shrink-0 rounded-full flex justify-center items-center shadow-sm transition-colors
                            ${inputValue.trim() && !isLoading
                                ? 'bg-white/90 hover:bg-white text-[#3BB5FF] cursor-pointer'
                                : 'bg-white/50 text-gray-400 cursor-not-allowed'}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}