import { useEffect } from 'react';
import DefaultAvatar from "../../assets/defaultAvatar.svg";
import { useNotificationStore } from '../../stores/notificationStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { MOCK_POSTS, MOCK_USERS } from '../../mocks/mocks';

export default function Notifications({ onClose }: { onClose: () => void }) {
    const { notifications, fetchNotifications, markAllAsRead, isLoading } = useNotificationStore();
    const { toggleSubscription, isSubscribed } = useUserSettingsStore();

    useEffect(() => {
        fetchNotifications();

        // Отмечаем все как прочитанное при закрытии модалки 
        return () => markAllAsRead();
    }, [fetchNotifications, markAllAsRead]);

    return (
        // overflow-y-auto, чтобы список скроллился, если уведомлений много
        <div className="absolute top-[110px] right-[100px] bg-[#FFFFFF] bottom-0 flex flex-col z-50 border border-[#E6E6E6] rounded-[5px] w-[500px] p-5 overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
                <h3 className="font-montserrat text-[32px] tracking-[0.2px] font-bold leading-7">Уведомления</h3>
                <button onClick={onClose} className="text-black hover:text-gray-500 transition-colors text-2xl">✕</button>
            </div>

            {isLoading ? (
                <div className="text-center font-montserrat mt-10">Загрузка...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center font-montserrat mt-10 text-gray-500">У вас нет новых уведомлений</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {notifications.map((notif) => {
                        // --- РЕНДЕР ДЛЯ СОЦИАЛЬНЫХ ДЕЙСТВИЙ (Подписка, Лайк, Коммент) ---
                        const actor = notif.actorId ? MOCK_USERS[notif.actorId as keyof typeof MOCK_USERS] : null;
                        const post = notif.postId ? MOCK_POSTS.find(p => p.id === notif.postId) : null;

                        if (notif.type === 'SUBSCRIBE' || notif.type === 'LIKE' || notif.type === 'COMMENT') {

                            const subscribed = notif.actorId ? isSubscribed(notif.actorId) : false;

                            return (
                                <div key={notif.id} className={`grid grid-cols-[90px_1fr_190px] items-center py-2 ${!notif.isRead ? 'bg-blue-50/50 rounded-lg' : ''}`}>
                                    {/* Аватар */}
                                    <div className="flex justify-center">
                                        <img src={actor?.authorAvatar || DefaultAvatar} alt='avatar' className="w-[70px] h-[70px] rounded-full object-cover" />
                                    </div>

                                    {/* Текст уведомления */}
                                    <div className="flex flex-col pr-4">
                                        {/* Берем актуальный никнейм из MOCK_USERS */}
                                        <span className="font-montserrat text-[16px] tracking-[0.2px] font-semibold leading-6">
                                            {actor?.username || 'Пользователь'}
                                        </span>
                                        <span className="font-montserrat text-[14px] tracking-[0.2px] leading-5 text-gray-700">
                                            {notif.type === 'SUBSCRIBE' && 'подписался(-ась) на ваши рецепты.'}
                                            {notif.type === 'LIKE' && 'поставил(-а) “Нравится” вашему рецепту.'}
                                            {notif.type === 'COMMENT' && `прокомментировал(-а) ваш рецепт: ${notif.message?.slice(0, 30)}...`}
                                        </span>
                                        <span className="font-montserrat text-[12px] font-light tracking-[0.2px] text-gray-400 mt-1">{notif.createdAt}</span>
                                    </div>

                                    {/* Правая часть (Кнопка или Картинка поста) */}
                                    <div className="flex justify-end pr-4">
                                        {notif.type === 'SUBSCRIBE' ? (
                                            <button
                                                onClick={() => notif.actorId && toggleSubscription(notif.actorId)}
                                                className={`px-2 w-[180px] h-[30px] flex items-center justify-center rounded-[5px] transition-colors 
                                                    ${subscribed
                                                        ? 'bg-[#8F94989C] hover:bg-[#7ACDFC]'
                                                        : 'bg-[#23A6F0] hover:bg-[#7ACDFC]'
                                                    }`}
                                            >
                                                <span className="font-montserrat text-white text-[14px] font-bold tracking-[0.2px] leading-4 whitespace-nowrap">
                                                    {subscribed ? 'Вы подписаны' : 'Подписаться в ответ'}
                                                </span>
                                            </button>
                                        ) : (
                                            // Берем актуальную картинку из MOCK_POSTS
                                            post && <img src={post.image} alt="post" className="w-[100px] h-[85px] rounded-[10px] object-cover" />
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        // --- РЕНДЕР ДЛЯ СИСТЕМНЫХ СООБЩЕНИЙ (Жалобы, Предупреждения) ---
                        if (notif.type === 'WARNING' || notif.type === 'REPORT') {
                            return (
                                <div key={notif.id} className="w-full border-t border-b border-[#D9D9D9] py-3 mt-2">
                                    <h3 className={`font-montserrat text-[20px] font-semibold tracking-[0.2px] leading-7 ${notif.type === 'WARNING' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {notif.type === 'WARNING' ? 'Предупреждение' : 'Статус жалобы'}
                                    </h3>
                                    <p className="font-montserrat text-[14px] tracking-[0.2px] leading-6 text-gray-700 mt-1">
                                        {notif.message}
                                    </p>
                                    <span className="font-montserrat text-[12px] font-light tracking-[0.2px] text-gray-400 block mt-2">{notif.createdAt}</span>
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            )}
        </div>
    );
}