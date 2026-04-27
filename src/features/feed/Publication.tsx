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

// 1. Обновляем импорты сторов и типов
import { usePostStore } from '../../stores/postStore';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import type { Post } from '../../types';

import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Publication({ post }: { post: Post }) {
    // 2. Достаем новые объединенные экшены (toggle)
    const { isAuthenticated } = useAuthStore();
    const { settings, toggleSubscription, isSubscribed, toggleLike, toggleFavorite } = useUserSettingsStore();
    const { updateLikeCount, updateFavoriteCount } = usePostStore();

    const subscribed = isSubscribed(post.authorId);

    /* Для мобилки */
    const isMobile = useMediaQuery('(max-width: 768px)');

    /* Модалка */
    const [isComplaintOpen, setIsComplaintOpen] = useState(false);

    const handleBanClick = () => {
        setIsComplaintOpen(true);
    };

    const handleCloseModal = () => {
        setIsComplaintOpen(false);
    };

    // 3. Обработчики стали в два раза короче!
    const handleSubscribe = () => {
        toggleSubscription(post.authorId);
    };

    const handleLike = () => {
        if (!isAuthenticated) {
            // TODO: Уведомление о необходимости входа
            return;
        }
        // Меняем в профиле (красим сердечко)
        toggleLike(post.id);
        // Меняем счетчик в посте (передаем true, если СЕЙЧАС не лайкнут, чтобы сделать +1)
        updateLikeCount(post.id, !isLiked);;
    };

    const handleFavorite = () => {
        if (!isAuthenticated) return;

        toggleFavorite(post.id); // Красим флажок
        updateFavoriteCount(post.id, !isFavorited); // Меняем счетчик
    };

    // Для перехода к коментариям =============
    const navigate = useNavigate();
    // Функция перехода к комментарию
    const handleCommentClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Останавливаем переход по основной ссылке карточки
        navigate(`/publication/${post.id}#comments-section`); // Переходим сразу к якорю
    };
    // ====================
    // Проверка на лайк
    const isLiked = settings?.likedPosts.includes(post.id) || false;

    // Проверка на сохранненон
    const isFavorited = settings?.favoritePosts.includes(post.id) || false;

    // проходимся по массиву объектов products, берем у каждого product.name 
    // и проверяем, есть ли это имя в списке аллергенов
    const hasAllergen = settings && post.products?.some(
        product => settings.allergens.includes(product.name)
    );

    const hasUnwanted = settings && post.products?.some(
        product => settings.unwanted.includes(product.name)
    );
    const showWarnings = isAuthenticated && settings && (hasAllergen || hasUnwanted);

    return (
        <div className={` ${isMobile ? 'w-[100%] max-w-[400px]' : 'w-[550px]'} flex flex-col border-[2px] border-[#E6E6E6]`}>
            <div className="flex py-[5px] justify-between items-center border-b-[2px] border-[#E6E6E6]">
                <div className='flex ml-[22px] gap-2 items-center'>
                    {/* Аватарку тоже можно сделать динамической, если она есть: src={post.authorAvatar || avatar} */}
                    <Link to={`/profile/${post.authorId}`}>
                        <img src={post.authorAvatar || AvatarDefault} className='w-[35px] h-[35px] object-cover rounded-full select-none' alt="avatar" />
                    </Link>
                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>
                        {post?.username}
                    </span>
                </div>
                <button
                    className={`${isMobile ? 'w-[140px] h-[30px]' : 'w-[150px] h-[30px]'} flex items-center justify-center mr-[9px] rounded-[10px] md:rounded-[5px] md:transition-all md:duration-300 md:transform md:hover:scale-100 active:scale-95 ${subscribed
                        ? 'bg-[#8F94989C] hover:bg-[#7ACDFC]'
                        : 'bg-[#23A6F0] hover:bg-[#7ACDFC]'
                        }`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubscribe();
                    }}
                >
                    <span className={`font-montserrat ${isMobile ? 'text-[14px] leading-3' : 'text-[14px] leading-7'} text-[#FFFFFF] tracking-[0.2px] font-bold`}>
                        {subscribed ? 'Вы подписаны' : 'Подписаться'}
                    </span>
                </button>
            </div>
            <Link to={`/publication/${post.id}`}>
                <div className="relative ">
                    {/* Картинку поста тоже меняем на динамическую */}
                    <img src={post.image} className={`
                        ${isMobile ? 'h-[250px] w-[100%]' : 'h-[344px] w-[100%]'} object-cover`} alt="post" />

                    <div className='absolute top-0 right-0 flex flex-col mx-1 mt-1'>
                        <div className='w-[56px] h-[30px] flex items-center justify-center gap-1 border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold'>
                                {post?.rating?.rating || 0}
                            </span>
                            <StarIcon className='w-[20px] h-[20px]' />
                        </div>
                    </div>
                    <div className='absolute bottom-0 right-0 mx-1 mb-2'>
                        <span className='px-[12px] py-[3px] font-montserrat text-[16px] text-[#000000] tracking-[0.2px] leading-7 font-bold border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>
                            {post.timeCooking} {/* Было захардкожено "50 минут" */}
                        </span>
                    </div>
                </div>

                <div className='flex border-t-[2px] items-center justify-between '>
                    <div className='flex -mt-[2px] pb-[6px] pt-[7px] gap-4 md:gap-2 px-[7px] border-b-[2px] border-t-[2px] border-r-[2px] border-[#E6E6E6] rounded-r-[10px]'
                        onClick={(e) => {
                            e.preventDefault();
                        }}>
                        <div className='flex items-center gap-1'>
                            <LikeIcon
                                isLiked={isLiked}
                                className={`
                                    w-[22px] h-[22px]
                                    md:w-[26px] md:h-[26px] cursor-pointer ${isLiked ? 'text-[#FF0000]' : 'text-black'}`}
                                onClick={handleLike}
                            />
                            <span className='font-montserrat md:text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>
                                {post.likesCount}
                            </span>
                        </div>
                        <div className='flex items-center gap-1 cursor-pointer'>
                            <CommentIcon className='w-[22px] h-[22px] md:w-[25px] md:h-[25px]' onClick={handleCommentClick} />
                            <span className='font-montserrat md:text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>{post.commentsCount}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <FavoritesIcon
                                isFavorited={isFavorited}
                                className={`w-[22px] h-[22px] md:w-[25px] md:h-[25px] cursor-pointer ${isFavorited ? 'text-[#FFFF56]' : 'text-black'}`}
                                onClick={handleFavorite}
                            />
                            <span className='font-montserrat md:text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>
                                {post.favoritesCount}
                            </span>
                        </div>
                        <BanIcon className="cursor-pointer" onClick={handleBanClick} />
                    </div>

                    {showWarnings && (
                        <div className='flex gap-2 mr-1 '>
                            {hasAllergen && (
                                <div className="relative group">
                                    <AllergenIcon className='w-[30px] h-[30px] cursor-help' />
                                    <div className="absolute bottom-full mb-2 right-0 px-2 py-1 border-[1px] border-[#DF1E1E] bg-[#FFDEDE] font-montserrat font-medium text-[16px] tracking-[0.2px] leading-6 text-[#E0232E] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        Содержит аллергены
                                    </div>
                                </div>
                            )}
                            {hasUnwanted && (
                                <div className="relative group">
                                    <UnwnantedIcon className='w-[30px] h-[30px] cursor-help' />
                                    <div className="absolute bottom-full mb-2 right-0 px-2 py-1 border-[1px] border-[#E77C40] bg-[#FFF6EF] font-montserrat font-medium text-[16px] tracking-[0.2px] leading-6 text-[#E77C40] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        Содержит нежелательные ингредиенты
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Динамические Title и Description */}
                <div className='flex mt-[6px] flex-col pl-[7px] gap-[6px] '>
                    <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold leading-7'>
                        {post.title}
                    </span>
                    <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] leading-4 line-clamp-2'>
                        {post.description}
                    </span>
                </div>
                <div className='flex w-[100%] pr-[10px] pb-[5px] justify-end items-center'>
                    <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] font-medium leading-7'>
                        {post?.date}
                    </span>
                </div>
            </Link>

            {isComplaintOpen && (
                <Complaint onClose={handleCloseModal} />
            )}
        </div>
    )
}