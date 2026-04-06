import HelperBackground from '../../assets/icons/helper/helperBackground.svg?react';
import Ai from '../../assets/icons/helper/AI.svg?react';


export default function Helper() {
    return (
        <div className='w-[220px] h-[80px] fixed bottom-5 right-5'>
            <HelperBackground className="absolute inset-0" />
            <button className="relative flex items-center w-[210px] h-[65px] pl-[6px] gap-1">
                <span className="relative z-10 flex items-center justify-center gap-2 text-white text-[18px] font-bold font-montserrat tracking-[0.2px] leading-6">
                    ИИ-Помощник
                </span>
                <Ai className='translate-y-[2px] h-[45px]' />
            </button>
        </div>
    );
}