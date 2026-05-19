import { useEffect, useState, useRef } from "react";
import { useSearchStore, type IngredientItem } from "../../../stores/searchStore";
import { api } from "../../../api/api";

const FILTERS_DATA = [
    { title: 'Тип приема пищи', items: ['Завтрак', 'Обед', 'Полдник', 'Ужин', 'Перекус'] },
    { title: 'Тип блюда', items: ['Первые блюда', 'Вторые блюда', 'Салаты', 'Закуски', 'Выпечка', 'Соусы и маринады', 'Заготовки', 'Десерты', 'Напитки', 'Гарниры'] },
    { title: 'Время приготовления', items: ['До 15 минут', 'До 30 минут', 'До 45 минут', 'До 60 минут', 'Более часа'] },
    { title: 'Калорийность на 100г.', items: ['До 200 кКал', '200 - 400 кКал', '400 - 600 кКал', '600 - 800 кКал', 'Более 800 кКал'] }
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
    const store = useSearchStore();

    const [localFilters, setLocalFilters] = useState<Record<string, string[]>>({ ...store.filters });
    const [localExcludeAllergens, setLocalExcludeAllergens] = useState(store.excludeAllergens);
    const [localIncluded, setLocalIncluded] = useState<IngredientItem[]>([...store.includedIngredients]);
    const [localExcluded, setLocalExcluded] = useState<IngredientItem[]>([...store.excludedIngredients]);

    const [dbIngredients, setDbIngredients] = useState<{ id: string, title: string }[]>([]);
    const [incInput, setIncInput] = useState('');
    const [excInput, setExcInput] = useState('');
    const [isIncOpen, setIsIncOpen] = useState(false);
    const [isExcOpen, setIsExcOpen] = useState(false);

    const incContainerRef = useRef<HTMLDivElement>(null);
    const excContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        api.get('/api/ingredients').then(res => setDbIngredients(res.data)).catch(console.error);
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (incContainerRef.current && !incContainerRef.current.contains(event.target as Node)) setIsIncOpen(false);
            if (excContainerRef.current && !excContainerRef.current.contains(event.target as Node)) setIsExcOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Локальный тоггл категорий
    const handleToggleFilter = (category: string, item: string) => {
        const categoryFilters = localFilters[category] || [];
        const updated = categoryFilters.includes(item)
            ? categoryFilters.filter(i => i !== item)
            : [...categoryFilters, item];
        setLocalFilters({ ...localFilters, [category]: updated });
    };

    // Все в стор
    const handleApply = () => {
        store.setAllFilters({
            filters: localFilters,
            excludeAllergens: localExcludeAllergens,
            includedIngredients: localIncluded,
            excludedIngredients: localExcluded
        });
        onClose();
    };

    const handleReset = async () => {
        // Очищаем локальные стейты
        setLocalFilters({});
        setLocalExcludeAllergens(false);
        setLocalIncluded([]);
        setLocalExcluded([]);
        setIncInput('');
        setExcInput('');

        // Очищаем глобальный стор
        store.clearFilters();

        // Запрашиваем чистую ленту с бэкенда (без параметров)
        await fetchPosts(true);

        // Закрываем модалку
        onClose();
    };

    const filteredIncIngredients = dbIngredients.filter(ing =>
        ing.title.toLowerCase().includes(incInput.toLowerCase()) && !localIncluded.some(i => i.id === ing.id)
    );

    const filteredExcIngredients = dbIngredients.filter(ing =>
        ing.title.toLowerCase().includes(excInput.toLowerCase()) && !localExcluded.some(i => i.id === ing.id)
    );

    return (
        <div className="fixed top-[100px] left-0 right-0 bottom-0 bg-white/80 backdrop-blur-sm z-50 flex justify-center items-start pt-[20px] overflow-y-auto pb-[40px]" onClick={onClose}>
            <div className="bg-[#FFFFFF] relative flex flex-col w-[780px] rounded-[15px] shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100 pb-[40px]" onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-center items-center relative h-[80px] shrink-0 border-b border-gray-100 mb-[20px]">
                    <button type="button" onClick={onClose} className="absolute left-[40px] text-[28px] font-light text-[#000000] hover:text-gray-500 transition-colors">✕</button>
                    <h1 className="font-montserrat text-[26px] font-bold leading-7 tracking-[0.2px]">Фильтры</h1>
                </div>

                <div className="flex flex-col px-[70px] gap-[20px]">
                    {FILTERS_DATA.map((section, index) => (
                        <div key={index} className="flex flex-col">
                            <h3 className="font-montserrat text-[18px] font-bold leading-7 tracking-[0.2px] mb-[10px]">{section.title}</h3>
                            <div className="flex flex-wrap gap-x-[15px] gap-y-[15px]">
                                {section.items.map((item, itemIndex) => {
                                    const isActive = localFilters[section.title]?.includes(item);
                                    return (
                                        <div key={itemIndex} onClick={() => handleToggleFilter(section.title, item)}
                                            className={`border rounded-[37px] px-[20px] py-[6px] cursor-pointer transition-colors ${isActive
                                                ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]'
                                                : 'border-[#C4C4C4] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0]'
                                                }`}>
                                            <span className="font-montserrat text-[14px] font-bold leading-7 tracking-[0.2px]">{item}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex px-[70px] gap-x-[15px] items-center mt-[25px]">
                    <span className="font-montserrat text-[18px] font-bold leading-7 tracking-[0.2px]">Исключить аллерген</span>
                    <button type="button" onClick={() => setLocalExcludeAllergens(!localExcludeAllergens)}
                        className={`relative w-[45px] h-[25px] rounded-full transition-colors duration-300 ${localExcludeAllergens ? 'bg-[#23A6F0]' : 'bg-gray-300'}`}>
                        <span className={`absolute top-[2px] left-[2px] w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ${localExcludeAllergens ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex flex-col px-[70px] mt-[25px] gap-5">
                    <div ref={incContainerRef} className="flex flex-col gap-2 relative">
                        <h3 className="font-montserrat text-[18px] font-bold leading-7">Добавить продукт</h3>
                        <input
                            className="border border-gray-200 bg-[#F9F9F9] rounded-[8px] h-[50px] px-[20px] outline-none focus:border-[#23A6F0] font-montserrat text-[14px] w-full"
                            type="text" placeholder="Начните вводить название продукта..." value={incInput}
                            onFocus={() => setIsIncOpen(true)} onChange={(e) => { setIncInput(e.target.value); setIsIncOpen(true); }}
                        />
                        {isIncOpen && incInput && filteredIncIngredients.length > 0 && (
                            <ul className="absolute top-[85px] left-0 w-full bg-white border border-gray-200 rounded-[8px] shadow-lg max-h-[160px] overflow-y-auto z-30">
                                {filteredIncIngredients.map(ing => (
                                    <li key={ing.id} className="px-4 py-2 hover:bg-[#F9F9F9] cursor-pointer font-montserrat text-[14px]"
                                        onClick={() => {
                                            setLocalIncluded([...localIncluded, { id: ing.id, name: ing.title }]);
                                            setIncInput(''); setIsIncOpen(false);
                                        }}>{ing.title}</li>
                                ))}
                            </ul>
                        )}
                        {localIncluded.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {localIncluded.map((item) => (
                                    <span key={item.id} onClick={() => setLocalIncluded(localIncluded.filter(i => i.id !== item.id))}
                                        className="px-3 py-1 bg-[#23A6F0] text-white rounded-full text-[13px] font-bold cursor-pointer hover:bg-red-500 transition-colors flex items-center gap-1">
                                        {item.name} ✕
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div ref={excContainerRef} className="flex flex-col gap-2 relative">
                        <h3 className="font-montserrat text-[18px] font-bold leading-7">Исключить продукт</h3>
                        <input
                            className="border border-gray-200 bg-[#F9F9F9] rounded-[8px] h-[50px] px-[20px] outline-none focus:border-[#23A6F0] font-montserrat text-[14px] w-full"
                            type="text" placeholder="Начните вводить продукт для исключения..." value={excInput}
                            onFocus={() => setIsExcOpen(true)} onChange={(e) => { setExcInput(e.target.value); setIsExcOpen(true); }}
                        />
                        {isExcOpen && excInput && filteredExcIngredients.length > 0 && (
                            <ul className="absolute top-[85px] left-0 w-full bg-white border border-gray-200 rounded-[8px] shadow-lg max-h-[160px] overflow-y-auto z-30">
                                {filteredExcIngredients.map(ing => (
                                    <li key={ing.id} className="px-4 py-2 hover:bg-[#F9F9F9] cursor-pointer font-montserrat text-[14px]"
                                        onClick={() => {
                                            setLocalExcluded([...localExcluded, { id: ing.id, name: ing.title }]);
                                            setExcInput(''); setIsExcOpen(false);
                                        }}>{ing.title}</li>
                                ))}
                            </ul>
                        )}
                        {localExcluded.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {localExcluded.map((item) => (
                                    <span key={item.id} onClick={() => setLocalExcluded(localExcluded.filter(i => i.id !== item.id))}
                                        className="px-3 py-1 bg-[#E0232E] text-white rounded-full text-[13px] font-bold cursor-pointer hover:bg-red-700 transition-colors flex items-center gap-1">
                                        {item.name} ✕
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex px-[70px] justify-end gap-[20px] mt-[40px]">
                    <button type="button" onClick={handleReset} className="bg-[#C2C2C2] hover:bg-[#a8a8a8] transition-colors w-[110px] h-[35px] rounded-[5px] flex items-center justify-center">
                        <span className="font-montserrat text-[14px] text-[#FFFFFF] font-bold tracking-[0.2px]">Сбросить</span>
                    </button>
                    <button type="button" onClick={handleApply} className="bg-[#23A6F0] hover:bg-[#1b88c7] transition-colors w-[110px] h-[35px] rounded-[5px] flex items-center justify-center">
                        <span className="font-montserrat text-[14px] text-[#FFFFFF] font-bold tracking-[0.2px]">Применить</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function fetchPosts(arg0: boolean) {
    throw new Error("Function not implemented.");
}
