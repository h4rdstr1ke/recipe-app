import StarIcon from '../../../assets/icons/starRating.svg?react';
import Star from '../../../assets/icons/star.svg?react';

type RecipeRating = {
    rating?: {
        rating: number;
        quantity: number;
    };
}

export default function RecipeRating({ rating }: RecipeRating) {
    return (
        <div className='w-[100%] relative mt-7 md:mt-[29px] py-[14px]'>{/* Оценка рецепта */}
            <span className='absolute top-0 left-6 font-montserrat text-[24px] md:text-[28px] font-bold text-[#000000] tracking-[0.2px] bg-[#FFFFFF] leading-7'>Понравился рецепт?</span>
            <div className='flex items-center w-[100%] h-[120px] md:h-[160px] gap-[14px] px-[25px] border-[2px] border-[#23A6F0] rounded-[10px]'>
                <div className='flex gap-[10px]'>
                    <Star className='' />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                </div>
                <div className='flex flex-col border-l-[1px] pl-2 border-[#D1D1D1]'>
                    <div className='w-[56px] h-[30px] flex justify-start items-center gap-1'>
                        <span className='font-montserrat text-[16px] md:text-[20px] text-[#000000] tracking-[0.2px] font-bold leading-5'>{rating?.rating}</span>
                        <StarIcon className='w-[20px] h-[20px]' />
                    </div>
                    <span className='font-montserrat text-[12px] text-[#000000] tracking-[0.2px] font-light leading-6'>Рейтинг из {rating?.quantity} оценок</span>
                </div>
            </div>
        </div>
    )
}