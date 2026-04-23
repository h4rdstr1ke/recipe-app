import HomeIcon from '../../assets/icons/home.svg?react'
import StarIcon from '../../assets/icons/starFooter.svg?react'
import FindIcon from '../../assets/icons/loupe.svg?react'
import DefaultAvatar from '../../assets/defaultAvatar.svg?react'
import { Link } from 'react-router-dom'

export default function FooterMobile() {
    return (
        <footer className='w-full h-[30px] flex items-center justify-around bg-white border-t-[1px] border-[#D9D9D9]'>
            <Link to='/' >
                <HomeIcon className='w-[16px] h-[16px]' />
            </Link>
            <StarIcon className='w-[16px] h-[16px]' />
            <FindIcon className='w-[16px] h-[16px]' />
            <Link to='profile' >
                <DefaultAvatar className='w-[16px] h-[16px]' />
            </Link>
        </footer>
    )
}