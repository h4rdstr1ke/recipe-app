import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { aiApi } from '../../api/aiApi';

export default function Ai({ onClose }: { onClose: () => void }) {
    const { messages, isLoading, sendMessage } = useChatStore();

    // Стейт для текстового инпута
    const [inputValue, setInputValue] = useState('');

    // Стейт для индикатора загрузки картинки
    const [isDetecting, setIsDetecting] = useState(false);

    // Рефы для скролла и для скрытого инпута файла
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Функция отправки сообщения в чат
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;
        const textToSend = inputValue;
        setInputValue('');
        await sendMessage(textToSend);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // ==========================================
    // ЛОГИКА РАСПОЗНАВАНИЯ ФОТО (КОМПЬЮТЕРНОЕ ЗРЕНИЕ)
    // ==========================================
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsDetecting(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Отправляем фото на эндпоинт компьютерного зрения
            const response = await aiApi.post('/api/vision/detect-products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: { conf_threshold: 0.3 } // Отсекаем неуверенные догадки ИИ
            });

            if (response.data && response.data.items) {
                // Извлекаем названия продуктов (label) и убираем дубликаты
                const labels = response.data.items.map((item: any) => item.label);
                const uniqueProducts = [...new Set(labels)];

                if (uniqueProducts.length > 0) {
                    // Автоматически вставляем найденные продукты в поле ввода!
                    const productsText = uniqueProducts.join(', ');
                    setInputValue(`У меня есть: ${productsText}. Что из этого можно приготовить?`);
                } else {
                    alert("ИИ не смог найти знакомые продукты на этом фото.");
                }
            }
        } catch (error) {
            console.error("Ошибка при распознавании фото:", error);
            alert("Не удалось распознать продукты. Проверьте сервер ИИ.");
        } finally {
            setIsDetecting(false);
            // Очищаем инпут, чтобы можно было загрузить ту же фотку еще раз, если нужно
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
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
                                    ? 'self-end rounded-[20px] rounded-br-[4px]'
                                    : 'self-start rounded-[20px] rounded-bl-[4px]'
                                }`}
                        >
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                        </div>
                    ))}

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

                    <div ref={messagesEndRef} />
                </div>

                {/* Зона ввода (нижняя панель) */}
                <div className="p-[20px] sm:px-[40px] sm:pb-[30px] flex items-center gap-[12px]">

                    {/* Скрытый инпут для фото */}
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    {/* Кнопка загрузки фото (Заменили троеточие на скрепку/камеру) */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isDetecting || isLoading}
                        className={`w-[44px] h-[44px] shrink-0 rounded-full flex justify-center items-center shadow-sm transition-colors
                            ${isDetecting ? 'bg-white/50 text-gray-400 cursor-not-allowed' : 'bg-white/90 hover:bg-white text-gray-500'}`}
                        title="Распознать продукты по фото"
                    >
                        {isDetecting ? (
                            // Иконка загрузки (крутилка), пока фото отправляется на сервер
                            <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            // Иконка скрепки
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                            </svg>
                        )}
                    </button>

                    {/* Поле ввода */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || isDetecting}
                        placeholder={isDetecting ? "Распознаю фото..." : isLoading ? "Подождите, ИИ думает..." : "Что хотите приготовить сегодня?"}
                        className="flex-1 h-[44px] rounded-[12px] bg-white/90 focus:bg-white px-[20px] font-montserrat text-[16px] md:text-[15px] outline-none placeholder:text-gray-400 shadow-sm transition-all focus:ring-2 focus:ring-white/50 disabled:opacity-70 disabled:cursor-not-allowed"
                    />

                    {/* Кнопка отправки */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading || isDetecting}
                        className={`w-[44px] h-[44px] shrink-0 rounded-full flex justify-center items-center shadow-sm transition-colors
                            ${inputValue.trim() && !isLoading && !isDetecting
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