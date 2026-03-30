import Avatar from '../../assets/avatar.svg?react';
import ArrowIcon from '../../assets/icons/arrowDown.svg?react';
export default function ProfileMenu() {
    return (
        <div className='flex gap-3 translate-y-1 items-center'>
            <Avatar className='w-[50px] h-[50px]' />
            <div className='flex flex-col '>
                <span className='font-montserrat font-extrabold tracking-[0.2px] text-[16px] text-[#000000] '>vlad228</span>
                <span className='font-montserrat font-semibold tracking-[0.2px] text-[15px] text-[#252B42] '>Владислав</span>
            </div>
            <ArrowIcon className='' />
        </div>
    )
}