import { useState } from 'react';
import { Link } from 'react-router-dom';

import avatar from '../../assets/avatar.svg';
import testPost from '../../assets/testPost2.png';
import BanIcon from '../../assets/icons/feed/ban.svg?react';
import CommentIcon from '../../assets/icons/feed/comment.svg?react';
import FavoritesIcon from '../../assets/icons/feed/favorites.svg?react';
import LikeIcon from '../../assets/icons/feed/like.svg?react';
import StarIcon from '../../assets/icons/feed/star.svg?react';
import UnwnantedIcon from '../../assets/icons/feed/unwanted.svg?react';
import AllergenIcon from '../../assets/icons/feed/allergen.svg?react';

import Complaint from '../complaint/Сomplaint';

// 1. Обновляем импорты сторов и типов
import { usePostStore } from '../../stores/postStore';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import type { Post } from '../../types';

export default function Publication({ post }: { post: Post }) {
    // 2. Достаем новые объединенные экшены (toggle)
    const { toggleLike, toggleFavorite } = usePostStore();
    const { isAuthenticated } = useAuthStore();
    const { settings, toggleSubscription, isSubscribed } = useUserSettingsStore();

    const subscribed = isSubscribed(post.authorId);

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
        toggleLike(post.id);
    };

    const handleFavorite = () => {
        if (!isAuthenticated) return;
        toggleFavorite(post.id);
    };

    const hasAllergen = settings && post.ingredients.some(
        ingredient => settings.allergens.includes(ingredient)
    );

    const hasUnwanted = settings && post.ingredients.some(
        ingredient => settings.unwanted.includes(ingredient)
    );

    const showWarnings = isAuthenticated && settings && (hasAllergen || hasUnwanted);

    return (
        <div className="w-[550px] flex flex-col border-[2px] border-[#E6E6E6]">
            <div className="flex py-[5px] justify-between items-center border-b-[2px] border-[#E6E6E6]">
                <div className='flex ml-[22px] gap-2 items-center'>
                    {/* Аватарку тоже можно сделать динамической, если она есть: src={post.authorAvatar || avatar} */}
                    <img src={avatar} className='w-[35px]' alt="avatar" />
                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>
                        {post?.username}
                    </span>
                </div>
                <button
                    className={`w-[150px] h-[30px] mr-[9px] rounded-[5px] transition-all duration-300 transform hover:scale-100 active:scale-95 ${subscribed
                        ? 'bg-[#8F94989C] hover:bg-[#7ACDFC]'
                        : 'bg-[#23A6F0] hover:bg-[#7ACDFC]'
                        }`}
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubscribe();
                    }}
                >
                    <span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>
                        {subscribed ? 'Вы подписаны' : 'Подписаться'}
                    </span>
                </button>
            </div>
            <Link to={`/publication/${post.id}`}>
                <div className="relative ">
                    {/* Картинку поста тоже меняем на динамическую */}
                    <img src={post.image || testPost} className='h-[344px] w-[100%] object-cover' alt="post" />

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
                            {post.timeAgo} {/* Было захардкожено "50 минут" */}
                        </span>
                    </div>
                </div>

                <div className='flex border-t-[2px] items-center justify-between'>
                    <div className='flex -mt-[2px] pb-[6px] pt-[7px] gap-2 px-[7px] border-b-[2px] border-t-[2px] border-r-[2px] border-[#E6E6E6] rounded-r-[10px]'
                        onClick={(e) => {
                            e.preventDefault();
                        }}>
                        <div className='flex items-center gap-[4px]'>
                            <LikeIcon
                                className={`cursor-pointer ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                                onClick={handleLike}
                            />
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>
                                {post.likesCount}
                            </span>
                        </div>
                        <div className='flex items-center gap-[4px]'>
                            <FavoritesIcon
                                className={`cursor-pointer ${post.isFavorited ? 'fill-yellow-500 text-yellow-500' : ''}`}
                                onClick={handleFavorite}
                            />
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>
                                {post.favoritesCount}
                            </span>
                        </div>
                        <div className='flex items-center gap-[4px]'>
                            <CommentIcon />
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>
                                {post.commentsCount}
                            </span>
                        </div>
                        <BanIcon className="cursor-pointer" onClick={handleBanClick} />
                    </div>

                    {showWarnings && (
                        <div className='flex gap-2 mr-1'>
                            {hasAllergen && (
                                <div className="relative group">
                                    <AllergenIcon className='w-[30px] h-[30px] cursor-help' />
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 border-[1px] border-[#DF1E1E] bg-[#FFDEDE] font-montserrat font-medium text-[16px] tracking-[0.2px] leading-6 text-[#E0232E] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        Содержит аллергены
                                    </div>
                                </div>
                            )}
                            {hasUnwanted && (
                                <div className="relative group">
                                    <UnwnantedIcon className='w-[30px] h-[30px] cursor-help' />
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 border-[1px] border-[#E77C40] bg-[#FFF6EF] font-montserrat font-medium text-[16px] tracking-[0.2px] leading-6 text-[#E77C40] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
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