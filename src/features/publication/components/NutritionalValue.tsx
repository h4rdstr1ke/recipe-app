type NutritionalValueProps = {
    nutrition?: {
        calories?: number;
        protein?: number;
        fat?: number;
        carbs?: number;
    };
};
export default function NutritionalValue({ nutrition }: NutritionalValueProps) {
    return (
        <div className="flex flex-col mt-7 md:mt-5 gap-3 items-center"> {/* Блок кбжу */}
            <div className="flex gap-4 items-center">
                <div className='flex flex-col items-center w-[80px] h-[80px] md:w-[116px] md:h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                    <span className='font-montserrat text-[12px] md:text-[14px] font-bold tracking-[0.2px] leading-7'>Калории</span>
                    <div className='flex flex-col items-center justify-center gap-[1px] w-[60px] h-[41px] md:w-[100px] md:h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{nutrition?.calories}</span>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>кКал</span>
                    </div>
                </div>

                {/* Блок с белками */}
                <div className='flex flex-col items-center  w-[80px] h-[80px] md:w-[116px] md:h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                    <span className='font-montserrat text-[12px] md:text-[14px] font-bold tracking-[0.2px] leading-7'>Белки</span>
                    <div className='flex flex-col items-center justify-center gap-[1px] w-[60px] h-[41px] md:w-[100px] md:h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{nutrition?.protein}</span>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>грамм</span>
                    </div>
                </div>

                {/* Блок с жирами */}
                <div className='flex flex-col items-center w-[80px] h-[80px] md:w-[116px] md:h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                    <span className='font-montserrat text-[12px] md:text-[14px] font-bold tracking-[0.2px] leading-7'>Жиры</span>
                    <div className='flex flex-col items-center justify-center gap-[1px] w-[60px] h-[41px] md:w-[100px] md:h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{nutrition?.fat}</span>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>грамм</span>
                    </div>
                </div>

                {/* Блок с углеводами */}
                <div className='flex flex-col items-center w-[80px] h-[80px] md:w-[116px] md:h-[96px] pt-[5px] bg-[#23A6F0] rounded-[10px]'>
                    <span className='font-montserrat text-[12px] md:text-[14px] font-bold tracking-[0.2px] leading-7'>Углеводы</span>
                    <div className='flex flex-col items-center justify-center gap-[1px] w-[60px] h-[41px] md:w-[100px] md:h-[51px] bg-[#FFFFFF] rounded-[10px]'>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-bold tracking-[0.2px] leading-4'>{nutrition?.carbs}</span>
                        <span className='font-montserrat text-[12px] md:text-[14px] p-0 font-light tracking-[0.2px] leading-4 text-black'>грамм</span>
                    </div>
                </div>
            </div>
            <p className='font-montserrat text-center text-[13px] font-light tracking-[0.2px] leading-4'>Пищевая ценность на 100 г. Калорийность рассчитана для сырых продуктов.</p>
        </div>
    )
}