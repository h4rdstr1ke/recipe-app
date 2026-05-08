type PhotoRecipe = {
    steps?: {               // пошаговый рецепт
        stepNumber: number;
        description: string;
        image?: string;     // фото шага
        timer?: string | null;
    }[];
}

// Вспомогательная функция для перевода "00:30:00" в "30 мин"
const formatTimer = (timeString?: string | null) => {
    if (!timeString || timeString === "00:00:00") return null;

    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);

    if (h > 0 && m > 0) return `${h} ч ${m} мин`;
    if (h > 0) return `${h} ч`;
    return `${m} мин`;
}

export default function PhotoRecipe({ steps }: PhotoRecipe) {
    return (
        <div className='flex flex-col w-[100%] mt-7 md:mt-0'>
            <h3 className='font-montserrat text-[24px] md:text-[28px] font-bold tracking-[0.2px] leading-7'>ПОШАГОВЫЙ ФОТОРЕЦЕПТ</h3>
            {steps?.map((step, idx) => {
                const displayTime = formatTimer(step.timer);
                return (
                    <div key={idx} className="flex flex-col mt-[18px] justify-between">
                        <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                            <span className='font-montserrat text-[20px] md:text-[24px] text-[#000000] tracking-[0.2px] leading-6'>Шаг {step.stepNumber}</span>
                        </div>
                        <img src={step.image} className='w-[100%] mt-[23px] h-[386px] border-[2px] rounded-[10px] border-[#E6E6E6]' />
                        <span className='font-montserrat text-[20px] md:text-[24px] mt-[13px] mb-[7px] text-[#000000] tracking-[0.2px] leading-6'>{step.description}</span>
                        {/* Кнопка таймера появляется только если есть время (displayTime !== null) */}
                        {displayTime && (
                            <button
                                onClick={() => {
                                    // TODO: вызов реального таймера
                                    alert(`Таймер на ${displayTime} запущен!`);
                                }}
                                className='w-fit mt-2 px-[20px] h-[40px] flex items-center justify-center gap-2 rounded-[5px] bg-[#23A6F0] text-white hover:bg-[#7ACDFC] transition-colors active:scale-95'
                            >
                                <span className='font-montserrat text-[16px] font-bold'>
                                    Запустить таймер ({displayTime})
                                </span>
                            </button>
                        )}
                    </div>
                )
            })}
        </div>
    )
}