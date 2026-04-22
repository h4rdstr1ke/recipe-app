import { useEffect } from "react";
import { useSearchStore } from "../../../stores/searchStore";

export default function SortingModal({ onClose }: { onClose: () => void }) {

    const { sortBy, setSortBy } = useSearchStore();

    // Блокировка скролла
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Вспомогательная функция: она проверяет, выбран ли сейчас этот тип сортировки, 
    // и если да красит кнопку в синий цвет
    const getButtonClass = (sortType: string) => {
        const isActive = sortBy === sortType;
        return `border rounded-[37px] px-[20px] py-[6px] cursor-pointer transition-colors ${isActive
            ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]' // Активный стиль 
            : 'border-[#C4C4C4] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0]' // Обычный ст
            }`;
    };

    // Функция обработки клика
    const handleSortClick = (type: 'new' | 'popular' | 'rating') => {
        // Если кликаем на уже выбранную кнопку - сбрасываем сортировку, иначе - применяем
        setSortBy(sortBy === type ? null : type);
        onClose(); // Закрываем модалку после выбора
    };

    return (
        <div className="fixed top-[110px] left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm z-50 flex justify-center items-start pt-[20px] overflow-y-auto pb-[40px]" onClick={onClose}>
            <div className="bg-[#FFFFFF] relative flex flex-col w-[780px] rounded-[15px] shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100 pb-[40px]" onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-center items-center relative h-[80px] shrink-0 border-b border-gray-100 mb-[20px]">
                    <button type="button" onClick={onClose} className="absolute left-[40px] text-[28px] font-light text-[#000000] hover:text-gray-500 transition-colors">✕</button>
                    <h1 className="font-montserrat text-[26px] font-bold leading-7 tracking-[0.2px]">Сортировка</h1>
                </div>
                <div className="flex flex-wrap justify-center px-[70px] gap-x-[50px] gap-y-[15px]">
                    <div onClick={() => handleSortClick('new')} className={getButtonClass('new')}>
                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">По новизне</span>
                    </div>

                    <div onClick={() => handleSortClick('popular')} className={getButtonClass('popular')}>
                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">По популярности</span>
                    </div>

                    <div onClick={() => handleSortClick('rating')} className={getButtonClass('rating')}>
                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">По рейтингу</span>
                    </div>
                </div>

            </div>
        </div>
    )
}