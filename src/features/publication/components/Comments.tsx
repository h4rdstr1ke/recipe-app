import avatar from '../../../assets/avatar.svg';
import ImageAdd from '../../../assets/icons/publicationPage/imageAdd.svg?react'
import Reply from '../../../assets/icons/publicationPage/reply.svg?react'
import Like from '../../../assets/icons/feed/like.svg?react'
import Pencil from '../../../assets/icons/publicationPage/pencil.svg?react'
import { useState } from 'react';

// Данные для примера
const replies = [
    { id: 1, username: 'dasha222', text: 'Брат, готовка - это не твое))', date: '29.03.2026', time: '23:01' },
    { id: 2, username: 'ira000', text: 'Вкусняшка', date: '29.03.2026', time: '23:22' }
];

type Comments = {
    username: string;
}

export default function Comments({ username }: Comments) {
    const [showReplies, setShowReplies] = useState(false);
    return (
        <div className='w-[100%] flex flex-col mt-5'>
            <div>
                <div className='flex gap-1 mb-6'>
                    <h3 className='font-montserrat text-[28px] font-bold tracking-[0.2px] leading-7'>КОММЕНТАРИИ</h3>
                    <span className='font-montserrat text-[28px] font-light text-[#D1D1D1] tracking-[0.2px] leading-7'>(3)</span>
                </div>
                <div className='pl-5 relative'>
                    <textarea placeholder='Напишите отзыв по блюду!' className={`min-h-[83px] h-[83px] w-[100%] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] rounded-[5px]
                font-montserrat text-[14px] tracking-[0.2px] leading-7
                   focus:outline-none resize-none placeholder:font-montserrat placeholder:text-[14px] placeholder:leading-7 placeholder:tracking-[0.2px] placeholder:text-[#737373]
                    py-[7px] px-[21px]`} />
                    <ImageAdd className='absolute top-[11px] right-[7px] text-[#737373]' />
                </div>
                <div className='w-[100%] flex justify-end mt-4'>
                    <button className='w-[135px] h-[30px] bg-[#23A6F0] rounded-[5px]'><span className='font-montserrat text-[14px] text-[#FFFFFF] font-bold tracking-[0.2px] leading-7'>Опубликовать</span></button>
                </div>
            </div>
            <div className='flex flex-col mt-2'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                        <img src={avatar} className='w-[30px]' />
                        <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{username}</span>
                    </div>
                    <div className='flex gap-4 translate-y-3'>
                        <div className='flex items-center gap-[7px]'>
                            <Like />
                            <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-medium leading-7'>3</span>
                        </div>
                        <Reply />
                    </div>
                </div>
                <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px] font-light leading-7'>Вкусно, будто мама готовила!</span>
                <img className='w-[300px] h-[200px] rounded-[10px] bg-[#E6E6E6]' alt='Фото' />
                <div className='flex justify-end w-[100%]'>
                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-7'>29.03.2026 в 19:57</span>
                </div>
                {/* Ответы */}
                <div className='flex flex-col'>
                    <span
                        onClick={() => setShowReplies(!showReplies)}
                        className='font-montserrat mb-4 text-[16px] text-[#737373] tracking-[0.2px] leading-6 underline cursor-pointer'
                    >
                        {showReplies ? 'Скрыть ответы' : `Посмотреть ответы (${replies.length})`}
                    </span>

                    {showReplies && (
                        <>
                            <div className='flex justify-between'>
                                <div className='flex gap-2 items-center'>
                                    <img src={avatar} className='w-[30px]' />
                                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>dasha222</span>
                                </div>
                                <div className='flex'>
                                    <Pencil />
                                </div>
                            </div>
                            <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px] font-light leading-7'>Брат, готовка - это не твое))</span>
                            <div className='flex justify-end w-[100%]'>
                                <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-7'>29.03.2026 в 23:01</span>
                            </div>

                            <div className='flex justify-between'>
                                <div className='flex gap-2 items-center'>
                                    <img src={avatar} className='w-[30px]' />
                                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>ira000</span>
                                </div>
                                <div className='flex'>
                                    <Pencil />
                                </div>
                            </div>
                            <span className='font-montserrat text-[16px] text-[#000000] tracking-[0.2px] font-light leading-7'>Вкусняшка</span>
                            <div className='flex justify-end w-[100%]'>
                                <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-7'>29.03.2026 в 23:22</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

    )
}