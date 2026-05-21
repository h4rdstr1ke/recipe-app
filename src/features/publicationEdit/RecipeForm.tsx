import { useState, useRef, useEffect } from "react";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Delete from "../../assets/icons/delete.svg?react";
import AiStar from "../../assets/icons/aiStar.svg?react";
import PublicationAdd from "../../assets/icons/imageAdd.svg?react";
import { api } from "../../api/api";
import { aiApi } from "../../api/aiApi";

const MEAL_TYPES = ['Завтрак', 'Обед', 'Полдник', 'Ужин', 'Перекус'];
const DISH_TYPES = ['Первые блюда', 'Вторые блюда', 'Салаты', 'Закуски', 'Выпечка', 'Соусы и маринады', 'Заготовки', 'Десерты', 'Напитки', 'Гарниры'];
const UNIT_TYPES = ['г', 'кг', 'мл', 'л', 'шт', 'ст.л', 'ч.л', 'стакан'];

interface RecipeFormProps {
    initialData?: any;
    onSubmit: (data: { recipeFormData: FormData; steps: any[]; deletedStepIds: string[] }) => Promise<void>;
    onDelete?: () => void;
    isLoading: boolean;
    isEdit?: boolean;
}

export default function RecipeForm({ initialData, onSubmit, onDelete, isLoading, isEdit }: RecipeFormProps) {
    // 1. СТЕЙТЫ БАЗОВОЙ ИНФОРМАЦИИ
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [portions, setPortions] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const [selectedMeal, setSelectedMeal] = useState<string>('');
    const [selectedDish, setSelectedDish] = useState<string>('');

    // СТЕЙТ ДЛЯ ОТСЛЕЖИВАНИЯ ОШИБОК ВАЛИДАЦИИ
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 2. СТЕЙТЫ ОБЛОЖКИ
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 3. СТЕЙТЫ ИНГРЕДИЕНТОВ
    const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; amount: string; unit: string }>>([]);
    const [ingName, setIngName] = useState('');
    const [ingId, setIngId] = useState('');
    const [ingAmount, setIngAmount] = useState('');
    const [ingUnit, setIngUnit] = useState('г');
    const [dbIngredients, setDbIngredients] = useState<Array<{ id: string, title: string }>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 4. СТЕЙТЫ ШАГОВ
    const [steps, setSteps] = useState<Array<{
        id: string;
        description: string;
        imageFile: File | null;
        imagePreview: string | null;
        existingImageUrl: string | null;
        timerMinutes: string;
        isTimerVisible: boolean;
        isNew: boolean;
    }>>([]);

    const [deletedStepIds, setDeletedStepIds] = useState<string[]>([]);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    // СТЕЙТ ДЛЯ МГНОВЕННОГО ОТКЛИКА КНОПКИ ПРИ ОТПРАВКЕ
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Вспомогательная функция для снятия подсветки при вводе текста
    const clearError = (field: string) => {
        if (errors[field] || (field === 'steps' && errors.steps)) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ И ЗАГРУЗКА
    // ==========================================
    useEffect(() => {
        api.get('/api/ingredients').then(res => setDbIngredients(res.data)).catch(console.error);

        if (initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPortions(initialData.portions?.toString() || '');
            setSelectedMeal(initialData.mealType || '');
            setSelectedDish(initialData.dishType || '');

            if (initialData.timeCooking && initialData.timeCooking !== "Время не указано") {
                const parts = initialData.timeCooking.split(':');
                setHours(parseInt(parts[0] || '0', 10).toString());
                setMinutes(parseInt(parts[1] || '0', 10).toString());
            }

            if (initialData.products) {
                setIngredients(initialData.products.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    amount: p.quantity?.toString().replace(/[^\d.-]/g, '').trim() || '',
                    unit: p.weight?.toString().replace(/[\d.-]/g, '').trim() || 'г'
                })));
            }

            // Шаблон пустого шага при редактировании
            if (initialData.steps && initialData.steps.length > 0) {
                setSteps(initialData.steps.map((s: any) => ({
                    id: s.id,
                    description: s.description,
                    imageFile: null,
                    imagePreview: null,
                    existingImageUrl: s.image || null,
                    timerMinutes: s.timer ? (parseInt(s.timer.split(':')[0], 10) * 60 + parseInt(s.timer.split(':')[1], 10)).toString() : '',
                    isTimerVisible: !!s.timer,
                    isNew: false
                })));
            } else {
                setSteps([{ id: Date.now().toString(), description: '', imageFile: null, imagePreview: null, existingImageUrl: null, timerMinutes: '', isTimerVisible: false, isNew: true }]);
            }
        } else {
            setSteps([{ id: Date.now().toString(), description: '', imageFile: null, imagePreview: null, existingImageUrl: null, timerMinutes: '', isTimerVisible: false, isNew: true }]);
        }
    }, [initialData]);

    const filteredIngredients = dbIngredients.filter(ing =>
        ing.title.toLowerCase().includes(ingName.toLowerCase())
    );

    // ==========================================
    // ОБРАБОТЧИКИ
    // ==========================================
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
            clearError('cover');
        }
    };

    const handleGenerateDescription = async () => {
        if (!title.trim()) return alert("Сначала введите название рецепта, чтобы ИИ понял, о чем писать!");
        setIsGeneratingDesc(true);
        try {
            const res = await aiApi.post('/api/recipes/generate-description', {
                title,
                ingredients: ingredients.map(ing => ing.name),
                steps: steps.map(step => step.description).filter(desc => desc.trim() !== ''),
                tone: "аппетитно и дружелюбно"
            });
            if (res.data?.description) {
                setDescription(res.data.description);
                clearError('description');
            }
        } catch (error) {
            console.error("Ошибка при генерации описания:", error);
            alert("Не удалось сгенерировать описание. Проверьте сервер ИИ.");
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleAddIngredient = () => {
        if (!ingName.trim() || !ingId) return alert("Пожалуйста, выберите ингредиент из выпадающего списка!");
        setIngredients([...ingredients, { id: ingId, name: ingName, amount: ingAmount, unit: ingUnit }]);
        setIngName(''); setIngId(''); setIngAmount(''); setIngUnit(''); setIsDropdownOpen(false);
        clearError('ingredients');
    };

    const handleRemoveIngredient = (indexToRemove: number) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    };

    const handleAddStep = () => {
        setSteps([...steps, { id: Date.now().toString(), description: '', imageFile: null, imagePreview: null, existingImageUrl: null, timerMinutes: '', isTimerVisible: false, isNew: true }]);
    };

    const handleRemoveStep = (idToRemove: string) => {
        if (steps.length === 1) return;
        const stepToRemove = steps.find(s => s.id === idToRemove);
        if (stepToRemove && !stepToRemove.isNew) {
            setDeletedStepIds([...deletedStepIds, idToRemove]);
        }
        setSteps(steps.filter(step => step.id !== idToRemove));
    };

    // ФУНКЦИЯ ПРОВЕРКИ И ОТПРАВКИ ФОРМЫ С ПЛАВНЫМ СКРОЛЛОМ
    const handlePreSubmit = async () => {
        const newErrors: Record<string, string> = {};

        if (!coverImage && !initialData?.image && !initialData?.imageId) {
            newErrors.cover = "Загрузите обложку рецепта";
        }
        if (!portions) newErrors.portions = "Укажите количество";

        // Проверяем остальные поля
        if (!title.trim()) newErrors.title = "Укажите название";
        if (!description.trim()) newErrors.description = "Придумайте описание";
        if (!hours && !minutes) newErrors.time = "Укажите время приготовления";
        if (!selectedMeal) newErrors.meal = "Выберите тип";
        if (!selectedDish) newErrors.dish = "Выберите тип";
        if (ingredients.length === 0) newErrors.ingredients = "Добавьте хотя бы один ингредиент";

        // 2. Умная проверка шагов: оставляем только те, где есть хоть какая-то информация
        const validSteps = steps.filter(step =>
            step.description.trim() !== '' ||
            step.imageFile !== null ||
            step.existingImageUrl !== null ||
            step.timerMinutes !== ''
        );

        const stepErrors: number[] = [];
        validSteps.forEach((step) => {
            // Если в непустом шаге нет описания — это ошибка
            if (!step.description.trim()) {
                const origIndex = steps.findIndex(s => s.id === step.id);
                stepErrors.push(origIndex);
            }
        });
        if (stepErrors.length > 0) newErrors.steps = stepErrors.join(',');

        // Если найдены ошибки — скроллим к первой из них
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Порядок скролла сверху вниз
            const errorOrder = ['cover', 'title', 'description', 'portions', 'time', 'meal', 'dish', 'ingredients', 'steps'];
            const firstError = errorOrder.find(key => newErrors[key]);

            let elementId = '';
            if (firstError === 'cover') elementId = 'field-cover';
            else if (firstError === 'title') elementId = 'field-title';
            else if (firstError === 'description') elementId = 'field-description';
            else if (firstError === 'portions') elementId = 'field-portions';
            else if (firstError === 'time') elementId = 'field-time';
            else if (firstError === 'meal' || firstError === 'dish') elementId = 'field-type';
            else if (firstError === 'ingredients') elementId = 'field-ingredients';
            else if (firstError === 'steps') elementId = `field-step-${stepErrors[0]}`;

            if (elementId) {
                const el = document.getElementById(elementId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            return;
        }

        // Если всё окей - очищаем стейт ошибок
        setErrors({});

        const h = (hours || '0').padStart(2, '0');
        const m = (minutes || '0').padStart(2, '0');

        const ingredientsJsonArray = ingredients.map(ing => ({
            IngredientId: ing.id,
            Weight: Number(ing.amount) || 0,
            AlternativeWeight: ing.unit
        }));

        const recipeFormData = new FormData();
        recipeFormData.append('Title', title);
        recipeFormData.append('Description', description);
        recipeFormData.append('CookingTime', `${h}:${m}:00`);
        recipeFormData.append('PortionsCount', portions);
        if (selectedDish) recipeFormData.append('DishType', selectedDish);
        if (selectedMeal) recipeFormData.append('MealType', selectedMeal);
        recipeFormData.append('IngredientsJson', JSON.stringify(ingredientsJsonArray));

        if (coverImage) {
            recipeFormData.append('Images', coverImage);
            if (isEdit && initialData?.imageId) {
                recipeFormData.append('ImageIdsToDelete', JSON.stringify([initialData.imageId]));
            }
        }

        // ИСПРАВЛЕНИЕ: Включаем локальный лоадер для мгновенного отклика
        setIsSubmitting(true);
        try {
            // 3. Отправляем на сервер только заполненные шаги (validSteps)
            await onSubmit({ recipeFormData, steps: validSteps, deletedStepIds });
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        } finally {
            // Отключаем локальный лоадер после выполнения родительской функции (включая ожидание ИИ)
            setIsSubmitting(false);
        }
    };

    const displayCover = coverImagePreview || initialData?.image;

    return (
        <div className="max-w-[638px] w-[100%] flex flex-col">
            {/* Кнопка удаления */}
            {isEdit && onDelete && (
                <div className="w-[100%] flex justify-end mb-[30px]">
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isLoading || isSubmitting}
                        className='font-montserrat font-bold text-[#FF0000] border-[2px] border-[#FF0000] w-[180px] h-[35px] text-[16px] rounded-[9px] hover:bg-red-50 disabled:opacity-50 transition-colors'
                    >
                        Удалить рецепт
                    </button>
                </div>
            )}

            {/* ---------------- БЛОК: ФОТО ---------------- */}
            <div id="field-cover" className={`flex flex-col h-[330px] items-center justify-center w-[100%] border-[2px] border-dashed rounded-[10px] py-[25px] overflow-hidden relative transition-colors duration-300 ${errors.cover ? 'border-[#E0232E] bg-[#FFF6F6]' : 'border-[#E6E6E6]'}`}>
                {displayCover ? (
                    <img src={displayCover} alt="Обложка рецепта" className="w-full h-[100%] object-cover rounded-[8px] absolute top-0 left-0 z-0" />
                ) : (
                    <div className="flex gap-3 z-10">
                        <PublicationAdd className="w-[105px] h-[102px] text-[#E6E6E6] rotate-[-10.52deg]" />
                        <PublicationAdd className="w-[74px] text-[#E6E6E6] rotate-[5.7deg] translate-y-6" />
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg, image/jpg" className="hidden" />

                <Button onClick={() => fileInputRef.current?.click()} className={`w-[350px] h-[55px] text-[20px] rounded-[9px] mt-[25px] z-10 relative bg-opacity-90 `}>
                    {displayCover ? 'Изменить обложку' : 'Загрузить обложку рецепта'}
                </Button>

                {!displayCover && !errors.cover && (
                    <div className="flex flex-col items-center mt-3 z-10">
                        <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Выберите изображение на вашем устройстве.</span>
                        <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Пожалуйста, используйте свои авторские фото.</span>
                        <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Допустимые форматы: JPEG, JPG, PNG.</span>
                    </div>
                )}

                {/* Сообщение об ошибке */}
                {errors.cover && !displayCover && (
                    <span className="font-montserrat font-bold text-[#E0232E] mt-4 z-10 text-[14px]">
                        {errors.cover}
                    </span>
                )}
            </div>

            {/* ---------------- БЛОК: ИНФОРМАЦИЯ О РЕЦЕПТЕ ---------------- */}
            <div className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[20px] py-[15px] mt-[30px]">

                <div id="field-title" className="flex flex-col gap-3">
                    <div className="flex items-center gap-1">
                        <h3 className="font-h3">Название рецепта</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                        {errors.title && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.title}</span>}
                    </div>
                    <Input
                        placeholder="Например: торт “Муравейник”"
                        value={title}
                        onChange={(e: any) => { setTitle(e.target.value); clearError('title'); }}
                        className={`transition-colors duration-300 ${errors.title ? '!border-[#E0232E] !bg-[#FFF6F6]' : ''}`}
                    />
                </div>

                <div id="field-description" className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center gap-1">
                        <h3 className="font-h3">Описание рецепта</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                        {errors.description && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.description}</span>}
                    </div>
                    <div className={`flex justify-between rounded-[5px] bg-[#F9F9F9] border-[1px] transition-colors duration-300 ${errors.description ? 'border-[#E0232E] bg-[#FFF6F6]' : 'border-[#E6E6E6]'}`}>
                        <Input
                            placeholder="Расскажите, каким будет готовое блюдо?"
                            className="border-none w-[90%] bg-transparent"
                            value={description}
                            onChange={(e: any) => { setDescription(e.target.value); clearError('description'); }}
                        />
                        <div onClick={handleGenerateDescription} className={`flex items-center gap-[2px] pr-[12px] cursor-pointer transition-opacity hover:opacity-80 ${isGeneratingDesc ? 'opacity-50 pointer-events-none' : ''}`} title="Сгенерировать описание с помощью ИИ">
                            <span className="text-[#737373] font-montserrat text-[14px] tracking-[0.2px] leading-7">
                                {isGeneratingDesc ? 'Думает...' : 'ИИ'}
                            </span>
                            <AiStar className={isGeneratingDesc ? 'animate-spin' : ''} />
                        </div>
                    </div>
                </div>

                <div id="field-portions" className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center gap-1">
                        <h3 className="font-h3">Количество порций</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                        {errors.portions && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.portions}</span>}
                    </div>
                    <div className={`flex items-center w-max border-[1px] rounded-[5px] overflow-hidden transition-colors duration-300 h-[45px] ${errors.portions ? '!border-[#E0232E] !bg-[#FFF6F6]' : 'border-[#E6E6E6] bg-white'}`}>
                        <button
                            type="button"
                            onClick={() => {
                                const current = parseInt(portions, 10) || 0;
                                if (current > 0) setPortions((current - 1).toString());
                            }}
                            className="w-[45px] h-full flex justify-center items-center text-[#737373] text-[22px] bg-transparent hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                        >
                            −
                        </button>
                        <Input
                            placeholder="0"
                            className="w-[50px] !h-full !border-none !bg-transparent !shadow-none text-center px-0 font-montserrat font-semibold text-[16px]"
                            value={portions}
                            onChange={(e: any) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setPortions(val);
                                clearError('portions');
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const current = parseInt(portions, 10) || 0;
                                setPortions((current + 1).toString());
                                clearError('portions');
                            }}
                            className="w-[45px] h-full flex justify-center items-center text-[#737373] text-[22px] bg-transparent hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div id="field-time" className="flex flex-col gap-3 mt-3">
                    <div className="flex items-center gap-1">
                        <h3 className="font-h3">Время на кухне</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                        {errors.time && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.time}</span>}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* ЧАСЫ */}
                        <div className="flex gap-3 items-center">
                            <div className={`flex items-center w-max border-[1px] rounded-[5px] overflow-hidden h-[45px] transition-colors duration-300 ${errors.time ? '!border-[#E0232E] !bg-[#FFF6F6]' : 'border-[#E6E6E6] bg-white'}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = parseInt(hours, 10) || 0;
                                        if (current > 0) setHours((current - 1).toString());
                                    }}
                                    className="w-[45px] h-full flex justify-center items-center text-[#737373] text-[22px] bg-transparent hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                                >
                                    −
                                </button>
                                <Input
                                    placeholder="0"
                                    className="w-[50px] !h-full !border-none !bg-transparent !shadow-none text-center px-0 font-montserrat font-semibold text-[16px]"
                                    value={hours}
                                    onChange={(e: any) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setHours(val);
                                        clearError('time');
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = parseInt(hours, 10) || 0;
                                        setHours((current + 1).toString());
                                        clearError('time');
                                    }}
                                    className="w-[45px] h-full flex justify-center items-center text-[#737373] text-[22px] bg-transparent hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                            <span className="font-h3">Часов</span>
                        </div>

                        {/* МИНУТЫ */}
                        <div className="flex gap-3 items-center">
                            <div className={`flex items-center w-max border-[1px] rounded-[5px] overflow-hidden h-[45px] transition-colors duration-300 ${errors.time ? '!border-[#E0232E] !bg-[#FFF6F6]' : 'border-[#E6E6E6] bg-white'}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = parseInt(minutes, 10) || 0;
                                        if (current > 0) setMinutes((current - 1).toString());
                                    }}
                                    className="w-[45px] h-full flex justify-center items-center text-[#737373] text-[22px] bg-transparent hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                                >
                                    −
                                </button>
                                <Input
                                    placeholder="0"
                                    className="w-[50px] !h-full !border-none !bg-transparent !shadow-none text-center px-0 font-montserrat font-semibold text-[16px]"
                                    value={minutes}
                                    onChange={(e: any) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setMinutes(val);
                                        clearError('time');
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = parseInt(minutes, 10) || 0;
                                        setMinutes((current + 1).toString());
                                        clearError('time');
                                    }}
                                    className="w-[45px] h-full flex justify-center items-center text-[#737373] text-[22px] bg-transparent hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                            <span className="font-h3">Минут</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- БЛОК: ТИП БЛЮДА ---------------- */}
            <div id="field-type" className={`relative flex flex-col w-[100%] border-[2px] rounded-[10px] px-[20px] py-[20px] mt-[30px] gap-6 transition-colors duration-300 ${errors.meal || errors.dish ? 'border-[#E0232E] bg-[#FFF6F6]' : 'border-[#E6E6E6]'}`}>
                {(selectedMeal || selectedDish) && (
                    <button type="button" onClick={() => { setSelectedMeal(''); setSelectedDish(''); }} className="absolute top-[20px] right-[20px] font-montserrat text-[13px] text-[#737373] underline hover:text-[#23A6F0] transition-colors">
                        Сбросить
                    </button>
                )}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-1">
                        <h3 className="font-h3">Тип приема пищи</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                        {errors.meal && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.meal}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-[15px] gap-y-[10px]">
                        {MEAL_TYPES.map(type => (
                            <button key={type} type="button" onClick={() => { setSelectedMeal(prev => prev === type ? '' : type); clearError('meal'); }} className={`border rounded-[37px] px-[20px] py-[6px] transition-colors font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7 ${selectedMeal === type ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]' : 'border-[#C4C4C4] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] bg-white'}`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center gap-1">
                        <h3 className="font-h3">Тип блюда</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                        {errors.dish && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.dish}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-[15px] gap-y-[10px]">
                        {DISH_TYPES.map(type => (
                            <button key={type} type="button" onClick={() => { setSelectedDish(prev => prev === type ? '' : type); clearError('dish'); }} className={`border rounded-[37px] px-[20px] py-[6px] transition-colors font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7 ${selectedDish === type ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]' : 'border-[#C4C4C4] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0] bg-white'}`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---------------- БЛОК: ИНГРЕДИЕНТЫ ---------------- */}
            <div id="field-ingredients" className={`flex flex-col w-[100%] px-[20px] py-[15px] mt-[30px] border-[2px] rounded-[10px] transition-colors duration-300 ${errors.ingredients ? 'border-[#E0232E] bg-[#FFF6F6]' : 'border-transparent'}`}>
                <div className="flex items-center gap-1 mb-[3px]">
                    <h3 className="font-h3">Ингредиенты</h3>
                    <span className="text-[#E0232E] font-bold">*</span>
                    {errors.ingredients && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">{errors.ingredients}</span>}
                </div>
                <div className="flex flex-col gap-3 mb-4">
                    {ingredients.map((ing, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="flex justify-between items-center w-[100%] bg-white p-2 rounded">
                                <span className="font-montserrat font-light text-[16px] text-[#000000] tracking-[0.2px] leading-7 underline">
                                    {ing.name}
                                </span>
                                <span className="font-montserrat font-light text-[16px] text-[#000000] tracking-[0.2px] leading-7">
                                    {ing.amount} {ing.unit}
                                </span>
                            </div>
                            <button type="button" onClick={() => handleRemoveIngredient(index)}>
                                <Delete className="w-[16px] text-[#BFBFBF] hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col py-1">
                    <div className="flex flex-col gap-2">
                        <div className="relative w-full">
                            <Input placeholder="Например: курица" className="px-[23px] w-full bg-white" value={ingName} onFocus={() => setIsDropdownOpen(true)} onChange={(e: any) => { setIngName(e.target.value); setIngId(''); setIsDropdownOpen(true); }} />
                            {isDropdownOpen && ingName && filteredIngredients.length > 0 && (
                                <ul className="absolute top-[100%] left-0 w-full bg-white border-[1px] border-[#E6E6E6] rounded-[5px] shadow-lg max-h-[150px] overflow-y-auto z-20 mt-1">
                                    {filteredIngredients.map(ing => (
                                        <li key={ing.id} className="px-[23px] py-2 hover:bg-[#F9F9F9] cursor-pointer font-montserrat text-[14px]" onClick={() => { setIngName(ing.title); setIngId(ing.id); setIsDropdownOpen(false); }}>
                                            {ing.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {isDropdownOpen && ingName && filteredIngredients.length === 0 && (
                                <div className="absolute top-[100%] left-0 w-full bg-white border-[1px] border-[#E6E6E6] rounded-[5px] shadow-lg p-3 z-20 mt-1 font-montserrat text-[13px] text-gray-500">
                                    Ингредиент не найден в базе
                                </div>
                            )}
                        </div>
                        <div className="flex gap-6 mt-2">
                            <Input
                                placeholder="Кол-во"
                                className="text-center w-[165px] bg-white"
                                value={ingAmount}
                                onChange={(e: any) => {
                                    const numericValue = e.target.value
                                        .replace(/,/g, '.')
                                        .replace(/[^\d.]/g, '');
                                    setIngAmount(numericValue);
                                }}
                            />
                            <div className="relative w-full">
                                <select value={ingUnit} onChange={(e) => setIngUnit(e.target.value)} className="w-full h-[50px] bg-white border-[1px] border-[#E6E6E6] rounded-[5px] px-[20px] font-montserrat text-[14px] outline-none appearance-none cursor-pointer">
                                    {UNIT_TYPES.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={handleAddIngredient} className="w-[225px] h-[30px] mt-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold tracking-[0.2px] leading-7 hover:bg-[#23A6F0] hover:text-white transition-colors bg-white">
                        Добавить ингредиент
                    </button>
                </div>
            </div>

            {/* ---------------- БЛОК: ШАГИ РЕЦЕПТА ---------------- */}
            <div className="flex flex-col mt-[14px] gap-3">
                {steps.map((step, index) => {
                    const displayStepImg = step.imagePreview || step.existingImageUrl;
                    const stepError = errors.steps?.includes(index.toString());

                    return (
                        <div id={`field-step-${index}`} key={step.id} className={`flex flex-col w-[100%] border-[2px] rounded-[10px] px-[23px] py-[15px] transition-colors duration-300 ${stepError ? 'border-[#E0232E] bg-[#FFF6F6]' : 'border-[#E6E6E6]'}`}>
                            <div className="flex justify-between w-[100%]">
                                <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px] bg-white'>
                                    <span className='font-montserrat text-[24px] text-[#000000] tracking-[0.2px] leading-6'>Шаг {index + 1}</span>
                                </div>
                                {steps.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveStep(step.id)}>
                                        <Delete className="w-[20px] text-black hover:text-red-500 transition-colors" />
                                    </button>
                                )}
                            </div>

                            {displayStepImg && (
                                <img src={displayStepImg} alt={`Фото шага ${index + 1}`} className="w-full h-[300px] object-cover rounded-[8px] mt-4" />
                            )}

                            <div className="flex justify-between items-end mt-6">
                                <input type="file" id={`step-img-${step.id}`} className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setSteps(steps.map(s => s.id === step.id ? { ...s, imageFile: file, imagePreview: URL.createObjectURL(file) } : s));
                                }} />
                                <button type="button" onClick={() => document.getElementById(`step-img-${step.id}`)?.click()} className='font-montserrat rounded-[5px] font-bold tracking-[0.2px] text-[#FFFFFF] w-[175px] h-[30px] text-[14px] bg-[#23A6F0] hover:bg-[#7ACDFC]'>
                                    {displayStepImg ? 'Изменить фото' : 'Загрузить фото'}
                                </button>
                            </div>

                            <div className="flex flex-col mt-[25px]">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-h3">Описание шага</h3>
                                        <span className="text-[#E0232E] font-bold">*</span>
                                        {stepError && <span className="text-[#E0232E] text-[12px] font-montserrat ml-2">Обязательное поле</span>}
                                    </div>
                                    <Input
                                        placeholder="Например: Помойте и почистите картошку..."
                                        value={step.description}
                                        className="bg-white"
                                        onChange={(e: any) => {
                                            setSteps(steps.map(s => s.id === step.id ? { ...s, description: e.target.value } : s));
                                            clearError('steps');
                                        }}
                                    />
                                </div>
                                {step.isTimerVisible ? (
                                    <div className="flex items-center justify-end gap-3 mt-[17px]">
                                        <span className="font-montserrat text-[14px] text-[#737373]">Таймер (мин):</span>
                                        <div className="flex items-center w-max border-[1px] border-[#E6E6E6] bg-white rounded-[5px] overflow-hidden h-[40px]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = parseInt(step.timerMinutes, 10) || 0;
                                                    if (current > 0) {
                                                        const val = (current - 1).toString();
                                                        setSteps(steps.map(s => s.id === step.id ? { ...s, timerMinutes: val } : s));
                                                    }
                                                }}
                                                className="w-[40px] h-full flex justify-center items-center text-[#737373] text-[20px] hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                                            >
                                                −
                                            </button>
                                            <Input
                                                placeholder="0"
                                                className="w-[45px] !h-full !border-none !bg-transparent !shadow-none text-center px-0 font-montserrat font-semibold text-[14px]"
                                                value={step.timerMinutes}
                                                onChange={(e: any) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setSteps(steps.map(s => s.id === step.id ? { ...s, timerMinutes: val } : s))
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = parseInt(step.timerMinutes, 10) || 0;
                                                    const val = (current + 1).toString();
                                                    setSteps(steps.map(s => s.id === step.id ? { ...s, timerMinutes: val } : s));
                                                }}
                                                className="w-[40px] h-full flex justify-center items-center text-[#737373] text-[20px] hover:bg-[#F0F9FF] hover:text-[#23A6F0] transition-colors select-none cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button type="button" onClick={() => setSteps(steps.map(s => s.id === step.id ? { ...s, isTimerVisible: false, timerMinutes: '' } : s))} className="text-[#E0232E] font-montserrat text-[14px] hover:underline ml-1">
                                            Отменить
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setSteps(steps.map(s => s.id === step.id ? { ...s, isTimerVisible: true } : s))} className='ml-auto mt-[16px] font-montserrat rounded-[5px] font-bold tracking-[0.2px] text-[#FFFFFF] w-[175px] h-[30px] text-[14px] bg-[#23A6F0] hover:bg-[#7ACDFC]'>
                                        Добавить таймер
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                <button type="button" onClick={handleAddStep} className="w-[160px] h-[30px] ml-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold tracking-[0.2px] leading-7 hover:bg-[#23A6F0] hover:text-white transition-colors">
                    Добавить шаг
                </button>
            </div>

            {/* ---------------- КНОПКА ОТПРАВКИ ---------------- */}
            <div className="flex justify-center mt-[14px] mb-[50px]">
                {/* Кнопка блокируется, если идет загрузка в сторе ИЛИ локальная загрузка */}
                <button type="button" className='font-montserrat font-bold text-[#FFFFFF] w-[350px] h-[55px] text-[20px] rounded-[9px] bg-[#23A6F0] hover:bg-[#7ACDFC] disabled:bg-gray-400 transition-colors' onClick={handlePreSubmit} disabled={isLoading || isSubmitting}>
                    {(isLoading || isSubmitting) ? 'Сохранение...' : (isEdit ? 'Сохранить изменения' : 'Опубликовать рецепт')}
                </button>
            </div>
        </div>
    );
}