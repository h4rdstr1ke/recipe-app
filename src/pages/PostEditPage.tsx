import Input from "../components/input/Input"
import Button from "../components/button/Button"
import ButtonBackRecipes from "../components/button/ButtonBackRecipes"
import Delete from "../assets/icons/delete.svg?react"
import AiStar from "../assets/icons/aiStar.svg?react"
import PublicationAdd from "../assets/icons/imageAdd.svg?react"

import { useState, useRef, useEffect } from "react"
import { usePostStore } from "../stores/postStore"
import { useNavigate, useParams } from 'react-router-dom';
import { api } from "../api/api"

const MEAL_TYPES = ['Завтрак', 'Обед', 'Полдник', 'Ужин', 'Перекус'];
const DISH_TYPES = ['Первые блюда', 'Вторые блюда', 'Салаты', 'Закуски', 'Выпечка', 'Соусы и маринады', 'Заготовки', 'Десерты', 'Напитки', 'Гарниры'];

export default function PostEditPage() {
    const { id: recipeId } = useParams<{ id: string }>(); // Берем ID рецепта из URL
    const navigate = useNavigate();

    const { fetchPostById, currentPost, updateRecipe, deleteRecipe, updateRecipeStep, createRecipeStep, deleteRecipeStep, isLoading } = usePostStore();

    // 1. СТЕЙТЫ БАЗОВОЙ ИНФОРМАЦИИ
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [portions, setPortions] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [selectedMeal, setSelectedMeal] = useState<string>('');
    const [selectedDish, setSelectedDish] = useState<string>('');

    // 2. ОБЛОЖКА
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
    const [existingImageId, setExistingImageId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 3. ИНГРЕДИЕНТЫ
    const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; amount: string; unit: string }>>([]);
    const [ingName, setIngName] = useState('');
    const [ingId, setIngId] = useState('');
    const [ingAmount, setIngAmount] = useState('');
    const [ingUnit, setIngUnit] = useState('');
    const [dbIngredients, setDbIngredients] = useState<Array<{ id: string, title: string }>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 4. ШАГИ
    const [steps, setSteps] = useState<Array<{
        id: string;
        description: string;
        imageFile: File | null;
        imagePreview: string | null;
        existingImageUrl: string | null;
        timerMinutes: string;
        isTimerVisible: boolean;
        isNew: boolean; // Флаг: если true, то делаем POST, если false - PUT
    }>>([]);

    const [deletedStepIds, setDeletedStepIds] = useState<string[]>([]); // Собираем удаленные шаги

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ: ЗАГРУЗКА РЕЦЕПТА И БАЗЫ
    // ==========================================
    useEffect(() => {
        api.get('/api/ingredients').then(res => setDbIngredients(res.data)).catch(console.error);

        if (recipeId) {
            fetchPostById(recipeId).then(post => {
                if (post) {
                    setTitle(post.title);
                    setDescription(post.description);
                    setPortions(post.portions?.toString() || '');
                    setSelectedMeal(post.mealType || '');
                    setSelectedDish(post.dishType || '');
                    setExistingCoverUrl(post.image || null);

                    // Сохраняем ID старой обложки
                    if (post.imageId) {
                        setExistingImageId(post.imageId);
                    }
                    // Парсим время
                    if (post.timeCooking && post.timeCooking !== "Время не указано") {
                        const parts = post.timeCooking.split(':');
                        if (parts.length >= 2) {
                            setHours(parseInt(parts[0], 10).toString());
                            setMinutes(parseInt(parts[1], 10).toString());
                        }
                    }

                    // Парсим ингредиенты (нам нужно достать единицу измерения)
                    if (post.products) {
                        const mappedIngs = post.products.map(p => {
                            // Так как бэкенд отдает "100 г", пытаемся разбить на цифры и буквы
                            const amountStr = p.weight ? p.weight.toString() : '';
                            const numPart = amountStr.replace(/[^\d.-]/g, '').trim();
                            const unitPart = amountStr.replace(/[\d.-]/g, '').trim();

                            return {
                                id: p.id,
                                name: p.name,
                                amount: numPart || amountStr,
                                unit: unitPart || 'г'
                            };
                        });
                        setIngredients(mappedIngs);
                    }

                    // Парсим шаги
                    if (post.steps) {
                        const mappedSteps = post.steps.map(s => {
                            let timerMins = '';
                            if (s.timer) {
                                const tParts = s.timer.split(':');
                                if (tParts.length >= 2) {
                                    timerMins = (parseInt(tParts[0], 10) * 60 + parseInt(tParts[1], 10)).toString();
                                }
                            }

                            return {
                                id: s.id || Date.now().toString(),
                                description: s.description,
                                imageFile: null,
                                imagePreview: null,
                                existingImageUrl: s.image || null,
                                timerMinutes: timerMins,
                                isTimerVisible: !!timerMins,
                                isNew: false // Это старые шаги из БД
                            };
                        });
                        setSteps(mappedSteps);
                    }
                }
            });
        }
    }, [recipeId, fetchPostById]);

    const filteredIngredients = dbIngredients.filter(ing => ing.title.toLowerCase().includes(ingName.toLowerCase()));

    // ==========================================
    // ОБРАБОТЧИКИ
    // ==========================================

    const handleDelete = async () => {
        if (!recipeId) return;

        // Обязательно спрашиваем подтверждение
        const confirmed = window.confirm("Вы уверены, что хотите полностью удалить этот рецепт? Это действие нельзя отменить.");

        if (confirmed) {
            const isDeleted = await deleteRecipe(recipeId);
            if (isDeleted) {
                alert("Рецепт удален.");
                navigate('/'); // Уводим пользователя на главную
            } else {
                alert("Не удалось удалить рецепт. Попробуйте позже.");
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddIngredient = () => {
        if (!ingName.trim() || !ingId) return alert("Выберите ингредиент из списка!");
        setIngredients([...ingredients, { id: ingId, name: ingName, amount: ingAmount, unit: ingUnit }]);
        setIngName(''); setIngId(''); setIngAmount(''); setIngUnit(''); setIsDropdownOpen(false);
    };

    const handleRemoveIngredient = (indexToRemove: number) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    };

    const handleAddStep = () => {
        setSteps([...steps, {
            id: Date.now().toString(), description: '', imageFile: null, imagePreview: null, existingImageUrl: null, timerMinutes: '', isTimerVisible: false, isNew: true
        }]);
    };

    const handleRemoveStep = (idToRemove: string) => {
        if (steps.length === 1) return;
        const stepToRemove = steps.find(s => s.id === idToRemove);
        // Если удаляем старый шаг (с бэкенда), запоминаем его ID для отправки DELETE
        if (stepToRemove && !stepToRemove.isNew) {
            setDeletedStepIds([...deletedStepIds, idToRemove]);
        }
        setSteps(steps.filter(step => step.id !== idToRemove));
    };

    // Мутации шагов
    const updateStepField = (id: string, field: string, value: any) => {
        setSteps(steps.map(step => step.id === id ? { ...step, [field]: value } : step));
    };

    const handleStepImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSteps(steps.map(step => step.id === id ? { ...step, imageFile: file, imagePreview: URL.createObjectURL(file) } : step));
        }
    };

    // ==========================================
    // ОТПРАВКА НА СЕРВЕР (СОХРАНЕНИЕ)
    // ==========================================
    const handleSubmit = async () => {
        if (!title.trim() || !description.trim() || !recipeId) {
            return alert("Заполните название и описание!");
        }
        if (ingredients.length === 0) return alert("Добавьте хотя бы один ингредиент!");

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
        recipeFormData.append('CaloricValue', '0');
        recipeFormData.append('Proteins', '0');
        recipeFormData.append('Fats', '0');
        recipeFormData.append('Carbohydrates', '0');
        recipeFormData.append('CookingTime', `${h}:${m}:00`);
        recipeFormData.append('PortionsCount', portions);
        if (selectedDish) recipeFormData.append('DishType', selectedDish);
        if (selectedMeal) recipeFormData.append('MealType', selectedMeal);
        recipeFormData.append('IngredientsJson', JSON.stringify(ingredientsJsonArray));

        if (coverImage) {
            recipeFormData.append('Images', coverImage);
            // Если была старая картинка, просим бэкенд удалить её
            // Swagger ожидает JSON-строку массива айдишников
            if (existingImageId) {
                recipeFormData.append('ImageIdsToDelete', JSON.stringify([existingImageId]));
            }
        }

        // 1. Обновляем основу рецепта
        const isRecipeUpdated = await updateRecipe(recipeId, recipeFormData);
        if (!isRecipeUpdated) return alert("Ошибка при сохранении рецепта.");

        // 2. Удаляем стертые шаги
        for (const delId of deletedStepIds) {
            await deleteRecipeStep(recipeId, delId);
        }

        // 3. Обновляем/добавляем текущие шаги
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (!step.description.trim() && !step.imageFile && !step.existingImageUrl) continue;

            const stepFormData = new FormData();
            stepFormData.append('Description', step.description);
            stepFormData.append('Order', (i + 1).toString());

            if (step.timerMinutes) {
                const totalMins = parseInt(step.timerMinutes, 10) || 0;
                const hrs = Math.floor(totalMins / 60).toString().padStart(2, '0');
                const mns = (totalMins % 60).toString().padStart(2, '0');
                stepFormData.append('CookingTime', `${hrs}:${mns}:00`);
            }

            if (step.imageFile) {
                stepFormData.append('Image', step.imageFile);
            }

            if (step.isNew) {
                // Если шаг создали только что - делаем POST
                await createRecipeStep(recipeId, stepFormData);
            } else {
                // Если шаг старый - обновляем его через PUT
                await updateRecipeStep(recipeId, step.id, stepFormData);
            }
        }

        alert("Изменения успешно сохранены!");
        navigate(`/publication/${recipeId}`);
    };

    const displayCover = coverImagePreview || existingCoverUrl;

    if (isLoading && !currentPost) return <div className="text-center mt-10">Загрузка рецепта...</div>;

    return (
        <div className="flex flex-col items-center">
            <div className="flex md:w-[890px] my-[18px]">
                <ButtonBackRecipes />
            </div>
            <div className="md:max-w-[638px] w-[100%] flex flex-col">
                <div className="flex w-[100%] mb-[30px] justify-end">
                    <button
                        type="button"
                        className="font-montserrat text-[16px] text-[#E0232E] font-bold hover:underline disabled:opacity-50"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        Удалить рецепт
                    </button>
                </div>

                {/* ---------------- БЛОК: ФОТО ---------------- */}
                <div className="flex flex-col items-center w-[100%] border-[2px] border-dashed border-[#E6E6E6] rounded-[10px] py-[25px] overflow-hidden relative">
                    {displayCover ? (
                        <img src={displayCover} alt="Обложка" className="w-full h-[250px] object-cover rounded-[8px] absolute top-0 left-0 z-0" />
                    ) : (
                        <div className="flex gap-3 z-10">
                            <PublicationAdd className="w-[105px] h-[102px] text-[#E6E6E6] rotate-[-10.52deg]" />
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} className='w-[350px] h-[55px] text-[20px] rounded-[9px] mt-[25px] z-10 relative bg-opacity-90'>
                        {displayCover ? 'Изменить обложку' : 'Загрузить обложку'}
                    </Button>
                </div>

                {/* ---------------- БЛОК: ИНФОРМАЦИЯ О РЕЦЕПТЕ ---------------- */}
                <div className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[20px] py-[15px] mt-[30px]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Название рецепта</h3><span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <Input value={title} onChange={(e: any) => setTitle(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Описание рецепта</h3><span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex justify-between rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]">
                            <Input className="border-none w-[90%]" value={description} onChange={(e: any) => setDescription(e.target.value)} />
                            <div className="flex items-center gap-[2px] pr-[12px] cursor-pointer hover:opacity-80">
                                <span className="text-[#737373] font-montserrat text-[14px]">ИИ</span><AiStar />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                        <h3 className="font-h3">Количество порций</h3>
                        <Input className="max-w-[75px] text-center" value={portions} onChange={(e: any) => setPortions(e.target.value)} />
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Время на кухне</h3><span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex gap-3 items-center">
                                <Input className="max-w-[75px] text-center" value={hours} onChange={(e: any) => setHours(e.target.value)} type="number" />
                                <span className="font-h3">Часов</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Input className="max-w-[75px] text-center" value={minutes} onChange={(e: any) => setMinutes(e.target.value)} type="number" />
                                <span className="font-h3">Минут</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Блок категорий */}
                <div className="relative flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[20px] py-[20px] mt-[30px] gap-6">
                    {(selectedMeal || selectedDish) && (
                        <button type="button" onClick={() => { setSelectedMeal(''); setSelectedDish(''); }} className="absolute top-[20px] right-[20px] font-montserrat text-[13px] text-[#737373] underline">
                            Сбросить
                        </button>
                    )}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1"><h3 className="font-h3">Тип приема пищи</h3><span className="text-[#E0232E] font-bold">*</span></div>
                        <div className="flex flex-wrap gap-x-[15px] gap-y-[10px]">
                            {MEAL_TYPES.map(type => (
                                <button key={type} type="button" onClick={() => setSelectedMeal(prev => prev === type ? '' : type)} className={`border rounded-[37px] px-[20px] py-[6px] font-montserrat text-[14px] font-bold ${selectedMeal === type ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]' : 'border-[#C4C4C4] text-[#737373]'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center gap-1"><h3 className="font-h3">Тип блюда</h3><span className="text-[#E0232E] font-bold">*</span></div>
                        <div className="flex flex-wrap gap-x-[15px] gap-y-[10px]">
                            {DISH_TYPES.map(type => (
                                <button key={type} type="button" onClick={() => setSelectedDish(prev => prev === type ? '' : type)} className={`border rounded-[37px] px-[20px] py-[6px] font-montserrat text-[14px] font-bold ${selectedDish === type ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]' : 'border-[#C4C4C4] text-[#737373]'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------------- БЛОК: ИНГРЕДИЕНТЫ ---------------- */}
                <div className="flex flex-col w-[100%] px-[20px] mt-[30px]">
                    <div className="flex items-center gap-1 mb-[3px]"><h3 className="font-h3">Ингредиенты</h3><span className="text-[#E0232E] font-bold">*</span></div>
                    <div className="flex flex-col gap-3 mb-4">
                        {ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex justify-between items-center w-[100%]">
                                    <span className="font-montserrat text-[16px] underline">{ing.name}</span>
                                    <span className="font-montserrat text-[16px]">{ing.amount} {ing.unit}</span>
                                </div>
                                <button type="button" onClick={() => handleRemoveIngredient(index)}>
                                    <Delete className="w-[16px] text-[#BFBFBF] hover:text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col py-1">
                        <div className="flex flex-col gap-2">
                            <div className="relative w-full">
                                <Input placeholder="Например: курица" className="px-[23px] w-full" value={ingName} onFocus={() => setIsDropdownOpen(true)} onChange={(e: any) => { setIngName(e.target.value); setIngId(''); setIsDropdownOpen(true); }} />
                                {isDropdownOpen && ingName && filteredIngredients.length > 0 && (
                                    <ul className="absolute top-[100%] left-0 w-full bg-white border-[1px] border-[#E6E6E6] rounded-[5px] shadow-lg max-h-[150px] overflow-y-auto z-20 mt-1">
                                        {filteredIngredients.map(ing => (
                                            <li key={ing.id} className="px-[23px] py-2 hover:bg-[#F9F9F9] cursor-pointer text-[14px]" onClick={() => { setIngName(ing.title); setIngId(ing.id); setIsDropdownOpen(false); }}>{ing.title}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex gap-6 mt-2">
                                <Input placeholder="Кол-во" className="text-center w-[165px]" value={ingAmount} onChange={(e: any) => setIngAmount(e.target.value)} />
                                <Input placeholder="Ед. измерения" className="w-[100%] px-[23px]" value={ingUnit} onChange={(e: any) => setIngUnit(e.target.value)} />
                            </div>
                        </div>
                        <button type="button" onClick={handleAddIngredient} className="w-[225px] h-[30px] mt-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold">Добавить ингредиент</button>
                    </div>
                </div>

                {/* ---------------- БЛОК: ШАГИ РЕЦЕПТА ---------------- */}
                <div className="flex flex-col mt-[14px] gap-3">
                    {steps.map((step, index) => {
                        const displayStepImg = step.imagePreview || step.existingImageUrl;
                        return (
                            <div key={step.id} className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[23px] py-[15px]">
                                <div className="flex justify-between w-[100%]">
                                    <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                                        <span className='font-montserrat text-[24px] tracking-[0.2px]'>Шаг {index + 1}</span>
                                    </div>
                                    {steps.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveStep(step.id)}>
                                            <Delete className="w-[20px] text-black hover:text-red-500" />
                                        </button>
                                    )}
                                </div>

                                {displayStepImg && <img src={displayStepImg} alt={`Шаг ${index + 1}`} className="w-full h-[200px] object-cover rounded-[8px] mt-4" />}

                                <div className="flex justify-between items-end mt-4">
                                    <input type="file" id={`step-img-${step.id}`} className="hidden" accept="image/*" onChange={(e) => handleStepImageChange(step.id, e)} />
                                    <button type="button" onClick={() => document.getElementById(`step-img-${step.id}`)?.click()} className='w-[175px] h-[30px] text-[14px]'>
                                        {displayStepImg ? 'Изменить фото' : 'Загрузить фото'}
                                    </button>
                                </div>

                                <div className="flex flex-col mt-[25px]">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-1"><h3 className="font-h3">Описание шага</h3><span className="text-[#E0232E] font-bold">*</span></div>
                                        <Input value={step.description} onChange={(e: any) => updateStepField(step.id, 'description', e.target.value)} />
                                    </div>
                                    {step.isTimerVisible ? (
                                        <div className="flex items-center justify-end gap-3 mt-[17px]">
                                            <span className="font-montserrat text-[14px] text-[#737373]">Таймер (мин):</span>
                                            <Input className="w-[75px] text-center" value={step.timerMinutes} onChange={(e: any) => updateStepField(step.id, 'timerMinutes', e.target.value)} />
                                            <button type="button" onClick={() => updateStepField(step.id, 'isTimerVisible', false)} className="text-[#E0232E] text-[14px] ml-2">Отменить</button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => updateStepField(step.id, 'isTimerVisible', true)} className='w-[175px] h-[30px] text-[14px] text-white mt-[17px] ml-auto bg-[#8F94989C] rounded-[5px]'>
                                            Добавить таймер
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    <button type="button" onClick={handleAddStep} className="w-[160px] h-[30px] ml-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold">Добавить шаг</button>
                </div>

                <div className="flex justify-center mt-[14px] mb-[50px]">
                    <button type="button" className='w-[350px] h-[55px] bg-[#23A6F0] text-white font-bold text-[20px] rounded-[9px] hover:bg-[#7ACDFC] disabled:bg-gray-400' onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </div>
            </div>
        </div >
    )
}