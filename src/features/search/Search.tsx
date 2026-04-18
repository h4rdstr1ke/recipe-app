import { useState, useEffect, useRef } from 'react'; // Добавили useEffect и useRef
import LoupeIcon from '../../assets/icons/loupe.svg?react';
import SettingsIcon from '../../assets/icons/settings.svg?react';
import SortingIcon from '../../assets/icons/sorting.svg?react'

import SearchModal from './components/SearchModal';
import SortingModal from './components/SortingModal';

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortingOpen, setIsSortingOpen] = useState(false);

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
                className='flex justify-center items-center w-[450px] h-[50px] gap-4'
                onSubmit={(e) => e.preventDefault()}
            >
                <div className='w-[340px] h-[50px] gap-8 flex justify-center items-center bg-[#F9F9F9] border border-[#DADADA] rounded-[5px]'>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Поиск"
                        className='w-[75%] h-[100%] border-none focus:outline-none focus:border-none placeholder:text-[#737373] font-montserrat text-[14px] tracking-[0.2px] bg-transparent'
                    />
                    <LoupeIcon className='w-[16px] h-[16px]' />
                </div>

                <SettingsIcon
                    className='w-[26px] h-[25px] cursor-pointer hover:opacity-70 transition-opacity'
                    onClick={handleFilterClick}
                />
                <SortingIcon
                    className='h-[25px] cursor-pointer hover:opacity-70 transition-opacity'
                    onClick={handleSortingClick}
                />

                {isFilterOpen && (<SearchModal onClose={handleCloseModal} />)}
                {isSortingOpen && (<SortingModal onClose={handleCloseModal} />)}
            </form>
        </div>
    )
}