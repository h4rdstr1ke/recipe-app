import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AvatarDefault from '../../assets/defaultAvatar.svg';
import BanIcon from '../../assets/icons/ban.svg?react';
import CommentIcon from '../../assets/icons/comment.svg?react';
import { LikeIcon } from '../../components/icons/LikeIcon';
import { FavoritesIcon } from '../../components/icons/FavoritesIcon';
import StarIcon from '../../assets/icons/starRating.svg?react';
import UnwnantedIcon from '../../assets/icons/unwanted.svg?react';
import AllergenIcon from '../../assets/icons/allergen.svg?react';

import Complaint from '../complaint/Сomplaint';

import { usePostStore } from '../../stores/postStore';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import type { Post } from '../../types';

import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Publication({ post }: { post: Post }) {
    const navigate = useNavigate();

    /** * ПОДПИСКИ НА СТОРЫ
     * Достаем данные точечно, чтобы компонент перерисовывался только при их изменении.
     */
    // Используем селектор для токена, чтобы isAuthenticated стал реактивным (true/false)
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const user = useAuthStore((state) => state.user);

    // Данные настроек пользователя (лайки, избранное, подписки)
    const { settings, toggleSubscription, isSubscribed, toggleLike, toggleFavorite } = useUserSettingsStore();
    // Методы для обновления счетчиков в ленте
    const { updateLikeCount, updateFavoriteCount } = usePostStore();

    // Проверяем статус подписки на автора
    const subscribed = isSubscribed(post.authorId);

    // Проверка состояния лайка и избранного текущего поста
    const isLiked = settings?.likedPosts.includes(post.id) || false;
    const isFavorited = settings?.favoritePosts.includes(post.id) || false;

    /* Константы для адаптивности */
    const isMobile = useMediaQuery('(max-width: 768px)');

    /* Состояние модального окна жалоб */
    const [isComplaintOpen, setIsComplaintOpen] = useState(false);

    /* Состояние видимости предупреждения об авторизации */
    const [showAuthWarning, setShowAuthWarning] = useState(false);

    /**
     * ОБРАБОТЧИКИ СОБЫТИЙ
     * Используем e.stopPropagation(), чтобы клик по кнопке не "пролетал" 
     * до родительского контейнера и не вызывал переход на страницу рецепта.
     */

    const handleSubscribe = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            {
                setShowAuthWarning(true);
                return;
            }
        }
        toggleSubscription(post.authorId);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            {
                setShowAuthWarning(true);
                return;
            }
        }

        toggleLike(post.id);
        // Оптимистично обновляем счетчик: если сейчас лайка нет, прибавляем 1
        updateLikeCount(post.id, !isLiked);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            {
                setShowAuthWarning(true);
                return;
            }
        }

        toggleFavorite(post.id);
        updateFavoriteCount(post.id, !isFavorited);
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/publication/${post.id}#comments-section`);
    };

    const handleCardClick = () => {
        // Программный переход, заменяющий внешний <Link>
        navigate(`/publication/${post.id}`);
    };

    // Логика предупреждений об ингредиентах
    const hasAllergen = settings && post.products?.some(
        product => settings.allergens.some(allergen => allergen.id === product.id)
    );
    const hasUnwanted = settings && post.products?.some(
        product => settings.unwanted.some(unwantedItem => unwantedItem.id === product.id)
    );
    const showWarnings = isAuthenticated && settings && (hasAllergen || hasUnwanted);

    // Определение аватара (свой или чужой)
    const isMyPost = post.authorId === user?.id;
    const displayAvatar = isMyPost
        ? (user?.avatarUrl || AvatarDefault)
        : (post.authorAvatar || AvatarDefault);

    // Вспомогательная функция для правильного склонения русских слов
    const getPlural = (number: number, one: string, two: string, five: string) => {
        let n = Math.abs(number) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) return five;
        if (n1 > 1 && n1 < 5) return two;
        if (n1 === 1) return one;
        return five;
    };

    // Функция превращения "01:30:00" в "1 час 30 минут"
    const formatCookingTime = (timeStr?: string) => {
        if (!timeStr) return '';

        // Разбиваем строку по двоеточию
        const parts = timeStr.split(':');
        if (parts.length < 2) return timeStr;

        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);

        const hText = hours > 0 ? `${hours} ${getPlural(hours, 'час', 'часа', 'часов')}` : '';
        const mText = minutes > 0 ? `${minutes} ${getPlural(minutes, 'минута', 'минуты', 'минут')}` : '';

        if (hText && mText) return `${hText} ${mText}`;
        if (hText) return hText;
        if (mText) return mText;

        return '0 минут'; // На случай "00:00:00"
    };

    return (
        <div
            onClick={handleCardClick}
            className={`cursor-pointer ${isMobile ? 'w-[100%] max-w-[400px]' : 'w-[550px]'} flex flex-col border-[2px] border-[#E6E6E6]`}
        >
            {/* Шапка карточки */}
            <div className="flex py-[5px] justify-between items-center border-b-[2px] border-[#E6E6E6]">
                <Link
                    to={`/profile/${post.authorId}`}
                    onClick={(e) => e.stopPropagation()} // Чтобы клик не триггерил переход к посту
                    className='flex ml-[22px] gap-2 items-center hover:opacity-80 transition-opacity'
                >
                    <img
                        src={displayAvatar}
                        className='w-[35px] h-[35px] object-cover rounded-full select-none'
                        alt="avatar"
                    />
                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>
                        {post?.username}
                    </span>
                </Link>
                {/* Условие: если это мой пост, выводим текст, иначе — кнопку */}
                {isMyPost ? (
                    <span className='mr-[22px] font-montserrat text-[14px] tracking-[0.2px] text-[#737373] font-light '>
                        Это Вы
                    </span>
                ) : (
                    <button
                        className={`${isMobile ? 'w-[140px] h-[30px]' : 'w-[150px] h-[30px]'} flex items-center justify-center mr-[9px] rounded-[10px] md:rounded-[5px] active:scale-95 transition-all ${subscribed
                            ? `bg-[#8F94989C]`
                            : `bg-[#23A6F0]`
                            }`}
                        onClick={handleSubscribe}
                    >
                        <span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] font-bold'>
                            {subscribed ? 'Вы подписаны' : 'Подписаться'}
                        </span>
                    </button>
                )}
            </div>

            {/* Изображение поста */}
            <div className="relative">
                <img src={post.image} loading="lazy" className={`${isMobile ? 'h-[250px] w-[100%]' : 'h-[344px] w-[100%]'} object-cover`} alt="post" /> {/* loading:lazy временно пока нету пагинации */}
                <div className='absolute top-0 right-0 flex flex-col mx-1 mt-1'>
                    <div className='w-[70px] h-[30px] flex items-center justify-center gap-1 border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>
                        <span className='font-montserrat text-[20px] text-[#000000] font-bold'>{post?.rating?.rating || 0}</span>
                        <StarIcon className='w-[20px] h-[20px]' />
                    </div>
                </div>
                <div className='absolute bottom-0 right-0 mx-1 mb-2'>
                    <span className='px-[12px] py-[3px] font-montserrat text-[16px] text-[#000000] font-bold border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>
                        {formatCookingTime(post.timeCooking)}
                    </span>
                </div>
            </div>

            {/* Панель взаимодействия (Лайки, комменты, избранное) */}
            <div className='flex border-t-[2px] items-center justify-between'>
                <div className='flex -mt-[2px] pb-[6px] pt-[7px] gap-4 md:gap-2 px-[7px] border-b-[2px] border-t-[2px] border-r-[2px] border-[#E6E6E6] rounded-r-[10px]'>
                    <div className='flex items-center gap-2 md:gap-1 cursor-pointer' onClick={handleLike}>
                        <LikeIcon
                            isLiked={isLiked}
                            className={`w-[22px] h-[22px] md:w-[26px] md:h-[26px] 
                                transition-transform duration-200 ease-out 
                                hover:scale-105 
                                active:scale-90 
                                ${isLiked ? 'text-[#FF0000] drop-shadow-md' : 'text-black'}`}
                        />
                        <span className='font-montserrat md:text-[20px] font-medium text-black'>
                            {post.likesCount}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 md:gap-1' onClick={handleCommentClick}>
                        <CommentIcon className='w-[22px] h-[22px] md:w-[25px] md:h-[25px] 
                        transition-transform duration-200 ease-out 
                                hover:scale-105
                        ' />
                        <span className='font-montserrat md:text-[20px] font-medium'>{post.commentsCount}</span>
                    </div>
                    <div className='flex items-center gap-2 md:gap-1' onClick={handleFavorite}>
                        <FavoritesIcon
                            isFavorited={isFavorited}
                            className={`w-[22px] h-[22px] md:w-[25px] md:h-[25px]
                                transition-transform duration-200 ease-out 
                                hover:scale-105 
                                active:scale-90
                                ${isFavorited ? 'text-[#FFFF56] drop-shadow-md' : 'text-black'}`}
                        />
                        <span className='font-montserrat md:text-[20px] font-medium'>{post.favoritesCount}</span>
                    </div>
                    <BanIcon
                        className="cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setIsComplaintOpen(true); }}
                    />
                </div>

                {/* Предупреждения об аллергенах */}
                {showWarnings && (
                    <div className='flex gap-2 mr-1'>
                        {hasAllergen && (<div className="relative group">
                            <AllergenIcon className='w-[30px] h-[30px] cursor-help' />
                            <div className="absolute bottom-full mb-2 right-0 px-2 py-1 border-[1px] border-[#DF1E1E] bg-[#FFDEDE] font-montserrat font-medium text-[16px] tracking-[0.2px] leading-6 text-[#E0232E] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Содержит аллергены
                            </div>
                        </div>)}
                        {hasUnwanted && (<div className="relative group">
                            <UnwnantedIcon className='w-[30px] h-[30px] cursor-help' />
                            <div className="absolute bottom-full mb-2 right-0 px-2 py-1 border-[1px] border-[#E77C40] bg-[#FFF6EF] font-montserrat font-medium text-[16px] tracking-[0.2px] leading-6 text-[#E77C40] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Содержит нежелательные ингредиенты
                            </div>
                        </div>)}
                    </div>
                )}
            </div>

            {/* Текстовая часть */}
            <div className='flex mt-[6px] flex-col pl-[7px] gap-[6px]'>
                <span className='font-montserrat text-[20px] text-[#000000] font-bold leading-7'>{post.title}</span>
                <span className='font-montserrat text-[16px] text-[#737373] line-clamp-2'>{post.description}</span>
            </div>
            <div className='flex w-[100%] pr-[10px] pb-[5px] justify-end items-center'>
                <span className='font-montserrat text-[16px] text-[#737373] font-medium'>{post?.date}</span>
            </div>

            {isComplaintOpen && <Complaint onClose={() => setIsComplaintOpen(false)} />}
            {/* Модальное окно предупреждения об авторизации */}
            {showAuthWarning && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => {
                        e.stopPropagation(); // Не даем клику уйти в карточку
                        setShowAuthWarning(false); // Закрываем при клике на фон
                    }}
                >
                    <div
                        className="bg-white p-6 rounded-[10px] w-[90%] max-w-[400px] flex flex-col items-center shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Блокируем закрытие при клике на само окно
                    >
                        <h3 className="font-montserrat text-[20px] tracking-[0.2px] font-bold text-center mb-5">
                            Требуется авторизация
                        </h3>
                        <div className="flex gap-5 w-full">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAuthWarning(false);
                                }}
                                className="flex-1 py-2 rounded-[5px] border-[2px] border-[#23A6F0] text-[#23A6F0] tracking-[0.2px] font-montserrat font-bold transition-all hover:bg-[#F0F9FF]"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/login');
                                    setShowAuthWarning(false);
                                }}
                                className="flex-1 py-2 rounded-[5px] bg-[#23A6F0] text-white font-montserrat tracking-[0.2px] font-bold transition-all hover:bg-[#7ACDFC]"
                            >
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}