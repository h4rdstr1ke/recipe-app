import { useEffect } from 'react';
import { usePostStore } from '../../stores/postStore';
import Publication from './Publication';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { useAuthStore } from '../../stores/authStore';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useFilteredPosts } from './hooks/useFilteredPosts';

export default function Feed() {
    // Булево значение наличия валидного токена для контроля доступа к персонализированным данным
    const isAuthenticated = useAuthStore((state) => !!state.token);

    // Метод загрузки глобальных списков (избранное, аллергены)
    const { fetchSettings } = useUserSettingsStore();
    // Состояние процесса загрузки, метод пагинации и флаг наличия следующих страниц
    const { isLoading, fetchPosts } = usePostStore();

    // Флаг мобильного разрешения экрана 
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Итоговый массив публикаций после применения активных фильтров и сортировки
    const filteredAndSortedPosts = useFilteredPosts();

    // Первичная инициализация: получение первой страницы постов и профиля пользователя
    useEffect(() => {
        fetchPosts(true);
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchPosts, fetchSettings]);

    // Механизм бесконечного скролла: отслеживание позиции окна и вызов метода пагинации
    useEffect(() => {
        const handleScroll = () => {
            const state = usePostStore.getState();

            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
                if (!state.isLoading && state.hasMore) {
                    fetchPosts();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchPosts]);

    return (
        <div className='w-[100%] flex items-center flex-col'>
            {isMobile ?
                (<div className='flex px-4 w-[100%] mt-2 mb-2'>
                    <h1 className='font-montserrat text-[30px] text-[#000000] tracking-[0.2px] font-thin leading-relaxed'>Приготовить сегодня</h1>
                </div>)
                :
                (<div className='flex justify-start w-[1185px] mt-[30px] mb-[30px]'>
                    <h1 className='font-montserrat text-[48px] text-[#000000] tracking-[0.2px] font-thin leading-7'>Приготовить сегодня</h1>
                </div>)}

            {isMobile ?
                (<div className='flex flex-col gap-y-6 max-w-[100%]'>
                    {filteredAndSortedPosts.map(post => (
                        <Publication key={post.id} post={post} />
                    ))}
                    {isLoading && <div className="col-span-2 text-center">Загрузка...</div>}
                </div>) :
                (<div className='grid grid-cols-2 gap-x-[85px] gap-y-6 max-w-[1200px]'>
                    {filteredAndSortedPosts.map(post => (
                        <Publication key={post.id} post={post} />
                    ))}
                    {isLoading && <div className="col-span-2 text-center">Загрузка...</div>}
                </div>)}
            {!isLoading && filteredAndSortedPosts.length === 0 && (
                <div className="mt-10 font-montserrat text-gray-400 text-[20px]">
                    По вашему запросу ничего не найдено :(
                </div>
            )}
        </div >
    );
}