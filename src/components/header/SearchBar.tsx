import LoupeIcon from '../../assets/icons/loupe.svg?react';
import SettingsIcon from '../../assets/icons/settings.svg?react';

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div>
            <form className='flex justify-center items-center w-[450px] h-[50px] gap-4'>
                <div className='w-[340px] h-[50px] gap-8 flex justify-center items-center bg-[#F9F9F9] border border-[#DADADA] rounded-[5px]'>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Поиск"
                        className='w-[75%] h-[100%] border-none focus:outline-none focus:border-none placeholder:text-[#737373] font-montserrat text-[14px] tracking-[0.2px]'
                    />
                    <LoupeIcon className='w-[16px] h-[16px]' />
                </div>
                <SettingsIcon className='w-[26px] h-[25px]' />
            </form>
        </div>
    )
}