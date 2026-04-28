import { useState, useRef, useEffect } from 'react';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'ai';
};

export default function Ai({ onClose }: { onClose: () => void }) {
    // Состояния для хранения сообщений и текста в инпуте
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Хочу приготовить картошку", sender: "user" },
        { id: 2, text: "Конечно! Вот несколько вариантов приготовления картошки", sender: "ai" }
    ]);

    // Реф для автоматического скролла вниз при новом сообщении
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Блокировка скролла
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Функция отправки сообщения
    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        // Имитация ответа ИИ (для теста UX)
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Отличная идея! Могу предложить рецепт запеченной картошки с розмарином или классическое пюре. Что больше нравится?",
                sender: 'ai'
            }]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
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
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[85%] sm:max-w-[70%] px-[20px] py-[14px] bg-white text-black font-montserrat text-[15px] leading-relaxed shadow-sm
                                ${msg.sender === 'user'
                                    ? 'self-end rounded-[20px] rounded-br-[4px]' // Сообщения пользователя справа
                                    : 'self-start rounded-[20px] rounded-bl-[4px]' // Сообщения ИИ слева
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* Невидимый элемент для скролла */}
                </div>

                {/* Зона ввода (нижняя панель) */}
                <div className="p-[20px] sm:px-[40px] sm:pb-[30px] flex items-center gap-[12px]">
                    {/* Кнопка с троеточием */}
                    <button className="w-[44px] h-[44px] shrink-0 rounded-full bg-white/90 hover:bg-white flex justify-center items-center shadow-sm transition-colors text-gray-500">
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
                        placeholder="Что хотите приготовить сегодня?"
                        className="flex-1 h-[44px] rounded-[12px] bg-white/90 focus:bg-white px-[20px] font-montserrat text-[16px] md:text-[15px] outline-none placeholder:text-gray-400 shadow-sm transition-all focus:ring-2 focus:ring-white/50"
                    />

                    {/* Кнопка отправки */}
                    <button
                        onClick={handleSendMessage}
                        className={`w-[44px] h-[44px] shrink-0 rounded-full bg-white/90 hover:bg-white flex justify-center items-center shadow-sm transition-colors
                            ${inputValue.trim() ? 'text-[#3BB5FF]' : 'text-gray-400'}`}
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