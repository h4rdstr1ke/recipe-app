import { useEffect } from 'react';
import { usePostStore } from '../../stores/postStore';
import Publication from './Publication';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { useAuthStore } from '../../stores/authStore';

export default function Feed() {
    const { isAuthenticated } = useAuthStore();
    const { fetchSettings } = useUserSettingsStore();
    const { posts, isLoading, fetchPosts, hasMore } = usePostStore();


    useEffect(() => {
        fetchPosts(true); // Загружаем первую страницу
        // Если пользователь авторизован, загружаем его настройки
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated]);

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
            <div className='flex justify-start w-[1185px] mt-[30px] mb-[30px]'> {/* НАДО ИСПРАВИТЬ!! */}
                <h1 className='font-montserrat text-[48px] text-[#000000] tracking-[0.2px] font-thin leading-7'>Приготовить сегодня</h1>
            </div>
            <div className='grid grid-cols-2 gap-x-[85px] gap-y-6 max-w-[1200px]'>
                {posts.map(post => (
                    <Publication key={post.id} post={post} />
                ))}
                {isLoading && <div className="col-span-2 text-center">Загрузка...</div>}
            </div>
        </div >
    );
}