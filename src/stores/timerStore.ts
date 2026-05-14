import { create } from 'zustand';

// Сохраняем ссылку на проигрыватель вне стейта
let activeAudio: HTMLAudioElement | null = null;
let popAudio: HTMLAudioElement | null = null;

// "Прогрев" динамиков для iOS
export const unlockAudio = () => {
    if (!activeAudio) {
        activeAudio = new Audio('/sounds/kitchen-timer.mp3');
        activeAudio.load(); // ВАЖНО: Принудительно загружаем для Safari
        activeAudio.volume = 0;
        activeAudio.play().then(() => {
            activeAudio?.pause();
            if (activeAudio) {
                activeAudio.currentTime = 0;
                activeAudio.volume = 1;
            }
        }).catch(() => { });
    }
    // Прогреваем звук 30-секундного предупреждения
    if (!popAudio) {
        popAudio = new Audio('/sounds/pop.mp3');
        popAudio.load(); // ВАЖНО для Safari
        popAudio.volume = 0;
        popAudio.play().then(() => {
            popAudio?.pause();
            if (popAudio) {
                popAudio.currentTime = 0;
                popAudio.volume = 1;
            }
        }).catch(() => { });
    }
};

interface TimerState {
    timeLeft: number;
    isActive: boolean;
    initialSeconds: number;
    isRinging?: boolean; //  Флаг для отображения кнопки выключения
    isWarning?: boolean; // Флаг для предупреждения за 30 сек
    title?: string;
    recipeId?: string;   // ID рецепта для ссылки
    stepIndex?: number;
}

interface TimerStore {
    timers: Record<string, TimerState>;
    toggleTimer: (id: string, initialSeconds?: number, title?: string, recipeId?: string, stepIndex?: number) => void;
    resetTimer: (id: string) => void;
    stopAlarm: (id: string) => void; //Функция выключения звука
    tick: () => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
    timers: {},

    toggleTimer: (id, initialSeconds, title, recipeId, stepIndex) => set((state) => {
        const currentTimer = state.timers[id];
        if (!currentTimer && initialSeconds) {
            return {
                timers: {
                    ...state.timers,
                    [id]: { timeLeft: initialSeconds, isActive: true, initialSeconds, isRinging: false, isWarning: false, title, recipeId, stepIndex }
                }
            };
        }
        if (currentTimer) {
            return { timers: { ...state.timers, [id]: { ...currentTimer, isActive: !currentTimer.isActive } } };
        }
        return state;
    }),

    resetTimer: (id) => set((state) => {
        // Если мы удаляем таймер, который сейчас звенит — глушим звук
        if (state.timers[id]?.isRinging && activeAudio) {
            activeAudio.pause();
            activeAudio.currentTime = 0;
            activeAudio = null;
        }
        const { [id]: _, ...rest } = state.timers;
        return { timers: rest };
    }),

    // Выключает звук и снимает флаг
    stopAlarm: (id) => set((state) => {
        if (activeAudio) {
            activeAudio.pause();
            activeAudio.currentTime = 0;
            activeAudio = null;
        }

        const currentTimer = state.timers[id];

        // Если таймер дошел до нуля (звенел), при выключении звука мы ПОЛНОСТЬЮ сбрасываем его
        // Он вернется в исходное состояние (синяя кнопка "Запустить")
        if (currentTimer && currentTimer.timeLeft === 0) {
            const { [id]: _, ...rest } = state.timers;
            return { timers: rest };
        }

        // Если это было просто нажатие "Ок" на 30 секундах — таймер продолжает идти, 
        // мы просто убираем визуальные флаги предупреждений
        return {
            timers: {
                ...state.timers,
                [id]: { ...state.timers[id], isRinging: false, isWarning: false }
            }
        };
    }),

    tick: () => set((state) => {
        const newTimers = { ...state.timers };
        let hasChanges = false;

        Object.keys(newTimers).forEach((id) => {
            const timer = newTimers[id];
            if (timer.isActive && timer.timeLeft > 0) {
                newTimers[id] = { ...timer, timeLeft: timer.timeLeft - 1 };
                hasChanges = true;

                // ПРЕДУПРЕЖДЕНИЕ ЗА 30 СЕКУНД
                if (newTimers[id].timeLeft === 30) {
                    newTimers[id].isWarning = true;

                    if (!popAudio) {
                        popAudio = new Audio('/sounds/pop.mp3');
                    }
                    popAudio.play().catch(() => { });
                }

                // ВРЕМЯ ВЫШЛО
                if (newTimers[id].timeLeft === 0) {
                    newTimers[id].isActive = false;
                    newTimers[id].isWarning = false; // Отключаем желтый алерт
                    newTimers[id].isRinging = true;  // Включаем красную панику

                    if (!activeAudio) {
                        activeAudio = new Audio('/sounds/kitchen-timer.mp3');
                    }
                    activeAudio.loop = true;
                    activeAudio.play().catch(err => console.warn("Звук заблокирован", err));
                }
            }
        });

        return hasChanges ? { timers: newTimers } : state;
    }),
}));

setInterval(() => {
    useTimerStore.getState().tick();
}, 1000);