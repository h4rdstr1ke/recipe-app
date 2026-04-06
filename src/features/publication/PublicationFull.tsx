import { type Post } from '../../stores/postStore';
import avatar from '../../assets/avatar.svg';
import StarIcon from '../../assets/icons/feed/star.svg?react';
import LikeIcon from '../../assets/icons/feed/like.svg?react';
import BanIcon from '../../assets/icons/feed/ban.svg?react';
import FavoritesIcon from '../../assets/icons/feed/favorites.svg?react';
import CommentIcon from '../../assets/icons/feed/comment.svg?react';
import UnwnantedIcon from '../../assets/icons/feed/unwanted.svg?react';
import AllergenIcon from '../../assets/icons/feed/allergen.svg?react';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { usePostStore } from '../../stores/postStore';
import testPost from '../../assets/testPost2.png';
import { useState } from 'react';
import Star from '../../assets/icons/publicationPage/star.svg?react';

type PublicationFullProps = {
    post: Post;
};

export default function PublicationFull({ post }: PublicationFullProps) {
    const { likePost, unlikePost, favoritePost, unfavoritePost, subscribeToAuthor } = usePostStore();
    const { isAuthenticated } = useAuthStore();
    const { settings } = useUserSettingsStore();
    const [alwaysOn, setAlwaysOn] = useState(false); // Переключатель

    const hasAllergen = settings && post.ingredients.some(
        ingredient => settings.allergens.includes(ingredient)
    );
    const hasUnwanted = settings && post.ingredients.some(
        ingredient => settings.unwanted.includes(ingredient)
    );
    const showWarnings = isAuthenticated && settings && (hasAllergen || hasUnwanted);

    const handleLike = () => {
        if (!isAuthenticated) return;
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
        <div className="max-w-[640px] mx-auto flex flex-col items-center justify-center">
            <div className="w-[100%] flex flex-col">
                {/* Верхний блок */}
                <div className="flex py-[5px] justify-between items-center">
                    <div className='flex gap-2 items-center'>
                        <img src={avatar} className='w-[50px]' />
                        <div className='flex flex-col items-start'>
                            <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{post?.authorNickname}</span>
                            <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>Name</span>
                        </div>
                    </div>
                    <button className='w-[150px] h-[30px] mr-[9px] bg-[#23A6F0] rounded-[5px]' onClick={handleSubscribe}>
                        <span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>Подписаться</span>
                    </button>
                </div>

                {/* Фото блок */}
                <div className="relative ">
                    <img src={testPost} className='h-[344px] w-[100%] border-[2px] border-[#E6E6E6] rounded-[10px]' />
                    <div className='absolute bottom-0 right-0 mx-1 mb-2' >
                        <span className='px-[12px] py-[3px] font-montserrat text-[16px] text-[#000000] tracking-[0.2px] leading-7 font-bold border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>50 минут</span>
                    </div>
                </div>

                {/* Блок взаимодействия */}
                <div className='flex items-center justify-between'>
                    <div className='flex -mt-[2px] pb-[6px] pt-[7px] gap-4 px-[7px] max-w-[170px]'>
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
                    <div className='flex justify-between items-center'>
                        <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold leading-7'>Картошка по деревенски</span>
                        <div className='w-[56px] h-[30px] flex items-center justify-center gap-1'>
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold'>{post?.rating}</span>
                            <StarIcon className='w-[20px] h-[20px]' />
                        </div>
                    </div>
                    <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] leading-4'>Вкусная картошка с домашним майонезом и кетчупом, специями</span>
                </div>
            </div>
            <div className="flex flex-col gap-5 items-center"> {/* Блок кбжу */}
                <div className="flex gap-4 mt-2">
                    <div className='flex flex-col items-center w-[116px] h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                        <span className='font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7'>Калории</span>
                        <div className='flex flex-col items-center justify-center gap-[1px] w-[100px] h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                            <span className='font-montserrat text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{post.nutrition?.calories}</span>
                            <span className='font-montserrat text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>кКал</span>
                        </div>
                    </div>

                    {/* Блок с белками */}
                    <div className='flex flex-col items-center w-[116px] h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                        <span className='font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7'>Белки</span>
                        <div className='flex flex-col items-center justify-center gap-[1px] w-[100px] h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                            <span className='font-montserrat text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{post.nutrition?.protein}</span>
                            <span className='font-montserrat text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>грамм</span>
                        </div>
                    </div>

                    {/* Блок с жирами */}
                    <div className='flex flex-col items-center w-[116px] h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                        <span className='font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7'>Жиры</span>
                        <div className='flex flex-col items-center justify-center gap-[1px] w-[100px] h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                            <span className='font-montserrat text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{post.nutrition?.fat}</span>
                            <span className='font-montserrat text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>грамм</span>
                        </div>
                    </div>

                    {/* Блок с углеводами */}
                    <div className='flex flex-col items-center w-[116px] h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                        <span className='font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7'>Углеводы</span>
                        <div className='flex flex-col items-center justify-center gap-[1px] w-[100px] h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                            <span className='font-montserrat text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{post.nutrition?.carbs}</span>
                            <span className='font-montserrat text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>грамм</span>
                        </div>
                    </div>
                </div>
                <p className='font-montserrat text-[13px] p-0 font-light tracking-[0.2px] leading-4'>Пищевая ценность на 100 г. Калорийность рассчитана для сырых продуктов.</p>
            </div>
            {/* Продукты для приготовления */}
            <div className="w-[100%]">
                <div className="flex flex-col">
                    <h3 className='font-montserrat text-[28px] font-bold tracking-[0.2px] leading-7'>ПРОДУКТЫ ДЛЯ ПРИГОТОВЛЕНИЯ</h3>
                    <span className='font-montserrat text-[16px] tracking-[0.2px]'>Порций: 2</span>
                </div>
                <div className="">
                    {post.products?.map((product, idx) => (
                        <div key={idx} className="flex justify-between py-3 border-b-[1px] border-dashed border-[#737373]">
                            <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px] underline'>{product.name}</span>
                            <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px]'>
                                {product.quantity} {product.unit}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Негаснущий экран */}
            <div className="flex w-[100%] gap-2 items-center">
                <button
                    onClick={() => setAlwaysOn(!alwaysOn)}
                    className={`
                    relative w-12 h-6 rounded-full transition-colors duration-300
                    ${alwaysOn ? 'bg-blue-500' : 'bg-gray-300'}
                `}
                >
                    <span
                        className={`
                        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
                        ${alwaysOn ? 'translate-x-6' : 'translate-x-0'}
                    `}
                    />
                </button>
                <span className="font-montserrat text-[16px] text-[#737373] leading-7 tracking-[0.2px]">
                    Негаснущий экран
                </span>
            </div>
            <div className='flex flex-col w-[100%]'>
                <h3 className='font-montserrat text-[28px] font-bold tracking-[0.2px] leading-7'>ПОШАГОВЫЙ ФОТОРЕЦЕПТ</h3>
                {post.steps?.map((step, idx) => (
                    <div key={idx} className="flex flex-col justify-between">
                        <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                            <span className='font-montserrat text-[24px] text-[#000000] tracking-[0.2px] leading-6'>Шаг {step.stepNumber}</span>
                        </div>
                        <img src={step.image} className='w-[100%] h-[386px]' />
                        <span className='font-montserrat text-[24px] text-[#000000] tracking-[0.2px] leading-6'>{step.description}</span>
                    </div>
                ))}
            </div>
            {/* Оценка рецепта */}
            <div className='w-[100%] relative mt-[50px] py-[14px]'>
                <span className='absolute top-0 left-6 font-montserrat text-[28px] font-bold text-[#000000] tracking-[0.2px] bg-[#FFFFFF] leading-7'>Понравился рецепт?</span>
                <div className='flex items-center w-[100%] h-[160px] border-[2px] border-[#23A6F0] rounded-[10px]'>
                    <div className='flex'>
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                    </div>
                    <div className='flex flex-col border-l-[1px] border-[#D1D1D1]'>
                        <div className='w-[56px] h-[30px] flex justify-start items-center gap-1'>
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold'>{post?.rating}</span>
                            <StarIcon className='w-[20px] h-[20px]' />
                        </div>
                        <span>Рейтинг из 3 оценок</span>
                    </div>
                </div>
            </div>
            <div className='w-[100%]'>
                <div>
                    <h3 className='font-montserrat text-[28px] font-bold tracking-[0.2px] leading-7'>КОММЕНТАРИИ</h3>
                    <textarea placeholder='Напишите комментарий' className='min-h-[83px] w-[100%]'></textarea>
                    <button>Опубликовать</button>
                </div>
                <div>
                    <div className='flex ml-[22px] gap-2 items-center'>
                        <img src={avatar} className='w-[35px]' />
                        <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{post?.authorNickname}</span>
                    </div>
                    <span>Вкусно, будто мама готовила!</span>
                    <img alt='Фото' />
                </div>
            </div>
        </div>
    );
}