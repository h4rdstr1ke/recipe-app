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
    const { currentPost, fetchPostById, isLoading, clearCurrentPost, error } = usePostStore();

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

    // ОШИБКА: Показываем "не найдено", только если стор сказа что произошла ошибка
    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center font-montserrat">
                <h2 className="text-2xl font-bold mb-4">Упс!</h2>
                <p className="text-gray-500 text-lg">{error || 'Публикация не найдена'}</p>
            </div>
        );
    }

    // ЗАГРУЗКА: Если крутится спиннер ИЛИ поста просто ЕЩЕ НЕТ 
    if (isLoading || !currentPost) {
        return <div className="h-screen flex items-center justify-center font-montserrat">Загрузка...</div>;
    }

    // УСПЕХ: Пост загружен
    return (
        <div className='flex justify-center'>
            <div className='flex flex-col w-[900px] mt-4 gap-2'>
                <ButtonBackRecipes />
                <PublicationFull post={currentPost} />
            </div>
        </div>
    );
}