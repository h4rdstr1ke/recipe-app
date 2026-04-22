import { useState, useEffect, useRef } from 'react'; // Добавили useEffect и useRef
import LoupeIcon from '../../assets/icons/loupe.svg?react';
import SettingsIcon from '../../assets/icons/settings.svg?react';
import SortingIcon from '../../assets/icons/sorting.svg?react'
import SearchActiveIcon from '../../assets/icons/searchActiveIcon.svg?react'

import SearchModal from './components/SearchModal';
import SortingModal from './components/SortingModal';

import { useSearchStore } from '../../stores/searchStore';

export default function SearchBar() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortingOpen, setIsSortingOpen] = useState(false);
    const {
        query,
        setQuery,
        filters,
        sortBy,
        excludeAllergens
    } = useSearchStore();

    // Проверяем, активен ли хотя бы один фильтр
    const isFilterActive = Object.values(filters).some(arr => arr.length > 0) || excludeAllergens;

    // Проверяем, выбрана ли сортировка
    const isSortingActive = sortBy !== null;

    // Создаем реф для привязки к главному контейнеру поиска
    const searchContainerRef = useRef<HTMLDivElement>(null);


    // Отслеживаем клики вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Если клик был, и элемент, по которому кликнули, НЕ находится внутри нашего searchContainerRef
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                // Закрываем обе модалки
                setIsFilterOpen(false);
                setIsSortingOpen(false);
            }
        };

        // Добавляем слушатель только если открыта хотя бы одна модалка
        if (isFilterOpen || isSortingOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Убираем слушатель при закрытии или размонтировании
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen, isSortingOpen]);

    const handleFilterClick = () => {
        setIsFilterOpen(!isFilterOpen);
        setIsSortingOpen(false);
    };

    const handleSortingClick = () => {
        setIsSortingOpen(!isSortingOpen);
        setIsFilterOpen(false);
    };

    const handleCloseModal = () => {
        setIsFilterOpen(false);
        setIsSortingOpen(false);
    };



    return (
        // Вешаем ref на самый внешний div компонента SearchBar
        <div ref={searchContainerRef}>
            <form
                className='flex justify-center items-center h-[50px] gap-5'
                onSubmit={(e) => e.preventDefault()}
            >
                <div className='w-[340px] h-[50px] gap-8 flex justify-center items-center bg-[#F9F9F9] border border-[#DADADA] rounded-[5px]'>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} // Записываем в стор при вводе
                        placeholder="Поиск"
                        className='w-[75%] h-[100%] border-none focus:outline-none focus:border-none placeholder:text-[#737373] font-montserrat text-[14px] tracking-[0.2px] bg-transparent'
                    />
                    <LoupeIcon className='w-[16px] h-[16px]' />
                </div>
                <div className='flex gap-3 items-center'>
                    <SettingsIcon
                        className='w-[26px] h-[25px] cursor-pointer hover:opacity-70 transition-opacity'
                        onClick={handleFilterClick}
                    />
                    {isFilterActive && (
                        <SearchActiveIcon className="w-[10px] h-[10px] text-[#23A6F0]" />
                    )}
                </div>
                <div className='flex gap-3 items-center'>
                    <SortingIcon
                        className='h-[25px] cursor-pointer hover:opacity-70 transition-opacity'
                        onClick={handleSortingClick}
                    />
                    {/* Показываем иконку, если сортировка активна */}
                    {isSortingActive && (
                        <SearchActiveIcon className="w-[10px] h-[10px] text-[#23A6F0]" />
                    )}
                </div>
                {isFilterOpen && (<SearchModal onClose={handleCloseModal} />)}
                {isSortingOpen && (<SortingModal onClose={handleCloseModal} />)}
            </form>
        </div>
    )
}