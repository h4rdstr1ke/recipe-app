import React from 'react';

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`py-[10px] 
        px-[10px] leading-6 focus:outline-none font-montserrat tracking-[0.2px] text-[14px] placeholder:text-[14px] 
        placeholder:text-[#737373] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]
        ${props.className || ''}`} />
    )
}