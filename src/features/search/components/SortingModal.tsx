import { useEffect } from "react";

export default function SortingModal({ onClose }: { onClose: () => void }) {
    // Блокировка скролла
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);
    return (

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
                    <h1 className="font-montserrat text-[26px] font-bold leading-7 tracking-[0.2px]">Сортировка</h1>
                </div>
                <div className="flex flex-wrap justify-center px-[70px] gap-x-[50px] gap-y-[15px]">
                    <div
                        className="border border-[#C4C4C4] rounded-[37px] px-[20px] py-[6px] cursor-pointer text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-colors"
                    >
                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">
                            По новизне
                        </span>
                    </div>
                    <div
                        className="border border-[#C4C4C4] rounded-[37px] px-[20px] py-[6px] cursor-pointer text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-colors"
                    >
                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">
                            По популярности
                        </span>
                    </div>
                    <div
                        className="border border-[#C4C4C4] rounded-[37px] px-[20px] py-[6px] cursor-pointer text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] transition-colors"
                    >
                        <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">
                            По рейтингу
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}