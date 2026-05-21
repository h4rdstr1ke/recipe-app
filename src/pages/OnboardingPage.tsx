import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { api } from '../api/api';
import Arrow from "../assets/icons/arrow.svg?react";
import avatarDefault from '../assets/defaultAvatar.svg';

export default function OnboardingPage() {
    const { user, updateProfile } = useAuthStore();
    const { updateAllergens, updateUnwanted } = useUserSettingsStore();
    const navigate = useNavigate();

    // Текущий шаг (1 — Имя, 2 — Фото/Био, 3 — Предпочтения)
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    // Стейты данных
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [allergens, setAllergens] = useState<{ id: string, title: string }[]>([]);
    const [unwanted, setUnwanted] = useState<{ id: string, title: string }[]>([]);

    // Технические стейты
    const [dbIngredients, setDbIngredients] = useState<{ id: string, title: string }[]>([]);
    const [allergenInput, setAllergenInput] = useState('');
    const [unwantedInput, setUnwantedInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.name) setName(user.name);
        api.get('/api/ingredients').then(res => setDbIngredients(res.data)).catch(console.error);
    }, [user]);

    const handleNext = () => {
        if (step === 1 && !name.trim()) return; // Валидация имени на 1 шаге
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => { if (step > 1) setStep(step - 1); };

    const finishOnboarding = async () => {
        setIsSaving(true);
        try {
            // Сохраняем всё разом в конце
            await updateProfile({ name: name.trim(), bio: bio.trim(), avatarFile });
            if (allergens.length > 0) await updateAllergens(allergens);
            if (unwanted.length > 0) await updateUnwanted(unwanted);
            navigate('/');
        } finally {
            setIsSaving(false);
        }
    };

    // ДИНАМИЧЕСКИЕ ПРОВЕРКИ 
    const hasStep2Data = bio.trim() !== '' || avatarFile !== null;
    const hasStep3Data = allergens.length > 0 || unwanted.length > 0;

    return (
        <div className="min-h-[100vh] flex items-center justify-center bg-[#F9F9F9] px-4">
            <div className="max-w-[450px] w-full bg-white rounded-[20px] shadow-sm p-8 flex flex-col gap-8 transition-all duration-500">

                {/* ИНДИКАТОР ПРОГРЕССА */}
                <div className="w-full flex flex-col gap-2">
                    <div className="flex justify-between text-[12px] font-montserrat font-bold text-[#23A6F0]">
                        <span>ШАГ {step} ИЗ {totalSteps}</span>
                        <span>{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E6E6E6] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#23A6F0] transition-all duration-500 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* ШАГ 1: ИМЯ (ОБЯЗАТЕЛЬНО) */}
                {step === 1 && (
                    <div className="animate-fadeIn flex flex-col gap-6">
                        <div className="text-center">
                            <h1 className="text-[30px] font-bold font-montserrat text-[#252B42] tracking-[0.2px]">Как вас зовут?</h1>
                            <p className="text-[#737373] text-[14px] mt-2 tracking-[0.2px] font-montserrat font-light">Это имя будут видеть другие пользователи.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className='flex gap-1'>
                                <span className="text-[18px] font-bold font-montserrat tracking-[0.2px]">Ваше имя</span>
                                <span className='text-red-600 text-[18px]'>*</span>
                            </div>
                            <input
                                className='bg-[#F9F9F9] border border-[#E6E6E6] rounded-[5px] p-3 text-[16px] font-montserrat outline-none focus:border-[#23A6F0] transition-colors'
                                placeholder="Например: Александр"
                                value={name}
                                onChange={(e: any) => setName(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={!name.trim()}
                            onClick={handleNext}
                            className="flex text-[18px] font-montserrat tracking-[0.2px] justify-center items-center w-full h-[50px] bg-[#23A6F0] text-white font-bold rounded-[5px] disabled:opacity-50 transition-all active:scale-95"
                        >
                            Далее
                        </button>
                    </div>
                )}

                {/* ШАГ 2: ПРОФИЛЬ (ОПЦИОНАЛЬНО) */}
                {step === 2 && (
                    <div className="animate-fadeIn flex flex-col gap-6">
                        <div className="text-center">
                            <h1 className="text-[30px] font-bold font-montserrat text-[#252B42] tracking-[0.2px]">Немного о себе</h1>
                            <p className="text-[#737373] text-[14px] mt-2 tracking-[0.2px] font-montserrat font-light">Загрузите фото и добавьте краткое описание.</p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <img src={avatarPreview || avatarDefault} className="w-[110px] h-[110px] object-cover rounded-full border-2 border-[#E6E6E6]" alt="avatar" />
                                <div className="absolute bottom-0 right-0 bg-[#23A6F0] text-white p-1.5 rounded-full border-2 border-white">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
                            }} />
                        </div>

                        <div className="flex flex-col gap-2 text-left">
                            <span className="text-[18px] font-bold font-montserrat tracking-[0.2px] text-left">Описание профиля</span>
                            <textarea
                                placeholder="Расскажите о своих кулинарных талантах..."
                                className="w-full h-[100px] bg-[#F9F9F9] border border-[#E6E6E6] rounded-[5px] p-3 text-[16px] font-montserrat outline-none focus:border-[#23A6F0] transition-colors"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Динамическая кнопка пропуска */}
                            <button onClick={handleNext} className="flex text-[18px] font-montserrat tracking-[0.2px] justify-center items-center w-full h-[50px] bg-[#23A6F0] text-white font-bold rounded-[5px] disabled:opacity-50 transition-all active:scale-95">
                                {hasStep2Data ? 'Продолжить' : 'Пропустить этот шаг'}
                            </button>
                            <div onClick={handleBack} className='flex items-center justify-center gap-2 text-[#737373] cursor-pointer'>
                                <Arrow className='rotate-180 h-[14px]' />
                                <span className="text-[#737373] font-montserrat leading-7 text-[16px] tracking-[0.2px] font-medium py-2">Назад</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ШАГ 3: ФИЛЬТРЫ ПРОДУКТОВ */}
                {step === 3 && (
                    <div className="animate-fadeIn flex flex-col gap-6">
                        <div className="text-center">
                            <h1 className="text-[30px] font-bold font-montserrat text-[#252B42] tracking-[0.2px]">Ваше здоровье</h1>
                            <p className="text-[#737373] text-[14px] tracking-[0.2px] font-montserrat font-light mt-2">Отметьте продукты, которые вам нельзя или вы не любите.</p>
                        </div>

                        {/* АЛЛЕРГЕНЫ */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-montserrat tracking-[0.2px] font-bold text-[#E0232E]">Аллергия на:</span>
                            <div className="flex flex-wrap gap-2 mb-1">
                                {allergens.map(a => (
                                    <span key={a.id} className="bg-[#FFDEDE] text-[#E0232E] border-[1px] border-red-600 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                                        {a.title} <button onClick={() => setAllergens(prev => prev.filter(x => x.id !== a.id))}>✕</button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <input className='w-[100%] bg-[#F9F9F9] border border-[#E6E6E6] rounded-[5px] p-3 text-[16px] font-montserrat outline-none focus:border-[#23A6F0] transition-colors' placeholder="молоко, орехи..." value={allergenInput} onChange={(e: any) => setAllergenInput(e.target.value)} />
                                {allergenInput && (
                                    <div className="absolute z-10 w-full bg-white border border-[#E6E6E6] rounded-md shadow-lg max-h-[120px] overflow-auto mt-1">
                                        {dbIngredients.filter(i => i.title.toLowerCase().includes(allergenInput.toLowerCase()) && !allergens.some(x => x.id === i.id)).map(i => (
                                            <div key={i.id} className="p-2 hover:bg-[#F9F9F9] cursor-pointer text-[13px]" onClick={() => { setAllergens([...allergens, i]); setAllergenInput(''); }}>{i.title}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* НЕЖЕЛАТЕЛЬНЫЕ */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-montserrat tracking-[0.2px] font-bold text-[#E77C40]">Просто не люблю:</span>
                            <div className="flex flex-wrap gap-2 mb-1">
                                {unwanted.map(u => (
                                    <span key={u.id} className="bg-[#FFF6EF] text-[#E77C40] border-[1px] border-orange-600 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
                                        {u.title} <button onClick={() => setUnwanted(prev => prev.filter(x => x.id !== u.id))}>✕</button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <input className="w-[100%] bg-[#F9F9F9] border border-[#E6E6E6] rounded-[5px] p-3 text-[16px] font-montserrat outline-none focus:border-[#23A6F0] transition-colors" placeholder="лук, кинза..." value={unwantedInput} onChange={(e: any) => setUnwantedInput(e.target.value)} />
                                {unwantedInput && (
                                    <div className="absolute z-10 w-full bg-white border border-[#E6E6E6] rounded-md shadow-lg max-h-[120px] overflow-auto mt-1">
                                        {dbIngredients.filter(i => i.title.toLowerCase().includes(unwantedInput.toLowerCase()) && !unwanted.some(x => x.id === i.id)).map(i => (
                                            <div key={i.id} className="p-2 hover:bg-[#F9F9F9] cursor-pointer text-[13px]" onClick={() => { setUnwanted([...unwanted, i]); setUnwantedInput(''); }}>{i.title}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            {/* Динамическая финальная кнопка */}
                            <button
                                onClick={finishOnboarding}
                                disabled={isSaving}
                                className="flex text-[18px] font-montserrat tracking-[0.2px] justify-center items-center w-full h-[50px] bg-[#23A6F0] text-white font-bold rounded-[5px] disabled:opacity-50 transition-all active:scale-95"
                            >
                                {isSaving ? 'Сохранение...' : (hasStep3Data ? 'Завершить настройку' : 'Пропустить и завершить')}
                            </button>
                            <div onClick={handleBack} className='flex items-center justify-center gap-2 text-[#737373] cursor-pointer'>
                                <Arrow className='rotate-180 h-[14px]' />
                                <span className="text-[#737373] font-montserrat leading-7 text-[16px] tracking-[0.2px] font-medium py-2">Назад</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>
        </div>
    );
}