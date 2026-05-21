import Logo from '../../assets/Logo.svg';
import AddIcon from '../../assets/icons/add.svg?react';
import NotificationIcon from '../../assets/icons/notification.svg?react';
import AiIcon from '../../assets/icons/AI.svg?react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import AiHelper from '../../features/helperAi/Ai'
import Notifications from '../../features/notifications/Notifications';

import { useAuthStore } from '../../stores/authStore';
import AuthWarningModal from '../../components/modals/AuthWarningModal';

export default function HeaderMobile() {
    const isAuthenticated = useAuthStore(state => !!state.token);
    const [showAuthWarning, setShowAuthWarning] = useState(false);

    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleCloseModal = () => {
        setIsAiOpen(false)
        setIsNotificationOpen(false)
    };
    const handleOpenModal = () => {
        setIsAiOpen(true)
    }

    const handleNotificationClick = () => { setIsNotificationOpen(true) };

    // Обработчик клика по иконке добавления рецепта
    const handleAddClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault(); // Запрещаем стандартный переход по ссылке /PostCreate
            setShowAuthWarning(true); // Включаем показ модалки авторизации
        }
    };

    return (
        <header className="border-[#D9D9D9] border-b-[1px] grid grid-cols-3 justify-center w-[100%] h-[60px]">
            <div className='flex items-center justify-start pl-[30px]'>
                <Link to='/PostCreate' onClick={handleAddClick}>
                    <AddIcon className='w-[28px] h-[28px]' />
                </Link>
            </div>
            <div className='flex items-center justify-center'>
                <img src={Logo} className='w-[110px] h-[40px]' alt="Логотип" />
            </div>
            <div className='flex items-center justify-end gap-5 pr-[25px]'>
                <AiIcon className='w-[38px] h-[38px] text-[#000000] -scale-x-100 cursor-pointer' onClick={handleOpenModal} />

                {/* Уведомления показываем ТОЛЬКО авторизованным пользователям */}
                {isAuthenticated && (
                    <NotificationIcon className='w-[28px] h-[28px] cursor-pointer' onClick={handleNotificationClick} />
                )}
            </div>
            {isAiOpen && (<AiHelper onClose={handleCloseModal} />)}
            {isNotificationOpen && (<Notifications onClose={handleCloseModal} />)}

            <AuthWarningModal isOpen={showAuthWarning} onClose={() => setShowAuthWarning(false)} />
        </header>
    )
}