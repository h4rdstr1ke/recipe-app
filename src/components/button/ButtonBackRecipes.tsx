import { Link } from "react-router-dom";
import Arrow from '../../assets/arrow.svg?react'

export default function ButtonBackRecipes() {
    return (
        <div>
            <Link to="/">
                <button className='flex items-center justify-center gap-2 border-[1px] rounded-[37px] w-[152px] h-[28px] border-[#23A6F0]'>
                    <Arrow className='rotate-180 text-[#23A6F0]' />
                    <span className='font-montserrat text-[14px] text-[#23A6F0] tracking-[0.2px] leading-7 font-bold'>К рецептам</span>
                </button>
            </Link>
        </div>
    )
}