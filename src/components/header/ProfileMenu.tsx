import { useState, useEffect } from 'react'; // Добавили useEffect
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import avatarDefault from '../../assets/defaultAvatar.svg';
import ArrowIcon from '../../assets/icons/arrow.svg?react';

export default function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const { user, logout, fetchAuthUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            fetchAuthUser();
        }
    }, [user?.id, fetchAuthUser]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className='flex gap-3 translate-y-1 items-center cursor-pointer' onClick={toggleDropdown}>
                <img
                    src={user?.avatarUrl || avatarDefault}
                    className='w-[50px] h-[50px] object-cover rounded-full select-none'
                    alt='Avatar'
                />
                <div className='flex flex-col'>
                    <span className='font-montserrat font-extrabold tracking-[0.2px] text-[16px] text-[#000000]'>
                        {user?.nickname || 'Гость'}
                    </span>
                    <span className='font-montserrat font-semibold tracking-[0.2px] text-[15px] text-[#252B42]'>
                        {user?.name || 'Пользователь'}
                    </span>
                </div>
                <ArrowIcon className={`transition-transform duration-200 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
            </div>

            {/* Выпадающий список */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-2">
                        <li onClick={() => handleNavigation('/profile')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
                            Профиль
                        </li>
                        <hr className="my-1" />
                        <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition-colors">
                            Выйти
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}