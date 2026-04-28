import { useEffect } from 'react';
import { useTopAuthorStore } from '../stores/topAuthorStore';

import Button from "../components/button/Button"
import DefaultAvatar from "../assets/defaultAvatar.svg"
import Medal from "../assets/icons/medal.svg?react"
import { Link } from 'react-router-dom';

/**
 * Страница "Топ-авторов" (Рейтинг / Leaderboard).
 * Отображает список пользователей с наивысшим рейтингом.
 */
export default function TopAuthorsPage() {
    // ---------------------------------------------------------
    // 1. ДАННЫЕ ИЗ СТОРА
    // ---------------------------------------------------------
    const { authors, isLoading, error, fetchTopAuthors } = useTopAuthorStore();

    // Загружаем авторов при первом открытии страницы
    useEffect(() => {
        fetchTopAuthors();
    }, [fetchTopAuthors]);

    // ---------------------------------------------------------
    // 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Хелперы)
    // ---------------------------------------------------------

    /**
     * Возвращает Tailwind-класс цвета для медали в зависимости от позиции в топе.
     * @param index - Позиция в массиве (0 = первое место)
     */
    const getMedalClass = (index: number) => {
        if (index === 0) return "text-[#FFEF3F]"; // Золото
        if (index === 1) return "text-[#E7E7E7]"; // Серебро
        if (index === 2) return "text-[#D0B078]"; // Бронза
        return "invisible";                       // Убираем медаль для остальных
    };

    // ---------------------------------------------------------
    // 3. СОСТОЯНИЯ ЗАГРУЗКИ / ОШИБКИ
    // ---------------------------------------------------------
    if (isLoading) {
        return <div className="text-center mt-20 text-2xl font-montserrat">Загрузка топа...</div>;
    }
    if (error) {
        return <div className="text-center mt-20 text-red-500 font-montserrat">Ошибка: {error}</div>;
    }

    // ---------------------------------------------------------
    // 4. ОСНОВНОЙ РЕНДЕР
    // ---------------------------------------------------------
    return (
        <div className="flex justify-center">
            <div className="flex flex-col w-[100%] md:w-[900px]">
                <div className='flex items-center pl-4 mt-4 mb-4 md:pl-0 md:mt-[26px] md:mb-[49px]'>
                    <h2 className="font-montserrat font-thin text-[30px] md:text-[48px] leading-7 tracking-[0.2px]">Топ-авторов</h2>
                </div>
                {/* Шапка - определяем сетку колонок */}
                <div className="mb-[20px] md:mb-[26px] grid grid-cols-[50px_repeat(auto-fit,minmax(60px,1fr))] md:grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center md:px-[35px] bg-[#D3D3D3] h-[37px] rounded-[10px]">
                    <span className="font-montserrat font-semibold text-[12px] md:text-[18px]">Топ</span>

                    {/* Мобильная колонка: Пользователь (скрыта на md и выше) */}
                    <span className="font-montserrat font-semibold text-[12px] md:hidden">Пользователь</span>

                    {/* Десктопные колонки: Аватарка и Никнейм (скрыты до md) */}
                    <span className="font-montserrat font-semibold hidden md:block md:text-[18px]">Аватарка</span>
                    <span className="font-montserrat font-semibold hidden md:block md:text-[18px]">Никнейм</span>

                    <span className="font-montserrat font-semibold text-[12px] md:text-[18px]">Посты</span>
                    <span className="font-montserrat font-semibold text-[12px] md:text-[18px]">Подписчики</span>
                    <span className="font-montserrat font-semibold text-[12px] md:text-[18px]">Рейтинг</span>
                    <span className="font-montserrat font-semibold text-[12px] md:text-[18px] text-right hidden md:block">Подписка</span>
                </div>

                {/* Строка с данными - та же сетка */}
                <div className="flex flex-col gap-[15px] md:gap-[30px]">
                    {authors.map((author, index) => (
                        <div
                            key={author.id}
                            className="grid grid-cols-[50px_repeat(auto-fit,minmax(60px,1fr))] md:grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center bg-[#F1F1F1] rounded-[10px] h-[45px] md:h-[65px] md:px-[35px]"
                        >
                            {/* Топ и Медаль */}
                            <div className="flex items-center justify-center md:gap-2">
                                <span className="font-montserrat font-semibold md:text-[24px]">
                                    {index + 1} {/* index начинается с 0, поэтому +1 */}
                                </span>
                                <Medal className={`w-[20px] md:w-[26px] ${getMedalClass(index)}`} />
                            </div>
                            {/* МОБИЛЬНАЯ ВЕРСИЯ: Аватар + Никнейм вместе */}
                            <Link
                                to={`/profile/${author.id}`}
                                className="flex md:hidden items-center gap-2 justify-center w-full px-2 hover:opacity-80 transition-opacity"
                            >
                                <img alt="avatar" src={author.avatarUrl || DefaultAvatar} className="w-[25px] h-[25px] object-cover rounded-full select-none" />
                                <span className="font-montserrat font-semibold text-[12px] text-[#23A6F0] underline truncate max-w-[80px]">
                                    {author.username}
                                </span>
                            </Link>
                            {/* Аватарка (если у автора нет аватарки, ставим дефолтную) */}
                            <Link to={`/profile/${author.id}`} className="hidden md:block hover:scale-105 transition-transform">
                                <img
                                    alt="avatar"
                                    src={author.avatarUrl || DefaultAvatar}
                                    className="md:w-[50px] md:h-[50px] object-cover rounded-full select-none"
                                />
                            </Link>

                            {/* Никнейм */}
                            {/* ДЕСКТОПНАЯ ВЕРСИЯ: Никнейм отдельно */}
                            <Link
                                to={`/profile/${author.id}`}
                                className="hidden md:block font-montserrat font-semibold md:text-[24px] text-[#23A6F0] underline hover:text-[#1a7db8] transition-colors"
                            >
                                {author.username}
                            </Link>

                            {/* Посты */}
                            <span className="font-montserrat font-semibold md:text-[24px]">
                                {author.postsCount}
                            </span>

                            {/* Подписчики */}
                            <span className="font-montserrat font-semibold md:text-[24px]">
                                {author.subscribersCount}
                            </span>

                            {/* Рейтинг */}
                            <span className="font-montserrat font-semibold md:text-[24px]">
                                {author.ratingScore}
                            </span>

                            {/* Подписка */}
                            <Button className="text-[14px] md:w-[134px] md:h-[28px] hidden md:block">Подписаться</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}