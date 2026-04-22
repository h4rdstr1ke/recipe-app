import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import avatarDefault from '../assets/defaultAvatar.svg';
import PublicationsIcon from '../assets/icons/publications.svg?react';
import SavedIcon from '../assets/icons/saved.svg?react';

import { useAuthStore } from '../stores/authStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useProfileStore } from '../stores/profileStore';

// Импорты модалок
import SubscribersModal from '../features/profile/components/SubscribesModal';
import SubscriptionsModal from '../features/profile/components/SubscriptionsModal';

/**
 * Компонент страницы профиля пользователя.
 * Универсален: отображает как личный профиль текущего пользователя, так и публичные профили других авторов.
 */
export default function Profile() {
    // ---------------------------------------------------------
    // 1. ДАННЫЕ ИЗ МАРШРУТИЗАЦИИ (URL)
    // ---------------------------------------------------------

    // Параметр `id` из адресной строки (например, "/profile/user2" -> id = "user2").
    // Если пользователь зашел по ссылке "/profile" (без ID), значение будет undefined.
    const { id } = useParams<{ id: string }>();

    // ---------------------------------------------------------
    // 2. ДАННЫЕ ИЗ ГЛОБАЛЬНЫХ СТОРОВ (Zustand)
    // ---------------------------------------------------------

    // authUser - данные того, кто сейчас сидит за устройством (авторизован).
    // isAuthenticated - флаг, залогинен ли вообще кто-то.
    const { user: authUser, isAuthenticated } = useAuthStore();

    // Личные настройки (нужны для проверки подписок и загрузки сохраненных рецептов).
    const { settings, isSubscribed, toggleSubscription } = useUserSettingsStore();

    // Стор, отвечающий за отображаемый в данный момент профиль.
    const {
        currentProfile,
        userPosts,
        favoritePosts,
        fetchProfile,
        fetchUserPosts,
        fetchFavoritePosts,
        fetchSubscribersList,
        fetchSubscriptionsList,
        clearProfileData,
        isLoading,
        error
    } = useProfileStore();

    // ---------------------------------------------------------
    // 3. ЛОКАЛЬНЫЕ СОСТОЯНИЯ КОМПОНЕНТА
    // ---------------------------------------------------------

    // Управляет переключением вкладок "Публикации" / "Сохраненное".
    const [activeTab, setActiveTab] = useState<'publications' | 'saved'>('publications');

    // Состояния для обеих модалок
    const [isSubscribersOpen, setIsSubscribersOpen] = useState(false);
    const [isSubscriptionsOpen, setIsSubscriptionsOpen] = useState(false);

    // ---------------------------------------------------------
    // 4. ВЫЧИСЛЯЕМЫЕ КОНСТАНТЫ (Бизнес-логика)
    // ---------------------------------------------------------

    // Флаг: смотрим ли мы свой собственный профиль? 
    // True, если в URL нет ID (перешли по /profile) или если ID из URL совпадает с нашим ID.
    const isMyProfile = !id || id === authUser?.id;

    // ID того пользователя, чьи данные нам нужно запросить с сервера.
    // Если в URL есть чужой ID — берем его. Иначе берем свой ID.
    const targetUserId = id || authUser?.id;

    // ---------------------------------------------------------
    // ЭФФЕКТЫ (Жизненный цикл)
    // ---------------------------------------------------------
    useEffect(() => {
        if (!targetUserId) return;

        fetchProfile(targetUserId);
        fetchUserPosts(targetUserId);
        fetchSubscribersList(targetUserId);
        fetchSubscriptionsList(targetUserId); // Загрузка подписок

        // Загружаем вкладку "Сохраненное" только если это наш профиль
        if (isMyProfile && settings?.favoritePosts) {
            fetchFavoritePosts(settings.favoritePosts);
        }

        return () => clearProfileData();
    }, [targetUserId, isMyProfile, settings?.favoritePosts, fetchProfile, fetchUserPosts, fetchFavoritePosts, fetchSubscribersList, fetchSubscriptionsList, clearProfileData]);

    // ---------------------------------------------------------
    // 5. ВЫЧИСЛЯЕМЫЕ КОНСТАНТЫ ДЛЯ РЕНДЕРА (UI)
    // ---------------------------------------------------------

    if (isLoading) {
        return <div className="h-[100vh] flex items-center justify-center font-montserrat">Загрузка профиля...</div>;
    }

    if (error || !currentProfile) {
        return (
            <div className="h-[100vh] flex flex-col items-center justify-center font-montserrat">
                <h2 className="text-2xl font-bold mb-4">Упс!</h2>
                <p className="text-gray-500 text-lg">{error || 'Профиль не найден'}</p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-4 px-4 py-2 bg-[#23A6F0] text-white rounded-[5px]"
                >
                    Вернуться назад
                </button>
            </div>
        );
    }

    // Определяем, какой массив рецептов передать в функцию .map() для отрисовки сетки.
    const postsToRender = activeTab === 'publications' ? userPosts : favoritePosts;

    // Проверяем, подписан ли авторизованный пользователь (мы) на человека, чей профиль открыт.
    const subscribed = isSubscribed(currentProfile.id);

    return (
        <div className='flex items-center flex-col min-h-[100vh]'>
            <div className='flex flex-col'>
                <div className='w-[900px] flex items-start gap-8 py-[35px]'>
                    <img
                        src={currentProfile.avatarUrl || avatarDefault}
                        className='w-[200px] h-[200px] object-cover rounded-full select-none'
                        alt='Avatar'
                    />
                    <div className='w-[100%] flex flex-col gap-3'>
                        <div>
                            <h1 className='leading-7 font-montserrat text-[36px] font-bold'>{currentProfile.nickname}</h1>
                            <p className='pt-2 font-montserrat text-[20px]'>{currentProfile.name}</p>
                        </div>
                        <div className='flex w-[100%] justify-between'>
                            <span className='font-montserrat text-[20px]'>
                                <span className='font-semibold'>{userPosts.length} </span>Публикации
                            </span>

                            <span
                                className='font-montserrat text-[20px] cursor-pointer hover:text-gray-500 transition-colors'
                                onClick={() => setIsSubscribersOpen(true)}
                            >
                                <span className='font-semibold'>{currentProfile.subscribersCount} </span>Подписчиков
                            </span>
                            {/* Открытие модалки подписок */}
                            <span
                                className='font-montserrat text-[20px] cursor-pointer hover:text-gray-500 transition-colors'
                                onClick={() => setIsSubscriptionsOpen(true)}
                            >
                                <span className='font-semibold'>{currentProfile.subscriptionsCount} </span>Подписок
                            </span>
                        </div>
                        <span className='font-montserrat text-[20px] leading-7'>
                            {currentProfile.bio || 'Описание профиля отсутствует.'}
                        </span>
                    </div>
                </div>

                {/* Редактировать (для себя) или Подписаться (для других) */}
                {isMyProfile ? (
                    <Link to="/profileEdit">
                        <button className='w-[360px] h-[40px] border-[1px] rounded-[5px] border-[#E6E6E6] bg-[#F9F9F9] hover:bg-[#efefef] transition-colors'>
                            <span className='font-montserrat text-[20px]'>Редактировать профиль</span>
                        </button>
                    </Link>
                ) : (
                    <div className='flex gap-8'>
                        <button
                            onClick={() => isAuthenticated && toggleSubscription(currentProfile.id)}
                            className={`w-[177px] h-[35px] rounded-[5px] transition-colors ${subscribed ? 'bg-[#8F94989C]' : 'bg-[#23A6F0]'
                                }`}
                        >
                            <span className='font-montserrat text-[14px] text-white font-bold leading-7 tracking-[0.2px]'>
                                {subscribed ? 'Вы подписаны' : 'Подписаться'}
                            </span>
                        </button>
                        <button className='bg-[#FF0000] w-[177px] h-[35px] rounded-[5px]'><span className='font-montserrat text-[14px] text-white font-bold leading-7 tracking-[0.2px]'>Пожаловаться</span></button>
                    </div>
                )}
            </div>

            {/* НАВИГАЦИЯ Скрываем вкладку "Сохраненное" у чужих*/}
            <nav className='pt-[35px] pb-[10px] flex gap-[150px] justify-center border-b-4 border-[#D9D9D9] w-[100%]'>
                <PublicationsIcon
                    className={`cursor-pointer ${isMyProfile ? 'hover:text-[#9B9B9B]' : 'hover:none'} transition duration-300 ${activeTab === 'publications' ? 'text-black' : 'text-[#C0BFBF]'}`}
                    onClick={() => setActiveTab('publications')}
                />
                {isMyProfile && (
                    <SavedIcon
                        className={`cursor-pointer hover:text-[#9B9B9B] transition duration-300 ${activeTab === 'saved' ? 'text-black' : 'text-[#C0BFBF]'}`}
                        onClick={() => setActiveTab('saved')}
                    />
                )}
            </nav>

            {/* СЕТКА ПОСТОВ */}
            <div className='grid grid-cols-3 gap-1 w-[70%] mt-4 pb-10'>
                {postsToRender.map(post => (
                    <Link key={post.id} to={`/publication/${post.id}`} className="aspect-square">
                        <img src={post.image} alt={post.title} className='w-full h-full object-cover hover:opacity-90' />
                    </Link>
                ))}
            </div>

            {postsToRender.length === 0 && (
                <div className="mt-10 font-montserrat text-gray-400">Здесь пока ничего нет</div>
            )}

            {/* Рендер модалок */}
            {isSubscribersOpen && (
                <SubscribersModal onClose={() => setIsSubscribersOpen(false)} />
            )}
            {isSubscriptionsOpen && (
                <SubscriptionsModal onClose={() => setIsSubscriptionsOpen(false)} />
            )}
        </div>
    );
}