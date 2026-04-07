type PhotoRecipe = {
    steps?: {               // пошаговый рецепт
        stepNumber: number;
        description: string;
        image?: string;     // фото шага 
    }[];
}

export default function PhotoRecipe({ steps }: PhotoRecipe) {
    return (
        <div className='flex flex-col w-[100%]'>
            <h3 className='font-montserrat text-[28px] font-bold tracking-[0.2px] leading-7'>ПОШАГОВЫЙ ФОТОРЕЦЕПТ</h3>
            {steps?.map((step, idx) => (
                <div key={idx} className="flex flex-col mt-[18px] justify-between">
                    <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                        <span className='font-montserrat text-[24px] text-[#000000] tracking-[0.2px] leading-6'>Шаг {step.stepNumber}</span>
                    </div>
                    <img src={step.image} className='w-[100%] mt-[23px] h-[386px] border-[2px] rounded-[10px] border-[#E6E6E6]' />
                    <span className='font-montserrat text-[24px] mt-[13px] mb-[7px] text-[#000000] tracking-[0.2px] leading-6'>{step.description}</span>
                </div>
            ))}
        </div>
    )
}