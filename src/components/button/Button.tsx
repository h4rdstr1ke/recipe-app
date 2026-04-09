// components/button/button.tsx
export default function Button({ children, className, onClick }: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                rounded-[5px] transition-all duration-300 transform active:scale-95 
                bg-[#23A6F0] hover:bg-[#7ACDFC] 
                ${className}
            `}
        >
            <span className='font-montserrat text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>
                {children}
            </span>
        </button>
    )
}