import { useEffect } from 'react';
import { usePostStore } from '../../stores/postStore';
import Publication from './Publication';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { useAuthStore } from '../../stores/authStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Feed() {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const { fetchSettings } = useUserSettingsStore();

    const { posts, isLoading, fetchPosts, hasMore } = usePostStore();

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        fetchPosts(true);
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchPosts, fetchSettings]);

    // слушает тег main, а не window
    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            // Если до конца списка осталось 500px — грузим следующую страницу
            if (target.scrollHeight - target.scrollTop - target.clientHeight < 500) {
                if (!isLoading && hasMore) {
                    fetchPosts();
                }
            }
        };

        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.addEventListener('scroll', handleScroll);
            return () => mainElement.removeEventListener('scroll', handleScroll);
        }
    }, [isLoading, hasMore, fetchPosts]);

    return (
        <div className='w-[100%] flex items-center flex-col'>
            {isMobile ? (
                <div className='flex flex-col gap-y-6 max-w-[100%]'>
                    {posts.map(post => (
                        <Publication key={post.id} post={post} />
                    ))}
                    {isLoading && <div className="col-span-2 text-center">Загрузка...</div>}
                </div>
            ) : (
                <div className='grid grid-cols-2 gap-x-[85px] gap-y-6 max-w-[1200px]'>
                    {posts.map(post => (
                        <Publication key={post.id} post={post} />
                    ))}
                    {isLoading && <div className="col-span-2 text-center">Загрузка...</div>}
                </div>
            )}
            {!isLoading && posts.length === 0 && (
                <div className="mt-10 font-montserrat text-gray-400 text-[20px]">
                    По вашему запросу ничего не найдено :(
                </div>
            )}
        </div>
    );
}