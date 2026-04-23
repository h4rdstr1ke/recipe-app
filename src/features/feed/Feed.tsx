import { useEffect } from 'react';
import { usePostStore } from '../../stores/postStore';
import Publication from './Publication';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { useAuthStore } from '../../stores/authStore';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useFilteredPosts } from './hooks/useFilteredPosts';

export default function Feed() {
    const { isAuthenticated } = useAuthStore();
    const { fetchSettings } = useUserSettingsStore();
    const { isLoading, fetchPosts, hasMore } = usePostStore();

    const isMobile = useMediaQuery('(max-width: 768px)');

    // Вся логика фильтрации и сортировки
    const filteredAndSortedPosts = useFilteredPosts();

    useEffect(() => {
        fetchPosts(true);
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchPosts, fetchSettings]);

    // Логика бесконечного скролла
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
                if (!isLoading && hasMore) {
                    fetchPosts();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, fetchPosts]);


    return (
        <div className='w-[100%] flex items-center flex-col'>
            {isMobile ?
                (<div>
                    <h1 className='font-montserrat text-[12px] text-[#000000] tracking-[0.2px] font-thin leading-relaxed'>Приготовить сегодня</h1>
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