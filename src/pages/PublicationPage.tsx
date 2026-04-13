import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useAuthStore } from '../stores/authStore';

import ButtonBackRecipes from '../components/button/ButtonBackRecipes';
import PublicationFull from '../features/publication/PublicationFull';

export default function PublicationPage() {
    const { id } = useParams<{ id: string }>();

    // дмостаем currentPost из стора
    const { currentPost, fetchPostById, isLoading, clearCurrentPost } = usePostStore();

    const { isAuthenticated } = useAuthStore();
    const { fetchSettings } = useUserSettingsStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchSettings]);

    useEffect(() => {
        if (id) {
            fetchPostById(id);
        }

        // Очищаем пост при уходе со страницы, чтобы при открытии следующего 
        // не мелькнул старый контент на долю секунды
        return () => {
            clearCurrentPost();
        };
    }, [id, fetchPostById, clearCurrentPost]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23A6F0]"></div>
            </div>
        );
    }

    if (!currentPost) {
        return <div className="text-center mt-10">Публикация не найдена</div>;
    }

    return (
        <div className='flex justify-center'>
            <div className='flex flex-col w-[900px] mt-4 gap-2'>
                <ButtonBackRecipes />
                <PublicationFull post={currentPost} />
            </div>
        </div>
    );
}