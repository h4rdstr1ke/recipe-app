import { useState } from 'react';
import StarIcon from '../../../assets/icons/starRating.svg?react';
import Star from '../../../assets/icons/star.svg?react';
import { usePostStore } from '../../../stores/postStore';
import { useAuthStore } from '../../../stores/authStore';

type RecipeRatingProps = {
    recipeId: string; // Добавили ID рецепта
    rating?: {
        rating: number;
        quantity: number;
    };
}

export default function RecipeRating({ rating, recipeId }: RecipeRatingProps) {
    const { setRecipeRating } = usePostStore();
    const { isAuthenticated } = useAuthStore();

    // Стейт для визуального эффекта наведения
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    // Локальный стейт оценки (чтобы юзер сразу видел свой выбор)
    const [userRating, setUserRating] = useState<number | null>(null);

    const handleRatingClick = async (value: number) => {
        if (!isAuthenticated) {
            // Если юзер не авторизован - не даем голосовать
            // Сюда можно добавить вызов всплывающего уведомления (toast)
            console.log("Только авторизованные пользователи могут ставить оценки");
            return;
        }

        setUserRating(value); // Мгновенно красим звездочки для пользователя
        await setRecipeRating(recipeId, value); // Отправляем запрос на бэкенд
    };

    return (
        <div className='w-[100%] relative mt-7 md:mt-[29px] py-[14px]'>
            <span className='absolute top-0 left-6 font-montserrat text-[24px] md:text-[28px] font-bold text-[#000000] tracking-[0.2px] bg-[#FFFFFF] leading-7'>
                Понравился рецепт?
            </span>
            <div className='flex items-center w-[100%] h-[120px] md:h-[160px] gap-[14px] px-[25px] border-[2px] border-[#23A6F0] rounded-[10px]'>

                {/* Блок со звездочками */}
                <div className='flex gap-[10px]'>
                    {[1, 2, 3, 4, 5].map((starValue) => (
                        <div
                            key={starValue}
                            className="cursor-pointer transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverValue(starValue)}
                            onMouseLeave={() => setHoverValue(null)}
                            onClick={() => handleRatingClick(starValue)}
                        >
                            {/* Логика закрашивания: закрашиваем все звезды до выбранной/наведенной */}
                            {(hoverValue || userRating || 0) >= starValue ? (
                                <StarIcon className='w-[32px] h-[32px]' />
                            ) : (
                                <Star className='w-[32px] h-[32px]' />
                            )}
                        </div>
                    ))}
                </div>

                <div className='flex flex-col border-l-[1px] pl-2 border-[#D1D1D1]'>
                    <div className='w-[56px] h-[30px] flex justify-start items-center gap-1'>
                        <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] tracking-[0.2px] font-bold leading-5'>
                            {rating?.rating ? Number(rating.rating).toFixed(1) : '0'}
                        </span>
                        <StarIcon className='w-[20px] h-[20px]' />
                    </div>
                    <span className='font-montserrat text-[12px] text-[#000000] tracking-[0.2px] font-light leading-6'>
                        Рейтинг из {rating?.quantity || 0} оценок
                    </span>
                </div>
            </div>
        </div>
    )
}