import HomeIcon from '../../assets/icons/home.svg?react'
import StarIcon from '../../assets/icons/starFooter.svg?react'
import FindIcon from '../../assets/icons/loupe.svg?react'
import DefaultAvatar from '../../assets/defaultAvatar.svg?react'
import { Link } from 'react-router-dom'

export default function FooterMobile() {
    return (
        <footer className='w-full h-[60px] flex items-center justify-around bg-white border-t-[1px] border-[#D9D9D9]'>
            <Link to='/' >
                <HomeIcon className='w-[24px] h-[24px]' />
            </Link>
            <StarIcon className='w-[24px] h-[24px]' />
            <FindIcon className='w-[24px] h-[24px]' />
            <Link to='profile' >
                <DefaultAvatar className='w-[24px] h-[24px]' />
            </Link>
        </footer>
    )
}