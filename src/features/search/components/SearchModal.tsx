import { useEffect, useState } from "react";

const FILTERS_DATA = [
    { title: 'Тип приема пищи', items: ['Завтрак', 'Обед', 'Полдник', 'Ужин', 'Перекус'] },
    { title: 'Тип блюда', items: ['Первые блюда', 'Вторые блюда', 'Салаты', 'Закуски', 'Выпечка', 'Соусы и маринады', 'Заготовки', 'Десерты', 'Напитки', 'Гарниры'] },
    { title: 'Время приготовления', items: ['До 15 минут', 'До 30 минут', 'До 45 минут', 'До 60 минут', 'Более часа'] },
    { title: 'Калорийность на 100г.', items: ['До 200 кКал', '200 - 400 кКал', '400 - 600 кКал', '600 - 800 кКал', 'Более 800 кКал'] }
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
    const [alwaysOn, setAlwaysOn] = useState(false);

    // Для блокировки скролла страницы
    useEffect(() => {
        // Блокируем скролл на всей странице при открытии модалки
        document.body.style.overflow = 'hidden';

        // Возвращаем скролл при закрытии модалки
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        // Обертка-оверлей
        // top-[110px] - начинаем ровно под хедером
        // bg-white/80 - делает фон светлым полупрозрачным
        // items-start pt-[30px] - прижимает модалку к верху с небольшим отступом
        <div className="fixed top-[110px] left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm z-50 flex justify-center items-start pt-[20px] overflow-y-auto pb-[40px]"
            onClick={onClose}>

            {/* Добавлена легкая тень shadow-xl и скругления rounded-[15px] */}
            <div className="bg-[#FFFFFF] relative flex flex-col w-[780px] rounded-[15px] shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100 pb-[40px]"
                onClick={(e) => e.stopPropagation()}> {/* Для того что бы клики внутри не закрывали модалку */}

                {/* Шапка модалки */}
                <div className="flex justify-center items-center relative h-[80px] shrink-0 border-b border-gray-100 mb-[20px]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute left-[40px] text-[28px] font-light text-[#000000] hover:text-gray-500 transition-colors"
                    >
                        ✕
                    </button>
                    <h1 className="font-montserrat text-[26px] font-bold leading-7 tracking-[0.2px]">Фильтры</h1>
                </div>

                {/* Контент фильтров */}
                <div className="flex flex-col px-[70px] gap-[20px]">
                    {FILTERS_DATA.map((section, index) => (
                        <div key={index} className="flex flex-col">
                            <h3 className="font-montserrat text-[18px] font-bold leading-7 tracking-[0.2px] mb-[10px]">
                                {section.title}
                            </h3>
                            <div className="flex flex-wrap gap-x-[15px] gap-y-[15px]">
                                {section.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="border border-[#C4C4C4] rounded-[37px] px-[20px] py-[6px] cursor-pointer text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-colors"
                                    >
                                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Исключить аллерген */}
                <div className="flex px-[70px] gap-x-[15px] items-center mt-[25px]">
                    <span className="font-montserrat text-[18px] font-bold leading-7 tracking-[0.2px]">
                        Исключить аллерген
                    </span>
                    <button
                        type="button"
                        onClick={() => setAlwaysOn(!alwaysOn)}
                        className={`relative w-[45px] h-[25px] rounded-full transition-colors duration-300 ${alwaysOn ? 'bg-[#23A6F0]' : 'bg-gray-300'}`}
                    >
                        <span
                            className={`absolute top-[2px] left-[2px] w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ${alwaysOn ? 'translate-x-[20px]' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                {/* Инпуты */}
                <div className="flex flex-col px-[70px] mt-[25px] gap-5">
                    <div className="flex flex-col gap-2 relative">
                        <h3 className="font-montserrat text-[18px] font-bold leading-7">Добавить продукт</h3>
                        <input
                            className="border border-gray-200 bg-[#F9F9F9] rounded-[8px] h-[50px] px-[20px] outline-none focus:border-[#23A6F0] font-montserrat text-[14px]"
                            type="text"
                            placeholder="Например: курица"
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <h3 className="font-montserrat text-[18px] font-bold leading-7">Исключить продукт</h3>
                        <input
                            className="border border-gray-200 bg-[#F9F9F9] rounded-[8px] h-[50px] px-[20px] outline-none focus:border-[#23A6F0] font-montserrat text-[14px]"
                            type="text"
                            placeholder="Например: курица"
                        />
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex px-[70px] justify-end gap-[20px] mt-[40px]">
                    <button
                        type="button"
                        onClick={() => {/* логика сброса */ }}
                        className="bg-[#C2C2C2] hover:bg-[#a8a8a8] transition-colors w-[110px] h-[35px] rounded-[5px] flex items-center justify-center"
                    >
                        <span className="font-montserrat text-[14px] text-[#FFFFFF] font-bold tracking-[0.2px]">Сбросить</span>
                    </button>

                    <button
                        type="submit"
                        onClick={onClose}
                        className="bg-[#23A6F0] hover:bg-[#1b88c7] transition-colors w-[110px] h-[35px] rounded-[5px] flex items-center justify-center"
                    >
                        <span className="font-montserrat text-[14px] text-[#FFFFFF] font-bold tracking-[0.2px]">Найти</span>
                    </button>
                </div>

            </div>
        </div>
    );
}