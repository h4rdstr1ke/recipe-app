import { useState } from 'react';
import { Link } from 'react-router-dom';
import avatar from '../assets/avatar.svg';
import PublicationsIcon from '../assets/icons/profile/publications.svg?react';
import SavedIcon from '../assets/icons/profile/saved.svg?react';
import testPost from '../assets/testPost.png';
import { useAuthStore } from '../stores/authStore';

export default function Profile() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'publications' | 'saved'>('publications');
    return (
        <div className='flex items-center flex-col h-[100vh]'>
            <div className='flex flex-col'>
                <div className='w-[900px] flex items-start gap-8 py-[35px]'>
                    <img
                        src={avatar}
                        className='select-none w-[200px] h-[200px]'
                        alt='Avatar'
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                    />
                    <div className='w-[100%] flex flex-col gap-3'>
                        <div className=''>
                            <h1 className='leading-7 font-montserrat text-[36px] tracking-[0.2px] font-bold'>{user?.nickname}</h1>
                            <p className='pt-2 font-montserrat text-[20px] tracking-[0.2px]'>{user?.name}</p>
                        </div>
                        <div className='flex w-[100%] justify-between'>
                            <span className='font-montserrat text-[20px] tracking-[0.2px]'><span className='font-semibold'>4 </span>Публикации</span>
                            <span className='font-montserrat text-[20px] tracking-[0.2px]'><span className='font-semibold'>10 </span>Подписчиков</span>
                            <span className='font-montserrat text-[20px] tracking-[0.2px]'><span className='font-semibold'>20 </span>Подписок</span>
                        </div>
                        <span className='font-montserrat text-[20px] tracking-[0.2px] leading-7'>Я Влад! Описание профиля не должно превышать 100 символов! <br></br>
                            Занимаюсь кулинарией.</span> {/*  */}
                    </div>
                </div>
                <Link to="/profileEdit">
                    <button className='w-[360px] h-[40px] border-[1px] rounded-[5px] border-[#E6E6E6] bg-[#F9F9F9] flex items-center justify-center'><span className='font-montserrat leading-7 text-[20px] tracking-[0.2px] text-[#000000]'>Редактировать профиль</span></button>
                </Link>
            </div>
            <nav className='pt-[35px] pb-[10px] flex gap-[150px] justify-center border-b-4 border-[#D9D9D9] w-[100%]'>
                <PublicationsIcon
                    className={`cursor-pointer transition-colors duration-300 ${activeTab === 'publications'
                        ? 'text-[#000000]'  // активное состояние
                        : 'text-[#C0BFBF] hover:text-[#9B9B9B]'  // обычное и при наведении
                        }`}
                    onClick={() => setActiveTab('publications')}
                />
                <SavedIcon
                    className={`cursor-pointer transition-colors duration-300 ${activeTab === 'saved'
                        ? 'text-[#000000]'
                        : 'text-[#C0BFBF] hover:text-[#9B9B9B]'
                        }`}
                    onClick={() => setActiveTab('saved')}
                />
            </nav>
            <div className='flex items-center w-[90%] flex-col gap-1'>
                <div className='flex gap-1'>
                    <img src={testPost} />
                    <img src={testPost} />
                    <img src={testPost} />
                </div>
                <div className='flex gap-1'>
                    <img src={testPost} />
                    <img src={testPost} />
                    <img src={testPost} />
                </div>
                <div className='flex'></div>
            </div>
        </div>
    )
}