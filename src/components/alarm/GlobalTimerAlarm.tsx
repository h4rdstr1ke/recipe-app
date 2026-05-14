import { useNavigate } from 'react-router-dom';
import { useTimerStore } from '../../stores/timerStore';

export default function GlobalTimerAlarm() {
    const navigate = useNavigate();
    const timers = useTimerStore((state) => state.timers);
    const stopAlarm = useTimerStore((state) => state.stopAlarm);

    // Достаем все таймеры, которые или звенят, или предупреждают
    const activeAlerts = Object.entries(timers).filter(([_, timer]) => timer.isRinging || timer.isWarning);

    if (activeAlerts.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 md:top-10 md:right-10 z-[9999] flex flex-col gap-4 pointer-events-none">
            {activeAlerts.map(([id, timer]) => {
                const isRinging = timer.isRinging;

                // Настраиваем цвета в зависимости от статуса (Красный или Желтый)
                const borderColor = isRinging ? 'border-[#FF0000]' : 'border-[#FF9900]';
                const iconBgColor = isRinging ? 'bg-[#FFE6E6]' : 'bg-[#FFF0E6]';
                const mainTitle = isRinging ? 'Время вышло!' : 'Осталось 30 секунд!';
                const icon = isRinging ? '⏰' : '⏳';

                return (
                    <div
                        key={id}
                        className={`pointer-events-auto w-[320px] md:w-[350px] bg-white rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-l-[6px] ${borderColor} p-4 flex flex-col gap-3 transition-all`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-[45px] h-[45px] rounded-full flex items-center justify-center shrink-0 ${iconBgColor} ${isRinging ? 'animate-pulse' : ''}`}>
                                <span className="text-[22px]">{icon}</span>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-montserrat font-bold text-[16px] text-[#000000]">
                                    {mainTitle}
                                </span>
                                <span className="font-montserrat font-medium text-[14px] text-[#737373] truncate">
                                    {timer.title || 'Таймер рецепта'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-1">
                            {/* КНОПКА ПЕРЕХОДА К РЕЦЕПТУ */}
                            {timer.recipeId && (
                                <button
                                    onClick={() => {
                                        // Переходим на страницу рецепта и добавляем hash с номером шага
                                        navigate(`/publication/${timer.recipeId}#step-${timer.stepIndex}`);
                                        // Если это только предупреждение (30 сек) - можно сразу скрыть его
                                        if (timer.isWarning) stopAlarm(id);
                                    }}
                                    className="flex-1 h-[40px] border-[2px] border-[#E6E6E6] bg-white text-[#737373] rounded-[10px] font-montserrat font-bold text-[14px] hover:bg-gray-50 transition-all"
                                >
                                    К рецепту<>(шагу)</> ➔
                                </button>
                            )}

                            {/* КНОПКА ВЫКЛЮЧЕНИЯ */}
                            <button
                                onClick={() => stopAlarm(id)}
                                className={`flex-1 h-[40px] text-white rounded-[10px] font-montserrat font-bold text-[14px] hover:brightness-110 active:scale-95 transition-all shadow-md ${isRinging ? 'bg-[#FF0000]' : 'bg-[#FF9900]'}`}
                            >
                                {isRinging ? 'Выключить' : 'Ок'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}