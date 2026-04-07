import avatar from '../../assets/avatar.svg';
import testPost from '../../assets/testPost2.png';
import BanIcon from '../../assets/icons/feed/ban.svg?react';
import CommentIcon from '../../assets/icons/feed/comment.svg?react';
import FavoritesIcon from '../../assets/icons/feed/favorites.svg?react';
import LikeIcon from '../../assets/icons/feed/like.svg?react';
import StarIcon from '../../assets/icons/feed/star.svg?react';
import UnwnantedIcon from '../../assets/icons/feed/unwanted.svg?react';
import AllergenIcon from '../../assets/icons/feed/allergen.svg?react';
import { usePostStore, type Post } from '../../stores/postStore';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { Link } from 'react-router-dom';

export default function Publication({ post }: { post: Post }) {
    const { likePost, unlikePost, favoritePost, unfavoritePost, subscribeToAuthor } = usePostStore();
    const { isAuthenticated } = useAuthStore();
    const { settings } = useUserSettingsStore();

    {/* 
    // Находим совпадения для подсказки по аллергенам/нежелательным продуктам
    const allergenMatches = settings?.allergens.filter(a =>
        post.ingredients.some(i => i === a)
    ) || [];

    const unwantedMatches = settings?.unwanted.filter(u =>
        post.ingredients.some(i => i === u)
    ) || [];
     */}

    // Проверяем, есть ли аллергены/нежелательные продукты в посте
    const hasAllergen = settings && post.ingredients.some(
        ingredient => settings.allergens.includes(ingredient)
    );

    const hasUnwanted = settings && post.ingredients.some(
        ingredient => settings.unwanted.includes(ingredient)
    );

    // Показываем иконки только если есть предупреждения и пользователь авторизован
    const showWarnings = isAuthenticated && settings && (hasAllergen || hasUnwanted);

    const handleLike = () => {
        if (!isAuthenticated) {
            //Уведолмение о необходимости входа
            return;
        }

        if (post.isLiked) {
            unlikePost(post.id);
        } else {
            likePost(post.id);
        }
    };

    const handleFavorite = () => {
        if (!isAuthenticated) return;

        if (post.isFavorited) {
            unfavoritePost(post.id);
        } else {
            favoritePost(post.id);
        }
    };

    const handleSubscribe = () => {
        if (!isAuthenticated) return;
        subscribeToAuthor(post.authorId);
    };
    return (
        <Link to={`/publication/${post.id}`}>
            <div className="w-[550px] flex flex-col border-[2px] border-[#E6E6E6]">
                <div className="flex py-[5px] justify-between items-center border-b-[2px] border-[#E6E6E6]">
                    <div className='flex ml-[22px] gap-2 items-center'>
                        <img src={avatar} className='w-[35px]' />
                        <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{post?.username}</span>
                    </div>
                    <button className='w-[150px] h-[30px] mr-[9px] bg-[#23A6F0] rounded-[5px]' onClick={handleSubscribe}>
                        <span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>Подписаться</span>
                    </button>
                </div>

                <div className="relative ">
                    <img src={testPost} className='h-[344px] w-[100%]' />

                    {/* Фиксированный элемент сверху справа */}
                    <div className='absolute top-0 right-0 flex flex-col mx-1 mt-1'>
                        <div className='w-[56px] h-[30px] flex items-center justify-center gap-1 border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold'>{post?.rating?.rating}</span>
                            <StarIcon className='w-[20px] h-[20px]' />
                        </div>
                    </div>
                    <div className='absolute bottom-0 right-0 mx-1 mb-2' >
                        <span className='px-[12px] py-[3px] font-montserrat text-[16px] text-[#000000] tracking-[0.2px] leading-7 font-bold border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>50 минут</span>
                    </div>
                </div>

                <div className='flex border-t-[2px] items-center justify-between'>
                    <div className='flex -mt-[2px] pb-[6px] pt-[7px] gap-4 px-[7px] border-b-[2px] border-t-[2px] border-r-[2px] border-[#E6E6E6] rounded-r-[10px] max-w-[170px]'>
                        <LikeIcon
                            className={`cursor-pointer ${post.isLiked ? 'fill-red-500' : ''}`}
                            onClick={handleLike}
                        />
                        {/*<span>{post.likesCount}</span>*/}
                        <FavoritesIcon
                            className={`cursor-pointer ${post.isFavorited ? 'fill-yellow-500' : ''}`}
                            onClick={handleFavorite}
                        />
                        <CommentIcon />
                        <BanIcon />
                    </div>
                    {/* Динамическое отображение иконок */}
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
                <div className='flex mt-[6px] flex-col pl-[7px] gap-[6px] '>
                    <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold leading-7'>Картошка по деревенски</span>
                    <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] leading-4'>Вкусная картошка с домашним майонезом и кетчупом, специями</span>
                </div>
                <div className='flex w-[100%] pr-[10px] pb-[5px] justify-end items-center'>
                    <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] font-medium leading-7'>{post?.date}</span>
                </div>
            </div>
        </Link>
    )
}