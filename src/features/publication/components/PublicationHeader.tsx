import StarIcon from '../../../assets/icons/starRating.svg?react';
import { LikeIcon } from '../../../components/icons/LikeIcon';
import { FavoritesIcon } from '../../../components/icons/FavoritesIcon';
import CommentIcon from '../../../assets/icons/comment.svg?react';
import BanIcon from '../../../assets/icons/ban.svg?react';
import AllergenIcon from '../../../assets/icons/allergen.svg?react';
import UnwnantedIcon from '../../../assets/icons/unwanted.svg?react';

import Button from '../../../components/button/Button';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../../stores/authStore';
import { useState } from 'react';
import AuthWarningModal from '../../../components/modals/AuthWarningModal';

type PublicationHeaderProps = {
    // Данные автора
    authorId: string;
    avatar: string;
    username: string;
    authorName: string;
    onSubscribe: () => void;

    // Данные поста
    image: string;
    time: string;
    title: string;
    rating?: {
        rating: number;
        quantity: number;
    };
    description: string;
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    postId: string;

    // Действия
    isLiked: boolean;
    isFavorited: boolean;
    isSubscribed: boolean;
    onLike: () => void;
    onFavorite: () => void;
    onComment: () => void;
    onBan: () => void;

    // Предупреждения
    hasAllergen: boolean | null;
    hasUnwanted: boolean | null;

    isMyPost: boolean;
};

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

export default function PublicationHeader({
    authorId,
    postId,
    avatar,
    username,
    authorName,
    onSubscribe,
    image,
    time,
    title,
    rating,
    description,
    likesCount,
    favoritesCount,
    commentsCount,
    isLiked,
    isFavorited,
    isSubscribed,
    onLike,
    onFavorite,
    onComment,
    onBan,
    hasAllergen,
    hasUnwanted,
    isMyPost,
}: PublicationHeaderProps) {
    // ИСП проверяем реального пользователя 
    // const { user } = useAuthStore();
    // const isMyPost = username === user?.nickname;
    const navigate = useNavigate();

    const isAuthenticated = useAuthStore((state) => !!state.token);
    const [showAuthWarning, setShowAuthWarning] = useState(false);
    // Функция-защитник: проверяет авторизацию перед действием
    const withAuth = (action: () => void) => {
        return (e?: React.MouseEvent) => {
            if (e) e.stopPropagation();
            if (!isAuthenticated) {
                setShowAuthWarning(true);
            } else {
                action();
            }
        };
    };

    return (
        <div className="w-[100%] flex flex-col">
            {/* Верхний блок - автор */}
            {isMyPost ? (

                <Button onClick={() => navigate(`/PostEdit/${postId}`)} className='w-[220px] h-[30px] text-[14px] ml-auto'>Редактировать рецепт</Button>

            ) : (
                <div className="flex py-[5px] justify-between items-center">
                    <Link to={`/profile/${authorId}`} className='flex gap-4 items-center hover:opacity-80 transition-opacity'>
                        <img src={avatar} className='w-[50px] h-[50px] object-cover rounded-full select-none' alt="avatar" />
                        <div className='flex flex-col items-start'>
                            <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{username}</span>
                            <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{authorName}</span>
                        </div>
                    </Link>
                    {!isMyPost && (
                        <button
                            className={`w-[140px] h-[30px] md:w-[150px] md:h-[30px] rounded-[10px] md:rounded-[5px] active:scale-95 transition-all ${isSubscribed ? 'bg-[#8F94989C]' : 'bg-[#23A6F0]'
                                }`}
                            onClick={withAuth(onSubscribe)}
                        >
                            <span className='font-montserrat text-[14px] text-[#FFFFFF] font-bold leading-7'>
                                {isSubscribed ? 'Вы подписаны' : 'Подписаться'}
                            </span>
                        </button>
                    )}
                </div>
            )
            }
            {/* Фото блок */}
            <div className="relative mt-2">
                <img src={image} className='md:h-[344px] object-cover w-[100%] border-[2px] border-[#E6E6E6] rounded-[10px]' alt="post" />
                <div className='absolute bottom-4 right-2'>
                    <span className='px-[12px] py-[3px] font-montserrat text-[16px] text-[#000000] tracking-[0.2px] leading-7 font-bold border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>{formatCookingTime(time)}</span>
                </div>
            </div>

            {/* Блок взаимодействия */}
            <div className='flex mt-4 items-center justify-between'>
                <div className='flex md:max-w-[500px] gap-4 md:gap-2'>
                    <div className='flex items-center gap-2 md:gap-1'>
                        <LikeIcon
                            isLiked={isLiked}
                            className={`cursor-pointer 
                                transition-transform duration-200 ease-out 
                                hover:scale-105 
                                active:scale-90 
                                ${isLiked ? 'text-[#FF0000] drop-shadow-md' : 'text-black'}`}
                            onClick={withAuth(onLike)}
                        />
                        <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>{likesCount}</span>
                    </div>
                    <div className='flex items-center gap-2 md:gap-1'>
                        <CommentIcon className='
                        transition-transform duration-200 ease-out 
                                hover:scale-105 
                                active:scale-90 
                        w-[25px] cursor-pointer' onClick={onComment} />
                        <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>{commentsCount}</span>
                    </div>
                    <div className='flex items-center gap-2 md:gap-1'>
                        <FavoritesIcon
                            isFavorited={isFavorited}
                            className={`cursor-pointer 
                                transition-transform duration-200 ease-out 
                                hover:scale-105 
                                active:scale-90 
                                ${isFavorited ? 'text-[#FFFF56] drop-shadow-md' : 'text-black'}`}
                            onClick={withAuth(onFavorite)}
                        />
                        <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] tracking-[0.2px] leading-7 font-medium'>{favoritesCount}</span>
                    </div>
                    <BanIcon className='w-[25px] cursor-pointer' onClick={withAuth(onBan)} />
                </div>

                {/* Предупреждения */}
                {(hasAllergen || hasUnwanted) && (
                    <div className='flex gap-2 -mt-1'>
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

            {/* Заголовок и описание */}
            <div className='flex mt-4 flex-col md:gap-[14px]'>
                <div className='flex justify-between items-center'>
                    <span className='font-montserrat text-[24px] md:text-[28px] text-[#000000] tracking-[0.2px] font-bold leading-7'>{title}</span>
                    <div className='md:w-[100px] w-[70px] h-[30px] flex items-center justify-end gap-1'>
                        <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] tracking-[0.2px] font-bold'>{rating?.rating}</span>
                        <StarIcon className='w-[20px] h-[20px]' />
                        <span className='font-montserrat text-[14px] md:text-[16px] text-[#000000] tracking-[0.2px] font-light'>({rating?.quantity})</span>
                    </div>
                </div>
                <span className='font-montserrat text-[16px] md:text-[22px] text-[#737373] tracking-[0.2px] leading-6'>{description}</span>
            </div>
            {/* Вызов модалки авторизации */}
            <AuthWarningModal isOpen={showAuthWarning} onClose={() => setShowAuthWarning(false)} />
        </div >
    );
}