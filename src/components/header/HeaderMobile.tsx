// Иконки
import Logo from '../../assets/Logo.svg';
import AddIcon from '../../assets/icons/add.svg?react';
import NotificationIcon from '../../assets/icons/notification.svg?react';
import AiIcon from '../../assets/icons/AI.svg?react';

export default function HeaderMobile() {
    return (
        <header className="border-[#D9D9D9] border-b-[1px] grid grid-cols-3 justify-center w-[100%] h-[60px]">
            <div className='flex items-center justify-start pl-[30px]'>
                <AddIcon className='w-[24px] h-[24px]' />
            </div>
            <div className='flex items-center justify-center'>
                <img src={Logo} className='w-[90px] h-[40px]' />
            </div>
            <div className='flex items-center justify-end gap-5 pr-[25px]'>
                <AiIcon className='w-[24px] h-[24px] text-[#000000] -scale-x-100' />
                <NotificationIcon className='w-[23px] h-[23px]' />
            </div>
        </header>
    )
}