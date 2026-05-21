import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTimerStore, unlockAudio } from '../../../stores/timerStore';

type PhotoRecipe = {
    recipeId: string;
    steps?: {
        stepNumber: number;
        description: string;
        image?: string;
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

// Интерактивный таймер для каждого шага
const StepTimer = ({ recipeId, stepIndex, timeString, originalText }: {
    recipeId: string,
    stepIndex: number,
    timeString: string,
    originalText: string
}) => {
    const timerId = `${recipeId}-${stepIndex}`;
    const timer = useTimerStore((state) => state.timers[timerId]);
    const toggleTimer = useTimerStore((state) => state.toggleTimer);
    const resetTimer = useTimerStore((state) => state.resetTimer);
    const stopAlarm = useTimerStore((state) => state.stopAlarm);

    // для показа окна предупреждения о звуке
    const [showSoundWarning, setShowSoundWarning] = useState(false);

    const parseTimeToSeconds = (tStr: string) => {
        const parts = tStr.split(':');
        return parseInt(parts[0] || '0', 10) * 3600 +
            parseInt(parts[1] || '0', 10) * 60 +
            parseInt(parts[2] || '0', 10);
    };

    const formatDisplayTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const pad = (num: number) => num.toString().padStart(2, '0');
        return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    };

    // ФУНКЦИЯ ЗАПУСКА: Проверяем, видел ли юзер предупреждение для ЭТОГО рецепта
    const handleStartClick = () => {
        // Достаем строку из памяти и превращаем ее обратно в массив
        const savedRecipesRaw = localStorage.getItem('sound_warning_recipes');
        const savedRecipes: string[] = savedRecipesRaw ? JSON.parse(savedRecipesRaw) : [];

        // Разблокируем аудио прямо во время клика пользователя
        unlockAudio();
        // Проверяем, есть ли ID текущего рецепта в этом массиве
        if (!savedRecipes.includes(recipeId)) {
            setShowSoundWarning(true); // Для этого рецепта еще не подтверждали - показываем окно
        } else {
            executeStart(); // Уже подтверждали - запускаем таймер
        }
    };

    // Непосредственно сам запуск таймера
    const executeStart = () => {
        toggleTimer(timerId, parseTimeToSeconds(timeString), `Шаг ${stepIndex + 1}`, recipeId, stepIndex);
    };

    // Обработчик согласия в модальном окне
    const confirmWarning = () => {
        unlockAudio();

        // Снова достаем актуальный массив
        const savedRecipesRaw = localStorage.getItem('sound_warning_recipes');
        const savedRecipes: string[] = savedRecipesRaw ? JSON.parse(savedRecipesRaw) : [];

        // Добавляем текущий recipeId в массив (если его там нет)
        if (!savedRecipes.includes(recipeId)) {
            savedRecipes.push(recipeId);
            // Превращаем массив обратно в текст и сохраняем
            localStorage.setItem('sound_warning_recipes', JSON.stringify(savedRecipes));
        }

        setShowSoundWarning(false);
        executeStart();
    };

    if (!timer) {
        return (
            <>
                <button
                    onClick={handleStartClick}
                    className='mt-4 px-6 h-[45px] md:h-[60px] flex items-center justify-center rounded-[10px] bg-[#23A6F0] text-white hover:bg-[#7ACDFC] transition-transform active:scale-95 shadow-md'
                >
                    <span className='font-montserrat text-[16px] md:text-[20px] font-bold'>
                        Запустить таймер ({originalText})
                    </span>
                </button>

                {/* МОДАЛЬНОЕ ОКНО: Предупреждение о звуке */}
                {showSoundWarning && (
                    <div className="fixed inset-0 z-[99999] bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[15px] p-6 max-w-[400px] w-full flex flex-col items-center text-center shadow-2xl animate-fade-in-up">
                            <div className="w-[60px] h-[60px] bg-[#E1F0FF] rounded-full flex items-center justify-center mb-4">
                                <span className="text-[30px]">🔊</span>
                            </div>
                            <h3 className="font-montserrat text-[22px] font-bold text-[#000000] tracking-[0.2px] mb-3">
                                Включите звук
                            </h3>
                            <p className="font-montserrat text-[15px] text-[#737373] leading-6 mb-6">
                                Для корректной работы кухонного таймера, пожалуйста, убедитесь, что на вашем устройстве включен звук и отключен беззвучный режим.
                            </p>
                            <button
                                onClick={confirmWarning}
                                className="w-full h-[50px] bg-[#23A6F0] text-white rounded-[10px] font-montserrat text-[16px] font-bold hover:bg-[#7ACDFC] transition-colors active:scale-95 shadow-md"
                            >
                                Понятно, запустить
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Состояние таймер звенит
    if (timer.isRinging) {
        return (
            <button
                onClick={() => stopAlarm(timerId)}
                className='mt-4 px-8 h-[50px] md:h-[70px] flex items-center justify-center rounded-[10px] bg-[#FF0000] text-white hover:bg-[#CC0000] transition-transform hover:scale-105 active:scale-95 shadow-lg animate-pulse'
            >
                <span className='font-montserrat text-[18px] md:text-[24px] font-bold tracking-[1px]'>
                    ВЫКЛЮЧИТЬ ТАЙМЕР
                </span>
            </button>
        );
    }

    return (
        <div className='flex gap-2 mt-4'>
            <button
                onClick={() => toggleTimer(timerId)}
                className={`flex-1 px-6 h-[45px] md:h-[60px] flex items-center justify-center rounded-[10px] text-white transition-all shadow-md ${timer.isActive ? 'bg-[#23A6F0]' : 'bg-[#23A6F0]'
                    }`}
            >
                <span className='font-montserrat text-[16px] md:text-[20px] font-bold'>
                    {timer.isActive ? `⏸ ${formatDisplayTime(timer.timeLeft)}` : `▶ Продолжить`}
                </span>
            </button>
            <button
                onClick={() => resetTimer(timerId)}
                className='w-[45px] md:w-[60px] h-[45px] md:h-[60px] flex items-center justify-center rounded-[10px] bg-[#FF0000] text-white hover:bg-[#CC0000] shadow-md transition-transform active:scale-95'
            >
                <span className='text-[20px]'>⏹</span>
            </button>
        </div>
    );
};

// ОСНОВНОЙ КОМПОНЕНТ
export default function PhotoRecipe({ steps, recipeId }: PhotoRecipe) {
    const [isCookingMode, setIsCookingMode] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    // <--- ФФЕКТ ДЛЯ СКРОЛЛА --->
    useEffect(() => {
        if (location.hash) {
            // Ищем в URL кусок вида "#step-2" и достаем цифру 2
            const match = location.hash.match(/#step-(\d+)/);
            if (match) {
                const targetIndex = parseInt(match[1], 10);

                // Если открыт полноэкранный режим готовки
                if (isCookingMode) {
                    setCurrentStepIndex(targetIndex); // переключаем слайд
                } else {
                    // Если мы на обычной странице — плавно скроллим к шагу
                    // setTimeout нужен, чтобы дать странице долю секунды на рендер (если мы пришли с другой страницы)
                    setTimeout(() => {
                        const element = document.getElementById(`step-${targetIndex}`);
                        if (element) {
                            // block: 'center' поместит шаг ровно по центру экрана
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 150);
                }
                navigate(location.pathname + location.search, { replace: true });
            }
        }
    }, [location.hash, isCookingMode, location.pathname, location.search, navigate]);
    // <--- КОНЕЦ ЭФФЕКТА --->
    if (!steps || steps.length === 0) return null;

    const handleNext = () => { if (currentStepIndex < steps.length - 1) setCurrentStepIndex(prev => prev + 1); };
    const handlePrev = () => { if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1); };

    const currentStep = steps[currentStepIndex];
    const currentDisplayTime = formatTimer(currentStep?.timer);

    return (
        <div className='flex flex-col w-[100%] mt-7 md:mt-0 relative'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <h3 className='md:w-[50%] font-montserrat text-[24px] md:text-[28px] font-bold tracking-[0.2px] leading-7'>
                    ПОШАГОВЫЙ ФОТОРЕЦЕПТ
                </h3>
                <button
                    onClick={() => { setCurrentStepIndex(0); setIsCookingMode(true); }}
                    className='w-full md:w-auto px-6 h-[45px] flex items-center justify-center rounded-[10px] bg-[#23A6F0] text-white hover:bg-[#7ACDFC] transition-transform active:scale-95 shadow-md'
                >
                    <span className='font-montserrat text-[16px] font-bold tracking-[0.2px]'>
                        Начать готовить
                    </span>
                </button>
            </div>

            {/* СПИСОК ШАГОВ */}
            {steps.map((step, idx) => {
                const displayTime = formatTimer(step.timer);
                return (
                    <div key={idx} id={`step-${idx}`} className="flex flex-col mt-[18px] justify-between">
                        <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                            <span className='font-montserrat text-[20px] md:text-[24px] text-[#000000] tracking-[0.2px] leading-6'>Шаг {step.stepNumber}</span>
                        </div>
                        <img src={step.image} loading="lazy" className='w-[100%] mt-[23px] h-[386px] object-cover border-[2px] rounded-[10px] border-[#E6E6E6]' alt={`Шаг ${step.stepNumber}`} />
                        <span className='font-montserrat text-[20px] md:text-[24px] mt-[13px] mb-[7px] text-[#000000] tracking-[0.2px] leading-6'>{step.description}</span>

                        {/* ИСПОЛЬЗУЕМ НОВЫЙ ТАЙМЕР */}
                        {step.timer && step.timer !== "00:00:00" && (
                            <StepTimer
                                recipeId={recipeId}
                                stepIndex={idx}
                                timeString={step.timer}
                                originalText={displayTime || ''}
                            />
                        )}
                    </div>
                )
            })}

            {/* ПОЛНОЭКРАННЫЙ РЕЖИМ ГОТОВКИ */}
            {isCookingMode && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b-[2px] border-[#E6E6E6] bg-white shadow-sm">
                        <span className="font-montserrat text-[20px] font-bold text-[#737373]">
                            Шаг {currentStepIndex + 1} из {steps.length}
                        </span>
                        <button
                            onClick={() => setIsCookingMode(false)}
                            className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <span className="text-[24px] font-bold text-[#000000]">✕</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 md:px-20 py-6 flex flex-col items-center">
                        <img
                            src={currentStep.image}
                            className="w-full max-w-[800px] h-[300px] md:h-[500px] object-cover rounded-[15px] shadow-sm border-[1px] border-[#E6E6E6]"
                            alt={`Шаг ${currentStep.stepNumber}`}
                        />
                        <p className="font-montserrat text-[24px] md:text-[32px] mt-8 text-center text-[#000000] leading-snug max-w-[800px]">
                            {currentStep.description}
                        </p>

                        {/* ИСПОЛЬЗУЕМ ТАЙМЕР В РЕЖИМЕ ГОТОВКИ */}
                        <div className="mt-8 flex justify-center w-full">
                            {currentStep.timer && currentStep.timer !== "00:00:00" && (
                                <StepTimer
                                    recipeId={recipeId}
                                    stepIndex={currentStepIndex}
                                    timeString={currentStep.timer}
                                    originalText={currentDisplayTime || ''}
                                />
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t-[2px] border-[#E6E6E6] bg-white flex items-center justify-between gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentStepIndex === 0}
                            className={`flex-1 h-[60px] rounded-[10px] font-montserrat text-[18px] font-bold transition-all ${currentStepIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E6E6E6] text-black hover:bg-gray-300 active:scale-95'
                                }`}
                        >
                            ← Назад
                        </button>

                        <button
                            onClick={currentStepIndex === steps.length - 1 ? () => setIsCookingMode(false) : handleNext}
                            className="flex-1 h-[60px] rounded-[10px] font-montserrat text-[18px] font-bold bg-[#23A6F0] text-white hover:bg-[#7ACDFC] transition-transform active:scale-95 shadow-md"
                        >
                            {currentStepIndex === steps.length - 1 ? '🎉 Завершить' : 'Дальше →'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}