import HelperBackground from '../../assets/icons/helper/helperBackground.svg?react';
import Ai from '../../assets/icons/helper/AI.svg?react';
import AiHelper from '../../features/helperAi/Ai'
import { useState } from 'react';


export default function Helper() {
    const [isAiOpen, setIsAiOpen] = useState(false);
    const handleCloseModal = () => {
        setIsAiOpen(false)
    };
    const handleOpenModal = () => {
        setIsAiOpen(true)
    }
    return (
        <div className='w-[220px] h-[80px] fixed bottom-5 right-5'>
            <HelperBackground className="absolute inset-0" />
            <button className="relative flex items-center w-[210px] h-[65px] pl-[6px] gap-1" onClick={handleOpenModal}>
                <span className="relative z-10 flex items-center justify-center gap-2 text-white text-[18px] font-bold font-montserrat tracking-[0.2px] leading-6">
                    ИИ-Помощник
                </span>
                <Ai className='translate-y-[2px] h-[45px]' />
            </button>
            {isAiOpen && (<AiHelper onClose={handleCloseModal} />)}
        </div>
    );
}