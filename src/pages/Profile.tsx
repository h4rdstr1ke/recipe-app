import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import avatarDefault from '../assets/defaultAvatar.svg';
import PublicationsIcon from '../assets/icons/publications.svg?react';
import SavedIcon from '../assets/icons/saved.svg?react';

import { useAuthStore } from '../stores/authStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useProfileStore } from '../stores/profileStore';

import { useMediaQuery } from '../hooks/useMediaQuery';

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

    // Эта константа будет true, если экран меньше 768px
    const isMobile = useMediaQuery('(max-width: 768px)');

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
        <div className='flex items-center flex-col pt-[20px] md:pt-[35px] min-h-[100vh]'>
            <div className='flex flex-col px-[15px] md:px-0'>
                <div className='w-[100%] md:w-[900px] flex items-start gap-3 md:gap-8'>
                    <img
                        src={currentProfile.avatarUrl || avatarDefault}
                        className='w-[80px] h-[80px] md:w-[200px] md:h-[200px] object-cover rounded-full select-none'
                        alt='Avatar'
                    />
                    <div className='w-[100%] flex flex-col gap-3'>
                        <div>
                            <h1 className='font-montserrat leading-relaxed text-[18px] md:leading-7 md:text-[36px] font-bold'>{currentProfile.nickname}</h1>
                            <p className='font-montserrat text-[16px] md:pt-2 md:text-[20px] '>{currentProfile.name}</p>
                        </div>
                        <div className='flex w-[100%] gap-3 md:gap-none md:justify-between'>
                            <div className='flex flex-col md:flex-row md:gap-1'>
                                <span className='font-montserrat font-semibold leading-4 md:leading-7 md:text-[20px]'>{userPosts.length} </span>
                                <span className='font-montserrat leading-4 text-[12px] md:leading-7 md:text-[20px]'>
                                    Публикации
                                </span>
                            </div>
                            <div className='flex flex-col md:flex-row md:gap-1 cursor-pointer hover:text-gray-500 transition-colors'
                                onClick={() => setIsSubscribersOpen(true)}>
                                <span className='font-montserrat font-semibold leading-4 md:leading-7 md:text-[20px]'>{currentProfile.subscribersCount} </span>
                                <span className='font-montserrat leading-4 text-[12px] md:leading-7 md:text-[20px]'>Подписчиков</span>
                            </div>
                            {/* Открытие модалки подписок */}
                            <div className='flex flex-col md:flex-row md:gap-1 cursor-pointer hover:text-gray-500 transition-colors'
                                onClick={() => setIsSubscriptionsOpen(true)}>
                                <span className='font-montserrat font-semibold leading-4 md:leading-7 md:text-[20px]'>{currentProfile.subscriptionsCount} </span>
                                <span className='font-montserrat leading-4 text-[12px] md:leading-7 md:text-[20px]'>Подписок</span>
                            </div>
                        </div>
                        {!isMobile && <span className='font-montserrat text-[20px] leading-7'>
                            {currentProfile.bio || 'Описание профиля отсутствует.'}
                        </span>}
                    </div>
                </div>
                {isMobile && <span className='font-montserrat mt-[20px] text-[16px] leading-4'>
                    {currentProfile.bio || 'Описание профиля отсутствует.'}
                </span>}
                {/* Редактировать (для себя) или Подписаться (для других) */}
                {isMyProfile ? (
                    <Link to="/profileEdit">
                        <button className='flex items-center justify-center w-[200px] h-[20px] mt-[20px] md:w-[360px] md:h-[40px] md:mt-[40px] border-[1px] rounded-[5px] border-[#E6E6E6] bg-[#F9F9F9] hover:bg-[#efefef] transition-colors'>
                            <span className='font-montserrat text-[12px] md:leading-7 md:text-[20px]'>Редактировать профиль</span>
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
            <nav className='pt-[20px] gap-[40px] md:pt-[35px] md:gap-[150px] pb-[5px] md:pb-[10px] flex  justify-center border-b-2 md:border-b-4 border-[#D9D9D9] w-[100%]'>
                <PublicationsIcon
                    className={`w-[30px] h-[30px] md:w-[40px] md:h-[40px] cursor-pointer ${isMyProfile ? 'hover:text-[#9B9B9B]' : 'hover:none'} transition duration-300 ${activeTab === 'publications' ? 'text-black' : 'text-[#C0BFBF]'}`}
                    onClick={() => setActiveTab('publications')}
                />
                {isMyProfile && (
                    <SavedIcon
                        className={`w-[30px] h-[30px] md:w-[40px] md:h-[40px] cursor-pointer hover:text-[#9B9B9B] transition duration-300 ${activeTab === 'saved' ? 'text-black' : 'text-[#C0BFBF]'}`}
                        onClick={() => setActiveTab('saved')}
                    />
                )}
            </nav>

            {/* СЕТКА ПОСТОВ */}
            <div className='grid grid-cols-3 gap-[1px] md:gap-1 md:w-[70%] mt-2 md:mt-4 pb-10'>
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