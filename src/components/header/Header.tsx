import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Logo from '../../assets/Logo.svg';
import Add from '../../assets/icons/add.svg?react';
import Notification from '../../assets/icons/notification.svg?react';
import ArrowIcon from '../../assets/icons/arrow.svg?react';
import StarTopAuthor from '../../assets/icons/starTopAuthor.svg?react'

import ProfileMenu from './ProfileMenu';
import SearchBar from '../../features/search/Search'
import Notifications from '../../features/notifications/Notifications';

export default function Header() {

    const { isAuthenticated } = useAuthStore();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const handleNotificationClick = () => { setIsNotificationOpen(true) };
    const handleCloseModal = () => { setIsNotificationOpen(false) };

    return (
        <header>
            <div className='flex items-center justify-between pr-[40px] pl-[102px] border-b-4 border-[#D9D9D9] h-[100px]'>
                <div className='flex items-center gap-11 w-[100%] max-w-[700px]'>
                    <Link to="/" className=''>
                        <img
                            src={Logo}
                            className='select-none w-[120px] h-[50px]'
                            alt='Логотип'
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </Link>
                    <SearchBar />
                </div>

                <div className='flex gap-12 items-end mr-[80px]'>
                    <div className='gap-8 flex items-center justify-center'>
                        <Link to="/topAuthors">
                            <StarTopAuthor className='w-[40px] hover:opacity-70 transition-opacity' />
                        </Link>
                        <Link to="/PostCreate">
                            <Add className='w-[40px] hover:opacity-70 transition-opacity' />
                        </Link>

                        {/* SVG в button для доступности (a11y) */}
                        <button
                            type="button"
                            onClick={handleNotificationClick}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Notification className='w-[40px]' />
                        </button>
                    </div>

                    {isAuthenticated ? (
                        <ProfileMenu />
                    ) : (
                        <Link
                            to="/login"
                            className="flex justify-center items-center gap-2 border border-[#23A6F0] bg-[#FFFFFF] rounded-[37px] w-[127px] h-[58px] tracking-[0.2px] text-[14px] text-[#23A6F0] font-montserrat font-bold hover:bg-gray-50 active:bg-[#8F94989C] transition-colors duration-150"
                        >
                            <span>Войти</span>
                            <ArrowIcon className="w-3.5 h-[14px]" />
                        </Link>
                    )}
                </div>
            </div>

            {isNotificationOpen && (<Notifications onClose={handleCloseModal} />)}
        </header>
    );
}