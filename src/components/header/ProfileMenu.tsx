import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Avatar from '../../assets/avatar.svg?react';
import ArrowIcon from '../../assets/icons/arrowDown.svg?react';

export default function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuthStore();  // получаем данные пользователя и функцию выхода
    const navigate = useNavigate();            // для перенаправления

    const toggleDropdown = () => {
        setIsOpen(!isOpen); // Закрываем меню при клике вне 
    };

    const handleLogout = () => {
        logout();           // очищаем данные
        navigate('/login'); // перенаправляем на страницу входа
        setIsOpen(false);   // закрываем меню
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);   // закрываем меню после перехода
    };

    return (
        <div className="relative">
            <div className='flex gap-3 translate-y-1 items-center cursor-pointer' onClick={toggleDropdown}>
                <Avatar className='w-[50px] h-[50px]' />
                <div className='flex flex-col'>
                    <span className='font-montserrat font-extrabold tracking-[0.2px] text-[16px] text-[#000000]'>
                        {user?.nickname || 'Гость'}  {/* подставляем никнейм */}
                    </span>
                    <span className='font-montserrat font-semibold tracking-[0.2px] text-[15px] text-[#252B42]'>
                        {user?.name || 'Пользователь'}
                    </span>
                </div>
                <ArrowIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Выпадающий список */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-2">
                        <li
                            onClick={() => handleNavigation('/profile')}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            Профиль
                        </li>
                        <li
                            onClick={() => handleNavigation('/settings')}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            Настройки
                        </li>
                        <hr className="my-1" />
                        <li
                            onClick={handleLogout}
                            className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
                        >
                            Выйти
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}