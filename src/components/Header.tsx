import logo from '../assets/Logo.svg';
import ArrowIcon from '../assets/arrow.svg?react';

export default function Header() {
    return (
        <header>
            <div className='flex border-2'>
                <img src={logo} className='border border-black' alt='Логотип' />
                <div className='border border-black'>Search</div>
                <button className='flex justify-center items-center gap-2 border border-[#23A6F0] rounded-[37px] bg-[#FFFFFF] w-[127px] h-[58px] tracking-[0.2px] text-[14px] text-[#23A6F0]'>
                    <span className='font-montserrat font-bold'>Войти</span>
                    <ArrowIcon className="w-3.5 h-[14px]" /> {/* translate-y-[1px] */}
                </button>
            </div>
        </header >
    )
}