// import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.svg';
// import ArrowIcon from '../../assets/arrow.svg?react';
import Add from '../../assets/icons/add.svg?react';
import Favorites from '../../assets/icons/favorites.svg?react';
import Ai from '../../assets/icons/AI.svg?react';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';

type HeaderProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
};

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
    {/*
    const [isPressed, setIsPressed] = useState(false); // Для анимации bg у кнопки

    const handleMouseDown = () => {
        setIsPressed(true);
        setTimeout(() => {
            setIsPressed(false);
        }, 150);
    }; */}

    return (
        <header className=''>
            <div className='flex items-center justify-between px-[40px] border-b-4 border-[#D9D9D9] h-[110px]'>
                <div className='flex items-center gap-4 w-[100%] max-w-[700px]'>
                    <Link to="/">
                        <img
                            src={logo}
                            className='select-none w-[120px] h-[90px] ml-[60px]'
                            alt='Логотип'
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </Link>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <div className='flex gap-12 items-end mr-[80px]'>
                    <div className='gap-8 flex items-center justify-center'>
                        <Add className='w-[34px] ' />
                        <Favorites className='w-[35px] h-[32px]' />
                        <Ai className='w-[41px] h-[40px]' />
                    </div>
                    <ProfileMenu />
                    {/*
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
                    */}
                </div>
            </div>
        </header>
    );
}