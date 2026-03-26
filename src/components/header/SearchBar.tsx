import LoupeIcon from '../../assets/icons/loupe.svg?react';
import SettingsIcon from '../../assets/icons/settings.svg?react';

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div>
            <form className='flex justify-center items-center w-[450px] h-[50px] gap-4 bg-[#F9F9F9] border border-[#DADADA] rounded-[5px]'>
                <LoupeIcon className='w-[16px] h-[16px]' />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Поиск"
                    className='w-[75%] h-[100%] border-none focus:outline-none focus:border-none placeholder:text-[#000000] font-montserrat text-[14px] tracking-[0.2px]'
                />
                <SettingsIcon className='w-[26px] h-[25px]' />
            </form>
        </div>
    )
}