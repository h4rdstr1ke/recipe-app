import avatar from '../assets/avatar.svg';
import ArrowIcon from '../assets/icons/arrowDown.svg?react';
export default function ProfileEdit() {
    return (
        <div className='flex w-[100%] justify-center'>
            <form className='flex flex-col items-center'>
                <div className="flex w-[640px] h-[60px] mt-[34px] mb-[34px] px-[20px] items-center justify-between rounded-[20px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]">
                    <div className='flex items-center gap-4 '>
                        <img src={avatar} className='w-[50px]' />
                        <span className='font-montserrat text-[36px] tracking-[0.2px] leading-7'>vlad228</span>
                    </div>
                    <button className='w-[130px] h-[30px] flex items-center justify-center rounded-[5px] bg-[#23A6F0]'><span className='font-montserrat text-[14px] font-bold text-[#FFFFFF] tracking-[0.2px] leading-7'>Новое фото</span></button>
                </div>
                <div className="flex flex-col w-[960px]">
                    <div className='flex gap-1'>
                        <span className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold'>Введите свое имя</span>
                        <span className="text-[#E0232E] font-bold">*</span>
                    </div>
                    <input placeholder='Например: Иван' className='py-[10px] px-[20px] leading-6 focus:outline-none font-montserrat tracking-[0.2px] placeholder:text-[14px] placeholder:text-[#737373] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]' />
                    <span className='font-montserrat mt-4 text-[20px] tracking-[0.2px] leading-6 font-semibold'>Придумайте описание профиля</span>
                    <textarea placeholder='Например: люблю готовить рыбу!'
                        className='h-[83px] py-[10px] px-[20px] font-montserrat leading-6 tracking-[0.2px] placeholder:text-[14px] placeholder:text-[#737373] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] focus:outline-none' />
                    <span className='mt-4 font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold'>Аллергены</span>
                    <details className="mt-1 group">
                        <summary className="py-[10px] px-[20px] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] cursor-pointer font-montserrat leading-6 tracking-[0.2px] text-[14px] text-[#737373] list-none flex justify-between items-center">
                            Введите продукты, на которые у Вас аллергия
                            <ArrowIcon className={`w-[14px] transition-transform group-open:rotate-180`} />
                        </summary>
                        <div className="mt-1 p-3 border-[1px] border-[#E6E6E6] rounded-[5px] bg-white">
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Молоко</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Яйца</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Орехи</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Глютен</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Морепродукты</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Соя</label>
                        </div>
                    </details>

                    <span className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold mt-4'>Нежелательные продукты</span>
                    <details className="mt-1 group">
                        <summary className="py-[10px] px-[20px] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] cursor-pointer font-montserrat leading-6 tracking-[0.2px] text-[14px] text-[#737373] list-none flex justify-between items-center">
                            Введите продукты, которые Вам не нравятся
                            <ArrowIcon className={`w-[14px] transition-transform group-open:rotate-180`} />
                        </summary>
                        <div className="mt-1 p-3 border-[1px] border-[#E6E6E6] rounded-[5px] bg-white">
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Мясо</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Сахар</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Грибы</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Жирное</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Острое</label>
                            <label className="flex items-center gap-2 py-1"><input type="checkbox" /> Жареное</label>
                        </div>
                    </details>
                </div>
                <div className='flex w-[100%] justify-end'>
                    <button className='w-[175px] h-[40px] mt-[24px] bg-[#23A6F0] rounded-[5px]'><span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>Сохранить</span></button>
                </div>
            </form>
        </div >
    )
}