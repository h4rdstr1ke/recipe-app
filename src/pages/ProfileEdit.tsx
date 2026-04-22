import avatar from '../assets/defaultAvatar.svg';
import ArrowIcon from '../assets/icons/arrow.svg?react';
import { useState, useEffect } from 'react';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Страница редактирования личного профиля.
 * Позволяет изменить базовую информацию (имя, никнейм, био) и пищевые предпочтения (аллергены, нежелательное).
 */
export default function ProfileEdit() {
    // ---------------------------------------------------------
    // 1. ИНИЦИАЛИЗАЦИЯ И ГЛОБАЛЬНЫЕ СТОРЫ
    // ---------------------------------------------------------
    const navigate = useNavigate();

    // Стор настроек (для аллергенов и нежелательных продуктов)
    const { settings, fetchSettings, updateSettings } = useUserSettingsStore();

    // Стор авторизации (для имени, никнейма, био)
    const { user, updateProfile } = useAuthStore();

    // ---------------------------------------------------------
    // 2. ЛОКАЛЬНЫЙ СТЕЙТ ФОРМЫ
    // Мы копируем данные из стора сюда, чтобы пользователь мог 
    // редактировать текст, не изменяя глобальные данные до нажатия "Сохранить".
    // ---------------------------------------------------------
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [nickname, setNickName] = useState('');
    const [allergens, setAllergens] = useState<string[]>([]);
    const [unwanted, setUnwanted] = useState<string[]>([]);

    // ---------------------------------------------------------
    // 3. ЭФФЕКТЫ (Синхронизация Стор -> Локальный стейт)
    // ---------------------------------------------------------

    // При первом рендере просим стор настроек подтянуть актуальные данные
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Как только данные юзера загрузились, подставляем их в инпуты
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setNickName(user.nickname);
        }
    }, [user]);

    // Как только настройки юзера загрузились, отмечаем нужные чекбоксы
    useEffect(() => {
        if (settings) {
            setAllergens(settings.allergens);
            setUnwanted(settings.unwanted);
        }
    }, [settings]);

    // ---------------------------------------------------------
    // 4. ОБРАБОТЧИКИ СОБЫТИЙ (Handlers)
    // ---------------------------------------------------------

    /**
     * Обработчик отправки формы.
     * Собирает все локальные стейты и пушит их обратно в глобальные сторы/на бэкенд.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Сохраняем базовые данные в стор авторизации
        updateProfile({ name, bio, nickname });

        // 2. Сохраняем пищевые предпочтения в стор настроек
        if (settings) {
            await updateSettings({ ...settings, allergens, unwanted });
        }

        // 3. Возвращаем пользователя на страницу его профиля
        navigate('/profile');
    };

    /**
     * Универсальный переключатель для массивов строк (чекбоксов).
     * Если элемент есть в массиве — удаляет его, если нет — добавляет.
     */
    const handleCheckboxChange = (value: string, list: string[], setList: (list: string[]) => void) => {
        if (list.includes(value)) {
            setList(list.filter(item => item !== value));
        } else {
            setList([...list, value]);
        }
    };

    // ---------------------------------------------------------
    // 5. РЕНДЕР UI
    // ---------------------------------------------------------

    return (
        <div className='flex w-[100%] justify-center pb-20'>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <div className="flex w-[640px] h-[60px] mt-[34px] mb-[34px] px-[20px] items-center justify-between rounded-[20px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]">
                    <div className='flex items-center gap-4 '>
                        <img src={user?.avatarUrl || avatar} className='w-[50px] rounded-full' alt="avatar" />
                        <span className='font-montserrat text-[36px] tracking-[0.2px] leading-7'>{user?.nickname || 'vlad228'}</span>
                    </div>
                    <button type="button" className='w-[130px] h-[30px] flex items-center justify-center rounded-[5px] bg-[#23A6F0] hover:bg-[#1E90D6] transition-colors'>
                        <span className='font-montserrat text-[14px] font-bold text-[#FFFFFF] tracking-[0.2px] leading-7'>Новое фото</span>
                    </button>
                </div>
                <div className="flex flex-col w-[960px] gap-2">

                    <label className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold flex gap-1'>
                        Поменять никнейм <span className="text-[#E0232E] font-bold">*</span>
                    </label>
                    <input
                        value={nickname}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder='Например: Иван'
                        className='py-[10px] px-[20px] leading-6 focus:outline-none font-montserrat tracking-[0.2px] placeholder:text-[14px] placeholder:text-[#737373] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]'
                    />

                    <label className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold flex gap-1'>
                        Введите свое имя <span className="text-[#E0232E] font-bold">*</span>
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder='Например: Иван'
                        className='py-[10px] px-[20px] leading-6 focus:outline-none font-montserrat tracking-[0.2px] placeholder:text-[14px] placeholder:text-[#737373] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]'
                    />

                    <label className='font-montserrat mt-4 text-[20px] tracking-[0.2px] leading-6 font-semibold'>
                        Придумайте описание профиля
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder='Например: люблю готовить рыбу!'
                        className='h-[83px] py-[10px] px-[20px] font-montserrat leading-6 tracking-[0.2px] placeholder:text-[14px] placeholder:text-[#737373] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] focus:outline-none resize-none'
                    />

                    <span className='font-montserrat mt-4 text-[20px] tracking-[0.2px] leading-6 font-semibold'>Аллергены</span>
                    <details className="mt-1 group">
                        <summary className="py-[10px] px-[20px] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] cursor-pointer font-montserrat leading-6 tracking-[0.2px] text-[14px] text-[#737373] list-none flex justify-between items-center select-none">
                            Введите продукты, на которые у Вас аллергия
                            <ArrowIcon className={`w-[14px] transition-transform group-open:rotate-180`} />
                        </summary>
                        <div className="mt-2 p-3 border-[1px] border-[#E6E6E6] rounded-[5px] bg-white grid grid-cols-2 gap-2">
                            {['Молоко', 'Яйца', 'Орехи', 'Глютен', 'Морепродукты', 'Соя'].map(item => (
                                <label key={item} className="flex items-center gap-2 py-1 cursor-pointer font-montserrat">
                                    <input
                                        type="checkbox"
                                        checked={allergens.includes(item)}
                                        onChange={() => handleCheckboxChange(item, allergens, setAllergens)}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    {item}
                                </label>
                            ))}
                        </div>
                    </details>

                    <span className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold mt-4'>Нежелательные продукты</span>
                    <details className="mt-1 group">
                        <summary className="py-[10px] px-[20px] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] cursor-pointer font-montserrat leading-6 tracking-[0.2px] text-[14px] text-[#737373] list-none flex justify-between items-center select-none">
                            Введите продукты, которые Вам не нравятся
                            <ArrowIcon className={`w-[14px] transition-transform group-open:rotate-180`} />
                        </summary>
                        <div className="mt-2 p-3 border-[1px] border-[#E6E6E6] rounded-[5px] bg-white grid grid-cols-2 gap-2">
                            {['Мясо', 'Сахар', 'Грибы', 'Жирное', 'Острое', 'Жареное'].map(item => (
                                <label key={item} className="flex items-center gap-2 py-1 cursor-pointer font-montserrat">
                                    <input
                                        type="checkbox"
                                        checked={unwanted.includes(item)}
                                        onChange={() => handleCheckboxChange(item, unwanted, setUnwanted)}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    {item}
                                </label>
                            ))}
                        </div>
                    </details>
                </div>

                {/* Кнопка сохранения */}
                <div className='flex w-[100%] justify-end'>
                    <button type="submit" className='w-[175px] h-[40px] mt-[30px] bg-[#23A6F0] hover:bg-[#1E90D6] transition-colors rounded-[5px]'>
                        <span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>Сохранить</span>
                    </button>
                </div>
            </form>
        </div>
    )
}