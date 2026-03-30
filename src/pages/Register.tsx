import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ArrowIcon from '../assets/arrow.svg?react';

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

export default function Login() {
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);

    useEffect(() => {
        let interval: number | undefined;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendCode = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Тут отправка данных на сервер
        setShowCodeInput(true);
        setTimer(60);
        setCanResend(false);
    };

    const handleResendCode = () => {
        if (!canResend) return;
        // Тут повторная отправка кода
        console.log('Повторная отправка кода');
        setTimer(60);
        setCanResend(false);
    };

    const handleConfirmCode = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Тут проверка кода
        console.log('Код:', code);
    };

    return (
        <div className="flex items-center justify-center flex-col h-[100vh] gap-5">
            <h1 className="text-[#252B42] font-montserrat font-bold text-[24px] tracking-[0.1px]">
                Регистрация
            </h1>
            {!showCodeInput ? (
                <form onSubmit={handleSendCode} className="max-w-[250px] w-[100%] flex items-center justify-center flex-col gap-2 text-[#252B42] font-montserrat font-semibold text-[14px] tracking-[0.2px]">
                    <div className='w-[100%]'>
                        <div className="flex gap-1">
                            <h2>Никнейм</h2>
                            <span className="text-[#E0232E]">*</span>
                        </div>
                        <InputField placeholder="Придумайте никнейм" />
                    </div>

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

                    <div className='w-[100%]'>
                        <div className="flex gap-1">
                            <h2>Повторите пароль</h2>
                            <span className="text-[#E0232E]">*</span>
                        </div>
                        <InputField type="password" placeholder="Повторите пароль" />
                    </div>

                    <button className="w-[100%] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px]">
                        Выслать код на почту
                    </button>
                    <Link to="/login">
                        <p className="underline font-montserrat font-normal text-[#737373] text-[12px] tracking-[0.2px]">
                            Уже есть аккаунт?
                        </p>
                    </Link>
                </form>

            ) : (
                <form onSubmit={handleConfirmCode} className="max-w-[350px] flex items-center justify-center flex-col gap-2">
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='font-montserrat font-semibold text-[14px] text-[#252B42] tracking-[0.2px]'>Код из письма</h2>
                        <input
                            type="text"
                            placeholder='******'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-[70%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={!canResend}
                        className={`font-montserrat text-[12px] tracking-[0.2px] ${canResend ? 'text-[#23A6F0] hover:text-[#1a7fb3] cursor-pointer' : 'text-[#737373] cursor-not-allowed'
                            }`}
                    >
                        {canResend
                            ? 'Отправить код еще раз'
                            : (
                                <>Запросить код повторно можно через <span className='font-semibold'>{timer} секунд</span></>
                            )
                        }
                    </button>

                    <button type="submit" className="w-[100%] max-w-[250px] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px]">
                        Подтвердить
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowCodeInput(false)}
                        className="flex justify-center items-center gap-2 w-[143px] h-[28px] mt-2 text-[#23A6F0] font-montserrat font-bold text-[14px] tracking-[0.2px] border border-[#23A6F0] rounded-[37px]"
                    >
                        <ArrowIcon className="w-3.5 h-[14px] rotate-180" />
                        <span className='p-0'>Вернуться</span>
                    </button>
                </form>
            )}
        </div>
    );
}