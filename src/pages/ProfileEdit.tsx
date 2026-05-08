import avatar from '../assets/defaultAvatar.svg';
import { useState, useEffect, useRef } from 'react';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

/**
 * Страница редактирования личного профиля.
 * Позволяет изменить базовую информацию (имя, никнейм, био) и пищевые предпочтения (аллергены, нежелательное).
 */
export default function ProfileEdit() {
    const navigate = useNavigate();

    // Достаем из стора новые методы сохранения
    const { settings, fetchSettings, updateAllergens, updateUnwanted } = useUserSettingsStore();
    const { user, updateProfile } = useAuthStore();

    // Базовые данные
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [nickname, setNickName] = useState('');
    const { currentProfile, fetchProfile } = useProfileStore();
    // Стейты аллергенов
    const [allergenQuery, setAllergenQuery] = useState('');
    const [allergenResults, setAllergenResults] = useState<{ id: string, title: string }[]>([]);
    const [selectedAllergens, setSelectedAllergens] = useState<{ id: string, title: string }[]>([]);

    // Стейты нежелательных
    const [unwantedQuery, setUnwantedQuery] = useState('');
    const [unwantedResults, setUnwantedResults] = useState<{ id: string, title: string }[]>([]);
    const [selectedUnwanted, setSelectedUnwanted] = useState<{ id: string, title: string }[]>([]);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // Реф для скрытого инпута

    // При первом рендере подтягиваем настройки И свежие данные профиля
    useEffect(() => {
        fetchSettings();
        if (user?.id) {
            fetchProfile(user.id); // Запрашиваем профиль с бэкенда
        }
    }, [fetchSettings, fetchProfile, user?.id]);

    // Подставляем данные (в приоритете - свежие данные с сервера)
    // Обновляем логику подстановки данных, чтобы аватарка тоже подхватывалась
    useEffect(() => {
        if (currentProfile) {
            setName(currentProfile.name || '');
            setBio(currentProfile.bio || '');
            setNickName(currentProfile.nickname || '');
            setPreviewUrl(currentProfile.avatarUrl || null); // Подставляем текущую аватарку
        } else if (user) {
            setName(user.name || '');
            setBio(user.bio || '');
            setNickName(user.nickname);
            setPreviewUrl(user.avatarUrl || null);
        }
    }, [currentProfile, user]);

    // Обработчик выбора файла
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAvatarFile(file);

            // Создаем временный URL для предпросмотра картинки ДО отправки на сервер
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    // Подставляем уже выбранные аллергены из настроек
    useEffect(() => {
        if (settings) {
            // Мапим текущие строки/объекты в формат {id, title} для чипсов
            const mapToChip = (item: any) => typeof item === 'string' ? { id: item, title: item } : { id: item.id || item.title, title: item.title || item.name };

            if (settings.allergens) setSelectedAllergens(settings.allergens.map(mapToChip));
            if (settings.unwanted) setSelectedUnwanted(settings.unwanted.map(mapToChip));
        }
    }, [settings]);

    // Поиск аллергенов (с дебаунсом)
    useEffect(() => {
        const searchIngredients = async () => {
            if (allergenQuery.length < 2) {
                setAllergenResults([]);
                return;
            }
            try {
                const response = await api.get('/api/ingredients/search', {
                    params: { title: allergenQuery }
                });
                setAllergenResults(response.data);
            } catch (e) {
                console.error(e);
            }
        };

        const timer = setTimeout(searchIngredients, 300);
        return () => clearTimeout(timer);
    }, [allergenQuery]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Поиск нежелательных продуктов (с дебаунсом)
    useEffect(() => {
        const searchUnwanted = async () => {
            if (unwantedQuery.length < 2) {
                setUnwantedResults([]);
                return;
            }
            try {
                const response = await api.get('/api/ingredients/search', {
                    params: { title: unwantedQuery }
                });
                setUnwantedResults(response.data);
            } catch (e) {
                console.error(e);
            }
        };

        const timer = setTimeout(searchUnwanted, 300);
        return () => clearTimeout(timer);
    }, [unwantedQuery]);

    // Отправка формы
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Передаем аватарку вместе с остальными данными
        await updateProfile({ name, bio, nickname, avatarFile });

        if (updateAllergens) await updateAllergens(selectedAllergens);
        if (updateUnwanted) await updateUnwanted(selectedUnwanted);

        navigate('/profile')
    };

    return (
        <div className='flex w-[100%] justify-center pb-20'>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <div className="flex md:w-[640px] h-[60px] mt-[34px] mb-[34px] px-[20px] items-center justify-between rounded-[20px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]">
                    <div className='flex items-center gap-4 '>
                        {/* Показываем превью или дефолтную аватарку */}
                        <img src={previewUrl || avatar} className='w-[50px] h-[50px] object-cover rounded-full' alt="avatar" />
                        <span className='font-montserrat text-[36px] tracking-[0.2px] leading-7'>{nickname || 'vlad228'}</span>
                    </div>

                    {/* КНОПКА ЗАГРУЗКИ ФОТО */}
                    <div>
                        {/* Скрытый инпут */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {/* Твоя красивая кнопка, которая кликает по скрытому инпуту */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className='w-[130px] h-[30px] flex items-center justify-center rounded-[5px] bg-[#23A6F0] hover:bg-[#1E90D6] transition-colors'
                        >
                            <span className='font-montserrat text-[14px] font-bold text-[#FFFFFF] tracking-[0.2px] leading-7'>Новое фото</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:w-[960px] gap-2">
                    <label className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold flex gap-1'>
                        Поменять никнейм <span className="text-[#E0232E] font-bold">*</span>
                    </label>
                    <input
                        value={nickname}
                        onChange={(e) => setNickName(e.target.value)} // ИСПРАВЛЕНО ЗДЕСЬ
                        required
                        placeholder='Например: ivan_cook'
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

                    {/* АЛЛЕРГЕНЫ */}
                    <span className='font-montserrat mt-4 text-[20px] tracking-[0.2px] leading-6 font-semibold'>Аллергены</span>
                    <div className="flex flex-col gap-2 mt-1">
                        <div className="relative">
                            <input
                                value={allergenQuery}
                                onChange={(e) => setAllergenQuery(e.target.value)}
                                placeholder='Начните вводить название (например: Молоко)'
                                className='w-full py-[10px] px-[20px] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] font-montserrat focus:outline-none'
                            />

                            {allergenResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#E6E6E6] rounded-[5px] shadow-lg max-h-[200px] overflow-y-auto">
                                    {allergenResults.map(ing => (
                                        <div
                                            key={ing.id}
                                            onClick={() => {
                                                if (!selectedAllergens.find(a => a.id === ing.id)) {
                                                    setSelectedAllergens([...selectedAllergens, ing]);
                                                }
                                                setAllergenQuery('');
                                                setAllergenResults([]);
                                            }}
                                            className="px-4 py-2 hover:bg-[#F0F8FF] cursor-pointer font-montserrat text-[14px]"
                                        >
                                            {ing.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedAllergens.map(ing => (
                                <div key={ing.id} className="flex items-center gap-2 px-3 py-1 bg-[#FFDEDE] border border-[#DF1E1E] rounded-full">
                                    <span className="text-[#E0232E] font-montserrat text-[14px] font-medium">{ing.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedAllergens(selectedAllergens.filter(a => a.id !== ing.id))}
                                        className="text-[#E0232E] font-bold hover:scale-110"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* НЕЖЕЛАТЕЛЬНЫЕ ПРОДУКТЫ */}
                    <span className='font-montserrat text-[20px] tracking-[0.2px] leading-6 font-semibold mt-4'>Нежелательные продукты</span>
                    <div className="flex flex-col gap-2 mt-1">
                        <div className="relative">
                            <input
                                value={unwantedQuery}
                                onChange={(e) => setUnwantedQuery(e.target.value)}
                                placeholder='Начните вводить название (например: Изюм)'
                                className='w-full py-[10px] px-[20px] rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] font-montserrat focus:outline-none'
                            />

                            {unwantedResults.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-[#E6E6E6] rounded-[5px] shadow-lg max-h-[200px] overflow-y-auto">
                                    {unwantedResults.map(ing => (
                                        <div
                                            key={ing.id}
                                            onClick={() => {
                                                if (!selectedUnwanted.find(u => u.id === ing.id)) {
                                                    setSelectedUnwanted([...selectedUnwanted, ing]);
                                                }
                                                setUnwantedQuery('');
                                                setUnwantedResults([]);
                                            }}
                                            className="px-4 py-2 hover:bg-[#F0F8FF] cursor-pointer font-montserrat text-[14px]"
                                        >
                                            {ing.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedUnwanted.map(ing => (
                                <div key={ing.id} className="flex items-center gap-2 px-3 py-1 bg-[#EBEBEB] border border-[#CCCCCC] rounded-full">
                                    <span className="text-[#555555] font-montserrat text-[14px] font-medium">{ing.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUnwanted(selectedUnwanted.filter(u => u.id !== ing.id))}
                                        className="text-[#555555] font-bold hover:scale-110"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

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