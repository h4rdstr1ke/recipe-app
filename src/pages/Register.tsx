import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ArrowIcon from '../assets/icons/arrow.svg?react';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);

    const { sendVerificationCode, verifyCode, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    // Таймер
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

    // Валидация формы
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nickname) {
            newErrors.nickname = 'Никнейм обязателен';
        } else if (formData.nickname.length < 3) {
            newErrors.nickname = 'Никнейм должен быть не менее 3 символов';
        }

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Отправка кода
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        const success = await sendVerificationCode(
            formData.email,
            formData.nickname,
            formData.password
        );

        if (success) {
            setShowCodeInput(true);
            setTimer(60);
            setCanResend(false);
        }
    };

    // Повторная отправка кода
    const handleResendCode = async () => {
        if (!canResend) return;

        const success = await sendVerificationCode(
            formData.email,
            formData.nickname,
            formData.password
        );

        if (success) {
            setTimer(60);
            setCanResend(false);
        }
    };

    // Подтверждение кода
    const handleConfirmCode = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!code || code.length < 4) {
            alert('Введите код из письма');
            return;
        }

        const success = await verifyCode(code);
        if (success) {
            navigate('/');
        }
    };

    // Обновление полей
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Общий стиль для инпутов
    const inputClassName = (hasError: boolean) => `
    w-[100%] h-[50px] px-[15px] mt-2 border rounded-[5px] 
    bg-[#F9F9F9] placeholder:text-[#737373] 
    font-normal placeholder:font-normal focus:outline-none
    ${hasError ? 'border-[#E0232E]' : 'border-[#DDDDDD]'}
  `;

    return (
        <div className="flex items-center justify-center flex-col h-[100vh] gap-5">
            <h1 className="text-[#252B42] font-montserrat font-bold text-[24px] tracking-[0.1px]">
                Регистрация
            </h1>

            {!showCodeInput ? (
                // Форма регистрации
                <form onSubmit={handleSendCode} className="max-w-[250px] w-[100%] flex items-center justify-center flex-col gap-2 text-[#252B42] font-montserrat font-semibold text-[14px] tracking-[0.2px]">
                    {error && (
                        <div className="w-full bg-red-50 border border-[#E0232E] text-[#E0232E] px-4 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className='w-[100%]'>
                        <div className="flex gap-1">
                            <h2>Никнейм</h2>
                            <span className="text-[#E0232E]">*</span>
                        </div>
                        <input
                            type="text"
                            name="nickname"
                            placeholder="Придумайте никнейм"
                            value={formData.nickname}
                            onChange={handleInputChange}
                            className={inputClassName(!!errors.nickname)}
                        />
                        {errors.nickname && <p className="text-[#E0232E] text-xs mt-1">{errors.nickname}</p>}
                    </div>

                    <div className='w-[100%]'>
                        <div className="flex gap-1">
                            <h2>Email</h2>
                            <span className="text-[#E0232E]">*</span>
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={inputClassName(!!errors.email)}
                        />
                        {errors.email && <p className="text-[#E0232E] text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className='w-[100%]'>
                        <div className="flex gap-1">
                            <h2>Пароль</h2>
                            <span className="text-[#E0232E]">*</span>
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Придумайте пароль"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={inputClassName(!!errors.password)}
                        />
                        {errors.password && <p className="text-[#E0232E] text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div className='w-[100%]'>
                        <div className="flex gap-1">
                            <h2>Повторите пароль</h2>
                            <span className="text-[#E0232E]">*</span>
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={inputClassName(!!errors.confirmPassword)}
                        />
                        {errors.confirmPassword && <p className="text-[#E0232E] text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[100%] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px] hover:opacity-90 disabled:opacity-70"
                    >
                        {isLoading ? 'Отправка...' : 'Выслать код на почту'}
                    </button>

                    <Link to="/login">
                        <p className="underline font-montserrat font-normal text-[#737373] text-[12px] tracking-[0.2px] hover:text-[#23A6F0]">
                            Уже есть аккаунт?
                        </p>
                    </Link>
                </form>

            ) : (
                // Форма ввода кода
                <form onSubmit={handleConfirmCode} className="max-w-[350px] flex items-center justify-center flex-col gap-2">
                    {error && (
                        <div className="w-full bg-red-50 border border-[#E0232E] text-[#E0232E] px-4 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='font-montserrat font-semibold text-[14px] text-[#252B42] tracking-[0.2px]'>
                            Код из письма
                        </h2>
                        <input
                            type="text"
                            placeholder='******'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-[70%] h-[50px] px-[15px] mt-2 border border-[#DDDDDD] rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none text-center text-xl"
                        />
                        <p className="text-xs text-[#737373] mt-2">
                            Код отправлен на {formData.email}
                        </p>
                        <p className="text-xs text-[#23A6F0] mt-1">
                            Для теста используйте код: 123456
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={!canResend}
                        className={`font-montserrat text-[12px] tracking-[0.2px] ${canResend
                            ? 'text-[#23A6F0] hover:text-[#1a7fb3] cursor-pointer'
                            : 'text-[#737373] cursor-not-allowed'
                            }`}
                    >
                        {canResend
                            ? 'Отправить код еще раз'
                            : (
                                <>Запросить код повторно можно через <span className='font-semibold'>{timer} секунд</span></>
                            )
                        }
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[100%] max-w-[250px] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px] hover:opacity-90 disabled:opacity-70"
                    >
                        {isLoading ? 'Проверка...' : 'Подтвердить'}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowCodeInput(false);
                            clearError();
                        }}
                        className="flex justify-center items-center gap-2 w-[143px] h-[28px] mt-2 text-[#23A6F0] font-montserrat font-bold text-[14px] tracking-[0.2px] border border-[#23A6F0] rounded-[37px] hover:bg-[#23A6F0] hover:text-white transition-colors"
                    >
                        <ArrowIcon className="w-3.5 h-[14px] rotate-180" />
                        <span className='p-0'>Вернуться</span>
                    </button>
                </form>
            )}
        </div>
    );
}