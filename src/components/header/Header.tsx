import { useState } from 'react';
import logo from '../../assets/Logo.svg';
import ArrowIcon from '../../assets/arrow.svg?react';
import SearchBar from './SearchBar';

type HeaderProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
};

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
    const [isPressed, setIsPressed] = useState(false); // Для анимации bg у кнопки

    const handleMouseDown = () => {
        setIsPressed(true);
        setTimeout(() => {
            setIsPressed(false);
        }, 150);
    };

    return (
        <header>
            <div className='flex items-center justify-between px-[40px] border-2 h-[110px]'>
                <div className='flex items-center justify-between w-[100%] max-w-[700px]'>
                    <img
                        src={logo}
                        className='select-none w-[90px] h-[90px] ml-[60px]'
                        alt='Логотип'
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <button
                    onMouseDown={handleMouseDown}
                    className={`flex justify-center items-center gap-2 border rounded-[37px] w-[127px] h-[58px] tracking-[0.2px] text-[14px] text-[#23A6F0] transition-all duration-150
                ${isPressed
                            ? 'bg-[#8F94989C] border-[#23A6F0]'
                            : 'bg-[#FFFFFF] border-[#23A6F0]'
                        }`}
                >
                    <span className='font-montserrat font-bold'>Войти</span>
                    <ArrowIcon className="w-3.5 h-[14px]" />
                </button>
            </div>
        </header>
    );
}