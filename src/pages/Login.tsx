import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const { login, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validate()) return;

        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center flex-col h-[100vh] gap-5">
            <h1 className="text-[#252B42] font-montserrat font-bold text-[24px] tracking-[0.1px]">
                Войти
            </h1>

            <form onSubmit={handleSubmit} className="max-w-[250px] flex items-center justify-center flex-col gap-2 text-[#252B42] font-montserrat font-semibold text-[14px] tracking-[0.2px]">
                {error && (
                    <div className="w-full bg-red-50 border border-[#E0232E] text-[#E0232E] px-4 py-2 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className='w-[100%]'>
                    <div className="flex gap-1">
                        <h2>Email</h2>
                        <span className="text-[#E0232E]">*</span>
                    </div>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-[100%] h-[50px] px-[15px] mt-2 border rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none ${errors.email ? 'border-[#E0232E]' : 'border-[#DDDDDD]'
                            }`}
                    />
                    {errors.email && (
                        <p className="text-[#E0232E] text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                <div className='w-[100%]'>
                    <div className="flex gap-1">
                        <h2>Пароль</h2>
                        <span className="text-[#E0232E]">*</span>
                    </div>
                    <input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-[100%] h-[50px] px-[15px] mt-2 border rounded-[5px] bg-[#F9F9F9] placeholder:text-[#737373] font-normal placeholder:font-normal focus:outline-none ${errors.password ? 'border-[#E0232E]' : 'border-[#DDDDDD]'
                            }`}
                    />
                    {errors.password && (
                        <p className="text-[#E0232E] text-xs mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-[100%] h-[50px] mt-5 bg-[#23A6F0] font-montserrat font-bold text-[#FFFFFF] text-[14px] tracking-[0.2px] rounded-[5px] hover:opacity-90 disabled:opacity-70"
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>

                <Link to="/register">
                    <p className="underline font-montserrat font-normal text-[#737373] text-[12px] tracking-[0.2px] hover:text-[#23A6F0]">
                        Еще нет аккаунта? Зарегистрируйся!
                    </p>
                </Link>
            </form>
        </div>
    );
}