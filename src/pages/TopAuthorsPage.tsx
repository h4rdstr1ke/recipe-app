import { useEffect } from 'react';
import { useTopAuthorStore } from '../stores/topAuthorStore';

import Button from "../components/button/Button"
import Avatar from "../assets/avatar.svg"
import Medal from "../assets/medal.svg?react"

export default function TopAuthorsPage() {

    const { authors, isLoading, error, fetchTopAuthors } = useTopAuthorStore();

    useEffect(() => {
        fetchTopAuthors();
    }, [fetchTopAuthors]);

    // Медали
    const getMedalClass = (index: number) => {
        if (index === 0) return "text-[#FFEF3F]";
        if (index === 1) return "text-[#E7E7E7]";
        if (index === 2) return "text-[#D0B078]";
        return "invisible";
    };

    if (isLoading) {
        return <div className="text-center mt-20 text-2xl font-montserrat">Загрузка топа...</div>;
    }
    if (error) {
        return <div className="text-center mt-20 text-red-500 font-montserrat">Ошибка: {error}</div>;
    }
    return (
        <div className="flex justify-center">
            <div className="flex flex-col w-[900px]">
                <h2 className=" mt-[26px] font-montserrat font-thin text-[48px] leading-7 tracking-[0.2px] mb-[49px]">Топ-авторов</h2>

                {/* Шапка - определяем сетку колонок */}
                <div className="mb-[26px] grid grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center px-[35px] bg-[#D3D3D3] h-[37px] rounded-[10px]">
                    <span className="font-montserrat font-semibold text-[18px]">Топ</span>
                    <span className="font-montserrat font-semibold text-[18px]">Аватарка</span>
                    <span className="font-montserrat font-semibold text-[18px]">Никнейм</span>
                    <span className="font-montserrat font-semibold text-[18px]">Посты</span>
                    <span className="font-montserrat font-semibold text-[18px]">Подписчики</span>
                    <span className="font-montserrat font-semibold text-[18px]">Рейтинг</span>
                    <span className="font-montserrat font-semibold text-[18px] text-right">Подписка</span>
                </div>

                {/* Строка с данными - та же сетка */}
                <div className="flex flex-col gap-[30px]">
                    {authors.map((author, index) => (
                        <div
                            key={author.id}
                            className="grid grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center bg-[#F1F1F1] rounded-[10px] h-[65px] px-[35px]"
                        >
                            {/* Топ и Медаль */}
                            <div className="flex items-center gap-2">
                                <span className="font-montserrat font-semibold text-[24px]">
                                    {index + 1} {/* index начинается с 0, поэтому +1 */}
                                </span>
                                <Medal className={`w-[26px] ${getMedalClass(index)}`} />
                            </div>

                            {/* Аватарка (если у автора нет аватарки, ставим дефолтную) */}
                            <img alt="avatar" src={author.avatarUrl || Avatar} className="w-[50px] rounded-full" />

                            {/* Никнейм */}
                            <span className="font-montserrat font-semibold text-[24px] text-[#23A6F0] underline">
                                {author.username}
                            </span>

                            {/* Посты */}
                            <span className="font-montserrat font-semibold text-[24px]">
                                {author.postsCount}
                            </span>

                            {/* Подписчики */}
                            <span className="font-montserrat font-semibold text-[24px]">
                                {author.subscribersCount}
                            </span>

                            {/* Рейтинг */}
                            <span className="font-montserrat font-semibold text-[24px]">
                                {author.ratingScore}
                            </span>

                            {/* Подписка */}
                            <Button className="text-[14px] w-[134px] h-[28px]">Подписаться</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}