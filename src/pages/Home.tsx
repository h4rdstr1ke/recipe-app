import { useState } from 'react';
import Feed from '../features/feed/Feed';
import PersonalizedFeed from '../features/feed/PersonalizedFeed';
import { useAuthStore } from '../stores/authStore';

export default function Home() {
    // Состояние активной вкладки: 'all' (Общая) или 'personalized' (ИИ)
    const [activeTab, setActiveTab] = useState<'all' | 'personalized'>('all');

    // Проверяем авторизацию для отображения вкладки
    const isAuthenticated = useAuthStore(state => !!state.token);

    return (
        <div className='flex flex-col items-center w-full min-h-screen bg-white'>
            {/* Навигация по лентам (Табы) */}
            <div className='flex justify-center md:justify-start w-full max-w-[1185px] mt-6 px-4 md:px-0 gap-6 sm:gap-10 border-b-[1px] border-[#E6E6E6]'>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 font-montserrat text-[18px] md:text-[24px] font-bold tracking-[0.2px] transition-all border-b-4 
                        ${activeTab === 'all'
                            ? 'border-[#23A6F0] text-[#000000]'
                            : 'border-transparent text-[#737373] hover:text-[#000000]'}`}
                >
                    Приготовить сегодня
                </button>

                {isAuthenticated && (
                    <button
                        onClick={() => setActiveTab('personalized')}
                        className={`pb-3 font-montserrat text-[18px] md:text-[24px] font-bold tracking-[0.2px] transition-all border-b-4 
                            ${activeTab === 'personalized'
                                ? 'border-[#23A6F0] text-[#23A6F0]'
                                : 'border-transparent text-[#737373] hover:text-[#23A6F0]'}`}
                    >
                        ✨ Для вас
                    </button>
                )}
            </div>

            {/* Контент выбранной ленты */}
            <div className="w-full animate-fadeIn mt-[30px]">
                {activeTab === 'all' ? (
                    <Feed />
                ) : (
                    <PersonalizedFeed />
                )}
            </div>
        </div>
    );
}