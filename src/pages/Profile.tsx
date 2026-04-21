import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import avatarDefault from '../assets/avatar.svg';
import PublicationsIcon from '../assets/icons/profile/publications.svg?react';
import SavedIcon from '../assets/icons/profile/saved.svg?react';

import { useAuthStore } from '../stores/authStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useProfileStore } from '../stores/profileStore';

export default function Profile() {
    // Берем ID из URL (например, /profile/user2). Если его нет — мы в своем профиле.
    const { id } = useParams<{ id: string }>();

    // Данные авторизации и настроек (наши личные)
    const { user: authUser, isAuthenticated } = useAuthStore();
    const { settings, isSubscribed, toggleSubscription } = useUserSettingsStore();

    // Данные из стора профиля
    const {
        currentProfile,
        userPosts,
        favoritePosts,
        fetchProfile,
        fetchUserPosts,
        fetchFavoritePosts,
        clearProfileData,
        isLoading,
        error
    } = useProfileStore();

    const [activeTab, setActiveTab] = useState<'publications' | 'saved'>('publications');

    // Определяем, наш ли это профиль
    const isMyProfile = !id || id === authUser?.id;
    // Определяем ID того, чьи данные нужно загрузить
    const targetUserId = id || authUser?.id;

    useEffect(() => {
        if (!targetUserId) return;

        // Загружаем данные человека и его посты
        fetchProfile(targetUserId);
        fetchUserPosts(targetUserId);

        // Если смотрим себя — подгружаем сохраненки из наших настроек
        if (isMyProfile && settings?.favoritePosts) {
            fetchFavoritePosts(settings.favoritePosts);
        }

        // Очистка при закрытии страницы
        return () => clearProfileData();
    }, [targetUserId, isMyProfile, settings?.favoritePosts]);

    // Если грузимся или профиль не найден
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

    // Решаем, какой массив постов крутить в цикле .map()
    const postsToRender = activeTab === 'publications' ? userPosts : favoritePosts;
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
                            <span className='font-montserrat text-[20px]'>
                                <span className='font-semibold'>{currentProfile.subscribersCount} </span>Подписчиков
                            </span>
                            <span className='font-montserrat text-[20px]'>
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
                    <button
                        onClick={() => isAuthenticated && toggleSubscription(currentProfile.id)}
                        className={`w-[360px] h-[40px] rounded-[5px] transition-colors ${subscribed ? 'bg-[#8F94989C]' : 'bg-[#23A6F0]'
                            }`}
                    >
                        <span className='font-montserrat text-[20px] text-white font-bold'>
                            {subscribed ? 'Вы подписаны' : 'Подписаться'}
                        </span>
                    </button>
                )}
            </div>

            {/* НАВИГАЦИЯ Скрываем вкладку "Сохраненное" у чужих*/}
            <nav className='pt-[35px] pb-[10px] flex gap-[150px] justify-center border-b-4 border-[#D9D9D9] w-[100%]'>
                <PublicationsIcon
                    className={`cursor-pointer ${activeTab === 'publications' ? 'text-black' : 'text-[#C0BFBF]'}`}
                    onClick={() => setActiveTab('publications')}
                />
                {isMyProfile && (
                    <SavedIcon
                        className={`cursor-pointer ${activeTab === 'saved' ? 'text-black' : 'text-[#C0BFBF]'}`}
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
        </div>
    );
}