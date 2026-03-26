import { Link } from 'react-router-dom';
export default function Login() {
    return (
        <div className="flex items-center justify-center flex-col h-[100vh] gap-5">
            <h1 className="text-[#252B42] font-montserrat font-semibold text-[24px] tracking-[0.1px]">Регистрация</h1>
            <form className="max-w-[250px] flex items-center justify-center flex-col gap-2 text-[#252B42] font-montserrat font-semibold text-[14px] tracking-[0.2px]">
                <div className=''>
                    <div className='flex gap-1'>
                        <h2>Никнейм</h2>
                        <span className='text-[#E0232E]'>*</span>
                    </div>
                    <input placeholder='Придумайте никнейм' className="w-[100%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none"></input>
                </div>
                <div>
                    <div className='flex gap-1'>
                        <h2>Email</h2>
                        <span className='text-[#E0232E]'>*</span>
                    </div>
                    <input placeholder='example@gmail.com' className="w-[100%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none"></input>
                </div>
                <div>
                    <div className='flex gap-1'>
                        <h2>Пароль</h2>
                        <span className='text-[#E0232E] gap-1'>*</span>
                    </div>
                    <input placeholder='Придумайте пароль' className="w-[100%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none"></input>
                </div>
                <div>
                    <div className='flex gap-1'>
                        <h2>Повторите пароль</h2>
                        <span className='text-[#E0232E]'>*</span>
                    </div>
                    <input placeholder='Повторите пароль' className="w-[100%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none"></input>
                </div>
                <button className="w-[100%] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px]">Выслать код на почту</button> {/* Будет появляться окно с кодом подтверждения, где нужно ввести код и нажать кнопку подтвердить */}
            </form >
            <Link to="/register"><p className="underline font-montserrat text-[#737373] text-[12px] tracking-[0.2px]">Уже есть аккаунт?</p></Link>
        </div >
    )
}