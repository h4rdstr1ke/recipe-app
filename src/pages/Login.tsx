import { Link } from 'react-router-dom';

// Компонент поля ввода (временно тут)
function InputField({ placeholder, type = "text" }: any) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className="w-[100%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none"
        />
    );
}

export default function Register() {
    return (
        <div className="flex items-center justify-center flex-col h-[100vh] gap-5">
            <h1 className="text-[#252B42] font-montserrat font-bold text-[24px] tracking-[0.1px]">
                Войти
            </h1>
            <form className="max-w-[250px] flex items-center justify-center flex-col gap-2 text-[#252B42] font-montserrat font-semibold text-[14px] tracking-[0.2px]">
                <div className='w-[100%]'>
                    <div className="flex gap-1">
                        <h2>Email</h2>
                        <span className="text-[#E0232E]">*</span>
                    </div>
                    <InputField placeholder="example@gmail.com" />
                </div>

                <div className='w-[100%]'>
                    <div className="flex gap-1">
                        <h2>Пароль</h2>
                        <span className="text-[#E0232E]">*</span>
                    </div>
                    <InputField type="password" placeholder="Придумайте пароль" />
                </div>
                <button className="w-[100%] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px]">
                    Войти
                </button>
                <Link to="/register">
                    <p className="underline font-montserrat font-normal text-[#737373] text-[12px] tracking-[0.2px]">
                        Еще нет аккаунта? Зарегистрируйся!
                    </p>
                </Link>
            </form>
        </div>
    )
}