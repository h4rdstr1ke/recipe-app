import { useState } from "react";
export default function SwitchDisplay() {
    const [alwaysOn, setAlwaysOn] = useState(false); // Переключатель
    return (
        <div className="flex w-[100%] mt-4 mb-4 gap-[10px] items-center">
            <button
                onClick={() => setAlwaysOn(!alwaysOn)}
                className={`
                    relative w-[45px] h-[25px] rounded-full transition-colors duration-300
                    ${alwaysOn ? 'bg-[#23A6F0]' : 'bg-gray-300'}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 border-[1px] border-[#D0D0D0]
                        ${alwaysOn ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
            <span className="font-montserrat text-[16px] text-[#737373] leading-7 tracking-[0.2px]">
                Негаснущий экран
            </span>
        </div>
    )
}