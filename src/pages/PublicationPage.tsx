import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useAuthStore } from '../stores/authStore';

import ButtonBackRecipes from '../components/button/ButtonBackRecipes';
import PublicationFull from '../features/publication/PublicationFull';

/**
 * Страница просмотра конкретного рецепта (публикации).
 * Отвечает за маршрутизацию, загрузку данных поста и обработку состояний (загрузка/ошибка).
 */
export default function PublicationPage() {
    // ---------------------------------------------------------
    // 1. ДАННЫЕ ИЗ МАРШРУТИЗАЦИИ
    // ---------------------------------------------------------

    // Получаем ID рецепта из адресной строки (например, /publication/123 -> id = "123")
    const { id } = useParams<{ id: string }>();

    // ---------------------------------------------------------
    // 2. ГЛОБАЛЬНЫЕ СТОРЫ (Zustand)
    // ---------------------------------------------------------

    // Методы и данные конкретного поста
    const { currentPost, fetchPostById, isLoading, clearCurrentPost, error } = usePostStore();

    // Проверка, авторизован ли текущий пользователь
    const { isAuthenticated } = useAuthStore();

    // Настройки пользователя (нужны, чтобы дочерние компоненты знали, стоит ли лайк или закладка)
    const { fetchSettings } = useUserSettingsStore();

    // ---------------------------------------------------------
    // 3. ЭФФЕКТЫ (Жизненный цикл)
    // ---------------------------------------------------------

    // Эффект 1: Загрузка настроек пользователя
    // Если юзер залогинен, подтягиваем его настройки (лайки/сохраненки).
    // Без этого иконки лайков на самом рецепте не будут знать, закрашиваться им или нет.
    useEffect(() => {
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchSettings]);

    // Эффект 2: Загрузка самого рецепта
    useEffect(() => {
        if (id) {
            fetchPostById(id);
        }

        // Функция очистки (cleanup) срабатывает при уходе со страницы (unmount компонента).
        // Очищаем currentPost, чтобы при открытии следующего рецепта 
        // пользователь на долю секунды не увидел контент старого рецепта.
        return () => {
            clearCurrentPost();
        };
    }, [id, fetchPostById, clearCurrentPost]);

    // ---------------------------------------------------------
    // 4. СОСТОЯНИЯ ОТОБРАЖЕНИЯ (РЕНДЕР)
    // ---------------------------------------------------------

    // СОСТОЯНИЕ 1: Ошибка сети или пост не найден
    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center font-montserrat">
                <h2 className="text-2xl font-bold mb-4">Упс!</h2>
                <p className="text-gray-500 text-lg">{error || 'Публикация не найдена'}</p>
            </div>
        );
    }

    // СОСТОЯНИЕ 2: Идет загрузка или данные еще не успели поступить в стейт
    if (isLoading || !currentPost) {
        return <div className="h-screen flex items-center justify-center font-montserrat">Загрузка...</div>;
    }

    // СОСТОЯНИЕ 3: Успех. Данные загружены, рендерим страницу
    return (
        <div className='flex justify-center'>
            <div className='flex flex-col w-[900px] mt-4 gap-2'>
                <ButtonBackRecipes />
                {/* Передаем загруженный пост в дочерний презентационный компонент */}
                <PublicationFull post={currentPost} />
            </div>
        </div>
    );
}