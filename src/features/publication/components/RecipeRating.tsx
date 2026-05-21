import { useState, useEffect } from 'react';
import StarIcon from '../../../assets/icons/starRating.svg?react';
import Star from '../../../assets/icons/star.svg?react';
import { usePostStore } from '../../../stores/postStore';
import { useAuthStore } from '../../../stores/authStore';
import AuthWarningModal from '../../../components/modals/AuthWarningModal';

type RecipeRatingProps = {
    recipeId: string;
    rating?: {
        rating: number;
        quantity: number;
        userRating?: number;
    };
}

export default function RecipeRating({ rating, recipeId }: RecipeRatingProps) {
    const { setRecipeRating } = usePostStore();
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const [showAuthWarning, setShowAuthWarning] = useState(false);

    const [hoverValue, setHoverValue] = useState<number | null>(null);

    // Инициализируем стейт сразу тем значением, которое пришло с сервера
    const [userRating, setUserRating] = useState<number | null>(rating?.userRating || null);

    // Если данные с сервера подгрузились чуть позже или мы перешли на другой рецепт, 
    // синхронизируем закрашенные звездочки
    useEffect(() => {
        if (rating?.userRating !== undefined) {
            setUserRating(rating.userRating);
        }
    }, [rating?.userRating]);

    const handleRatingClick = async (e: React.MouseEvent, value: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            setShowAuthWarning(true);
            return;
        }

        setUserRating(value);

        try {
            await setRecipeRating(recipeId, value);
        } catch (error) {
            setUserRating(rating?.userRating || null);
            console.error("Ошибка оценки:", error);
        }
    };

    return (
        <div className='w-[100%] relative mt-7 md:mt-[29px] py-[14px]'>
            <span className='absolute top-0 left-6 font-montserrat text-[24px] md:text-[28px] font-bold text-[#000000] tracking-[0.2px] bg-[#FFFFFF] leading-7'>
                Понравился рецепт?
            </span>
            <div className='flex items-center w-[100%] h-[120px] md:h-[160px] gap-[14px] px-[25px] border-[2px] border-[#23A6F0] rounded-[10px]'>

                <div className='flex gap-[10px]'>
                    {[1, 2, 3, 4, 5].map((starValue) => (
                        <div
                            key={starValue}
                            className="cursor-pointer transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverValue(starValue)}
                            onMouseLeave={() => setHoverValue(null)}
                            onClick={(e) => handleRatingClick(e, starValue)}
                        >
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
            <AuthWarningModal isOpen={showAuthWarning} onClose={() => setShowAuthWarning(false)} />
        </div>
    )
}