import Input from "../components/input/Input"
import Button from "../components/button/Button"
import ButtonBackRecipes from "../components/button/ButtonBackRecipes"

import Delete from "../assets/icons/delete.svg?react"
import AiStar from "../assets/icons/aiStar.svg?react"
import PublicationAdd from "../assets/icons/imageAdd.svg?react"
import { useState, useRef, useEffect } from "react" // Добавили useRef
import { usePostStore } from "../stores/postStore"
import { useNavigate } from 'react-router-dom';
import { api } from "../api/api"

const MEAL_TYPES = ['Завтрак', 'Обед', 'Полдник', 'Ужин', 'Перекус'];
const DISH_TYPES = ['Первые блюда', 'Вторые блюда', 'Салаты', 'Закуски', 'Выпечка', 'Соусы и маринады', 'Заготовки', 'Десерты', 'Напитки', 'Гарниры'];

const UNIT_TYPES = ['г', 'кг', 'мл', 'л', 'шт', 'ст.л', 'ч.л', 'стакан'];

export default function PostCreatePage() {
    // 1. СТЕЙТЫ ДЛЯ БАЗОВОЙ ИНФОРМАЦИИ
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [portions, setPortions] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const [selectedMeal, setSelectedMeal] = useState<string>('');
    const [selectedDish, setSelectedDish] = useState<string>('');

    // 2. СТЕЙТЫ И ЛОГИКА ДЛЯ ФОТОГРАФИИ ОБЛОЖКИ
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    // Ссылка на скрытый input для выбора файла
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            // Создаем временную ссылку на картинку, чтобы показать ее пользователю
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };
    // 3. СТЕЙТЫ ДЛЯ ИНГРЕДИЕНТОВ
    // Добавили поле 'id' в интерфейс массива
    const [ingredients, setIngredients] = useState<Array<{ id: string; name: string; amount: string; unit: string }>>([]);

    const [ingName, setIngName] = useState('');
    const [ingId, setIngId] = useState(''); // Стейт для хранения ID выбранного ингредиента
    const [ingAmount, setIngAmount] = useState('');
    const [ingUnit, setIngUnit] = useState('г'); // По умолч граммы

    // Стейты для базы данных и выпадающего списка
    const [dbIngredients, setDbIngredients] = useState<Array<{ id: string, title: string }>>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Загружаем список из БД при открытии страницы
    useEffect(() => {
        api.get('/api/ingredients')
            .then(res => setDbIngredients(res.data))
            .catch(err => console.error("Ошибка загрузки ингредиентов:", err));
    }, []);

    // Фильтруем базу на лету по тексту, который ввел юзер
    const filteredIngredients = dbIngredients.filter(ing =>
        ing.title.toLowerCase().includes(ingName.toLowerCase())
    );

    const handleAddIngredient = () => {
        // Проверяем, что юзер не просто ввел текст, а именно выбрал элемент из списка (есть ingId)
        if (!ingName.trim() || !ingId) {
            alert("Пожалуйста, выберите ингредиент из выпадающего списка!");
            return;
        }

        setIngredients([...ingredients, { id: ingId, name: ingName, amount: ingAmount, unit: ingUnit }]);

        // Очищаем всё после добавления
        setIngName('');
        setIngId('');
        setIngAmount('');
        setIngUnit('');
        setIsDropdownOpen(false);
    };

    const handleRemoveIngredient = (indexToRemove: number) => {
        setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
    };

    // 4. СТЕЙТЫ И ЛОГИКА ДЛЯ ШАГОВ РЕЦЕПТА
    const [steps, setSteps] = useState<Array<{
        id: string;
        description: string;
        imageFile: File | null;
        imagePreview: string | null;
        timerMinutes: string;
        isTimerVisible: boolean;
    }>>([
        { id: Date.now().toString(), description: '', imageFile: null, imagePreview: null, timerMinutes: '', isTimerVisible: false }
    ]);

    // Добавление нового пустого шага в массив
    const handleAddStep = () => {
        setSteps([
            ...steps,
            { id: Date.now().toString(), description: '', imageFile: null, imagePreview: null, timerMinutes: '', isTimerVisible: false }
        ]);
    };

    // Удаление целевого шага из массива по идентификатору
    const handleRemoveStep = (idToRemove: string) => {
        if (steps.length === 1) return;
        setSteps(steps.filter(step => step.id !== idToRemove));
    };

    // Мутация текстового описания целевого шага
    const handleStepDescriptionChange = (id: string, newDescription: string) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, description: newDescription } : step
        ));
    };

    // Мутация значения таймера целевого шага
    const handleStepTimerChange = (id: string, newTimer: string) => {
        setSteps(steps.map(step =>
            step.id === id ? { ...step, timerMinutes: newTimer } : step
        ));
    };

    // Показать или скрыть поле таймера для конкретного шага
    const handleToggleTimer = (id: string, show: boolean) => {
        setSteps(steps.map(step =>
            step.id === id ? {
                ...step,
                isTimerVisible: show,
                // Очищаем значение, если пользователь решил скрыть таймер
                timerMinutes: show ? step.timerMinutes : ''
            } : step
        ));
    };

    // Мутация изображения целевого шага
    const handleStepImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSteps(steps.map(step =>
                step.id === id ? {
                    ...step,
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file)
                } : step
            ));
        }
    };
    // Стейт для индикации загрузки ответа от ИИ
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    // Функция генерации красивого описания
    const handleGenerateDescription = async () => {
        // ИИ нужно хотя бы название, чтобы понимать, о чем писать
        if (!title.trim()) {
            alert("Сначала введите название рецепта, чтобы ИИ понял, о чем писать!");
            return;
        }

        setIsGeneratingDesc(true);
        try {
            // Собираем данные в том формате, который ждет Python (массивы строк)
            const requestData = {
                title: title,
                // Берем только названия ингредиентов
                ingredients: ingredients.map(ing => ing.name),
                // Берем только непустые описания шагов
                steps: steps.map(step => step.description).filter(desc => desc.trim() !== ''),
                tone: "аппетитно и дружелюбно" // Можно задать тон, бэкенд это поддерживает!
            };

            // Отправляем запрос через наш прокси /ai
            const response = await api.post('/ai/api/recipes/generate-description', requestData);

            if (response.data && response.data.description) {
                // Вставляем сгенерированный текст прямо в инпут описания
                setDescription(response.data.description);
            }
        } catch (error) {
            console.error("Ошибка при генерации описания:", error);
            alert("Не удалось сгенерировать описание. Проверьте сервер ИИ.");
        } finally {
            setIsGeneratingDesc(false);
        }
    };
    const { createRecipe, createRecipeStep, isLoading } = usePostStore();
    const handleSubmit = async () => {
        // Базовая валидация
        if (!title.trim() || !description.trim()) {
            alert("Пожалуйста, заполните название и описание рецепта");
            return;
        }

        // 1. Форматируем время в "00:00:00"
        const h = (hours || '0').padStart(2, '0');
        const m = (minutes || '0').padStart(2, '0');
        const cookingTime = `${h}:${m}:00`;

        // 2. Собираем ингредиенты в нужный JSON формат
        // Проверка: бэкенд не пропустит рецепт без ингредиентов
        if (ingredients.length === 0) {
            alert("Добавьте хотя бы один ингредиент!");
            return;
        }

        // 2. Собираем ингредиенты (Weight = Количество, AlternativeWeight = Единица измерения)
        const ingredientsJsonArray = ingredients.map(ing => ({
            IngredientId: ing.id,
            // Превращаем строку "5" в число 5. 
            // || 0 - это защита: если юзер введет буквы вместо цифр, отправится 0
            Weight: Number(ing.amount) || 0,
            AlternativeWeight: ing.unit
        }));
        // ========================================================
        // НОВЫЙ БЛОК: Запрашиваем КБЖУ у ИИ перед отправкой
        // ========================================================
        let caloricValue = '0';
        let proteins = '0';
        let fats = '0';
        let carbohydrates = '0';

        try {
            // Подготавливаем данные в формате, который ждет ИИ (name и grams)
            const nutritionPayload = {
                ingredients: ingredients.map(ing => {
                    let grams = Number(ing.amount) || 0;

                    switch (ing.unit) {
                        case 'кг': case 'л':
                            grams *= 1000;
                            break;
                        case 'ст.л':
                            grams *= 15;
                            break;
                        case 'ч.л':
                            grams *= 5;
                            break;
                        case 'стакан':
                            grams *= 200;
                            break;
                        case 'шт':
                            grams *= 100;
                            break;
                        default: // для 'г' и 'мл' оставляем как есть
                            break;
                    }

                    return { name: ing.name, grams: grams };
                })
            };

            // Отправляем запрос к ИИ (через наш прокси /ai)
            const nutritionRes = await api.post('/ai/api/recipes/nutrition-per-100g', nutritionPayload);

            if (nutritionRes.data && nutritionRes.data.per_100g) {
                const per100 = nutritionRes.data.per_100g;
                // Округляем значения до целого, чтобы бэкенд на C# не ругался на дроби
                caloricValue = Math.round(per100.calories || per100.kcal || 0).toString();
                proteins = Math.round(per100.proteins || per100.protein || per100.protein_g || 0).toString();
                fats = Math.round(per100.fats || per100.fat || per100.fat_g || 0).toString();
                carbohydrates = Math.round(per100.carbohydrates || per100.carbs || per100.carbs_g || 0).toString()
            }
        } catch (error) {
            console.error("Ошибка при расчете КБЖУ через ИИ:", error);
            // Мы не делаем return! Если ИИ отвалился, просто останутся нули, 
            // но пользователь все равно сможет опубликовать рецепт.
        }
        // ========================================================

        // 3. Собираем FormData для основного рецепта
        const recipeFormData = new FormData();
        recipeFormData.append('Title', title);
        recipeFormData.append('Description', description);
        recipeFormData.append('CaloricValue', caloricValue);
        recipeFormData.append('Proteins', proteins);
        recipeFormData.append('Fats', fats);
        recipeFormData.append('Carbohydrates', carbohydrates);
        recipeFormData.append('CookingTime', cookingTime);
        recipeFormData.append('PortionsCount', portions);
        if (selectedDish) recipeFormData.append('DishType', selectedDish);
        if (selectedMeal) recipeFormData.append('MealType', selectedMeal);
        recipeFormData.append('IngredientsJson', JSON.stringify(ingredientsJsonArray));

        // Добавляем обложку, если она есть. Swagger ждет массив Images
        if (coverImage) {
            recipeFormData.append('Images', coverImage);
        }

        // --- ОТПРАВКА БАЗЫ РЕЦЕПТА ---
        const createdRecipeId = await createRecipe(recipeFormData);

        if (!createdRecipeId) {
            alert("Не удалось создать рецепт. Попробуйте еще раз.");
            return;
        }

        // --- ОТПРАВКА ШАГОВ ---
        // Если рецепт создался, прогоняем через цикл все шаги
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (!step.description.trim() && !step.imageFile) continue; // Пропускаем пустые

            const stepFormData = new FormData();
            stepFormData.append('Description', step.description);
            stepFormData.append('Order', (i + 1).toString());
            // Форматирование минут в строку TimeSpan (00:00:00) для бэкенда
            if (step.timerMinutes) {
                const totalMins = parseInt(step.timerMinutes, 10) || 0;
                const h = Math.floor(totalMins / 60).toString().padStart(2, '0');
                const m = (totalMins % 60).toString().padStart(2, '0');
                stepFormData.append('CookingTime', `${h}:${m}:00`);
            }
            if (step.imageFile) {
                stepFormData.append('Image', step.imageFile);
            }

            await createRecipeStep(createdRecipeId, stepFormData);
        }

        // ==========================================
        // РЕГИСТРИРУЕМ РЕЦЕПТ В ИИ-ГИДЕ
        // Это нужно, чтобы потом работал ЗОЖ-оптимизатор по ID
        // ==========================================
        try {
            const publishToAiData = {
                recipe_id: createdRecipeId, // ID из C# базы
                title: title,
                ingredients: ingredients.map(ing => ({
                    name: ing.name,
                    grams: Number(ing.amount) || 0
                })),
                steps: steps.map(s => s.description),
                tags: [selectedMeal, selectedDish].filter(Boolean)
            };

            // Отправляем ИИ-сервису через наш прокси /ai
            await api.post('/ai/api/recipes/publish', publishToAiData);
            console.log("Рецепт успешно зарегистрирован в базе ИИ-гида");
        } catch (err) {
            console.error("ИИ-гид не смог сохранить рецепт:", err);
            // Не критично, рецепт в основной базе уже есть, 
            // просто ИИ-фичи для него временно не будут работать
        }

        // Очищаем форму или перекидываем на страницу рецепта
        alert("Рецепт успешно опубликован!");
        // navigate(`/recipes/${createdRecipeId}`); 
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex md:w-[890px] my-[18px]">
                <ButtonBackRecipes />
            </div>
            <div className="max-w-[638px] w-[100%] flex flex-col">

                {/* ---------------- БЛОК: ФОТО ---------------- */}
                <div className="flex flex-col items-center w-[100%] border-[2px] border-dashed border-[#E6E6E6] rounded-[10px] py-[25px] overflow-hidden relative">

                    {/* Если картинка выбрана - показываем её, если нет - показываем иконки */}
                    {coverImagePreview ? (
                        <img
                            src={coverImagePreview}
                            alt="Обложка рецепта"
                            className="w-full h-[250px] object-cover rounded-[8px] absolute top-0 left-0 z-0"
                        />
                    ) : (
                        <div className="flex gap-3 z-10">
                            <PublicationAdd className="w-[105px] h-[102px] text-[#E6E6E6] rotate-[-10.52deg]" />
                            <PublicationAdd className="w-[74px] text-[#E6E6E6] rotate-[5.7deg] translate-y-6" />
                        </div>
                    )}

                    {/* Скрытый инпут для файлов */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                    />

                    {/* Кнопка вызывает клик по скрытому инпуту */}
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className='w-[350px] h-[55px] text-[20px] rounded-[9px] mt-[25px] z-10 relative bg-opacity-90'
                    >
                        {coverImagePreview ? 'Изменить обложку' : 'Загрузить обложку рецепта'}
                    </Button>

                    {!coverImagePreview && (
                        <div className="flex flex-col items-center mt-3 z-10">
                            <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Выберите изображение на вашем устройстве.</span>
                            <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Пожалуйста, используйте свои авторские фото.</span>
                            <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Допустимые форматы: JPEG, JPG, PNG.</span>
                        </div>
                    )}
                </div>

                {/* ---------------- БЛОК: ИНФОРМАЦИЯ О РЕЦЕПТЕ ---------------- */}
                <div className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[20px] py-[15px] mt-[30px]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Название рецепта</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <Input
                            placeholder="Например: торт “Муравейник”"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Описание рецепта</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex justify-between rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]">
                            <Input
                                placeholder="Расскажите, каким будет готовое блюдо?"
                                className="border-none w-[90%]"
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                            />
                            <div
                                onClick={handleGenerateDescription}
                                className={`flex items-center gap-[2px] pr-[12px] cursor-pointer transition-opacity hover:opacity-80 ${isGeneratingDesc ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                title="Сгенерировать описание с помощью ИИ"
                            >
                                <span className="text-[#737373] font-montserrat text-[14px] tracking-[0.2px] leading-7">
                                    {isGeneratingDesc ? 'Думает...' : 'ИИ'}
                                </span>
                                <AiStar className={isGeneratingDesc ? 'animate-spin' : ''} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Количество порций</h3>
                        </div>
                        <Input
                            placeholder="0"
                            className="max-w-[75px] text-center"
                            value={portions}
                            onChange={(e: any) => setPortions(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Время на кухне</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex gap-3 items-center">
                                <Input
                                    placeholder="0"
                                    className="max-w-[75px] text-center"
                                    value={hours}
                                    onChange={(e: any) => setHours(e.target.value)}
                                    type="number"
                                />
                                <span className="font-h3">Часов</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Input
                                    placeholder="0"
                                    className="max-w-[75px] text-center"
                                    value={minutes}
                                    onChange={(e: any) => setMinutes(e.target.value)}
                                    type="number"
                                />
                                <span className="font-h3">Минут</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Блок тип блюда и тип приема пищи */}
                <div className="relative flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[20px] py-[20px] mt-[30px] gap-6">
                    {/* Кнопка сброса */}
                    {(selectedMeal || selectedDish) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedMeal('');
                                setSelectedDish('');
                            }}
                            className="absolute top-[20px] right-[20px] font-montserrat text-[13px] text-[#737373] underline hover:text-[#23A6F0] transition-colors"
                        >
                            Сбросить
                        </button>
                    )}

                    {/* Тип приема пищи */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Тип приема пищи</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex flex-wrap gap-x-[15px] gap-y-[10px]">
                            {MEAL_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    // Если текущий тип уже выбран, сбрасываем его (''), иначе выбираем (type)
                                    onClick={() => setSelectedMeal(prev => prev === type ? '' : type)}
                                    className={`border rounded-[37px] px-[20px] py-[6px] transition-colors font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7 ${selectedMeal === type
                                        ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]'
                                        : 'border-[#C4C4C4] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0]'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Тип блюда */}
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Тип блюда</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex flex-wrap gap-x-[15px] gap-y-[10px]">
                            {DISH_TYPES.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedDish(prev => prev === type ? '' : type)}
                                    className={`border rounded-[37px] px-[20px] py-[6px] transition-colors font-montserrat text-[14px] font-bold tracking-[0.2px] leading-7 ${selectedDish === type
                                        ? 'border-[#23A6F0] bg-[#23A6F0] text-[#FFFFFF]'
                                        : 'border-[#C4C4C4] text-[#737373] hover:border-[#23A6F0] hover:text-[#23A6F0]'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* ---------------- БЛОК: ИНГРЕДИЕНТЫ ---------------- */}
                <div className="flex flex-col w-[100%] px-[20px] mt-[30px]">
                    <div className="flex items-center gap-1 mb-[3px]">
                        <h3 className="font-h3">Ингредиенты</h3>
                        <span className="text-[#E0232E] font-bold">*</span>
                    </div>

                    {/* Отрисовка добавленных ингредиентов */}
                    <div className="flex flex-col gap-3 mb-4">
                        {ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="flex justify-between items-center w-[100%]">
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

                    {/* Поля для добавления нового ингредиента */}
                    {/* Поля для добавления нового ингредиента */}
                    <div className="flex flex-col py-1">
                        <div className="flex flex-col gap-2">

                            {/* Обертка для инпута и дропдауна (relative) */}
                            <div className="relative w-full">
                                <Input
                                    placeholder="Например: курица"
                                    className="px-[23px] w-full"
                                    value={ingName}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    onChange={(e: any) => {
                                        setIngName(e.target.value);
                                        setIngId(''); // Сбрасываем ID, т.к. юзер начал печатать новое
                                        setIsDropdownOpen(true);
                                    }}
                                />

                                {/* Выпадающий список */}
                                {isDropdownOpen && ingName && filteredIngredients.length > 0 && (
                                    <ul className="absolute top-[100%] left-0 w-full bg-white border-[1px] border-[#E6E6E6] rounded-[5px] shadow-lg max-h-[150px] overflow-y-auto z-20 mt-1">
                                        {filteredIngredients.map(ing => (
                                            <li
                                                key={ing.id}
                                                className="px-[23px] py-2 hover:bg-[#F9F9F9] cursor-pointer font-montserrat text-[14px]"
                                                onClick={() => {
                                                    setIngName(ing.title); // Вставляем название
                                                    setIngId(ing.id);      // ЗАПОМИНАЕМ ID!
                                                    setIsDropdownOpen(false); // Закрываем список
                                                }}
                                            >
                                                {ing.title}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Сообщение, если ничего не найдено */}
                                {isDropdownOpen && ingName && filteredIngredients.length === 0 && (
                                    <div className="absolute top-[100%] left-0 w-full bg-white border-[1px] border-[#E6E6E6] rounded-[5px] shadow-lg p-3 z-20 mt-1 font-montserrat text-[13px] text-gray-500">
                                        Ингредиент не найден в базе
                                    </div>
                                )}
                            </div>

                            {/* Инпуты количества и единицы измерения остаются без изменений */}
                            <div className="flex gap-6 mt-2">
                                <Input
                                    placeholder="Кол-во"
                                    className="text-center w-[165px]"
                                    value={ingAmount}
                                    onChange={(e: any) => setIngAmount(e.target.value)}
                                />
                                {/* ЖЕСТКИЙ ВЫПАДАЮЩИЙ СПИСОК */}
                                <div className="relative w-full">
                                    <select
                                        value={ingUnit}
                                        onChange={(e) => setIngUnit(e.target.value)}
                                        className="w-full h-[50px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] rounded-[5px] px-[20px] font-montserrat text-[14px] outline-none appearance-none cursor-pointer"
                                    >
                                        {UNIT_TYPES.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                    {/* Иконка стрелочки вниз */}
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-[#737373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="w-[225px] h-[30px] mt-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold tracking-[0.2px] leading-7 hover:bg-[#23A6F0] hover:text-white transition-colors"
                        >
                            Добавить ингредиент
                        </button>
                    </div>
                </div>
                {/* ---------------- БЛОК: ШАГИ РЕЦЕПТА ---------------- */}
                <div className="flex flex-col mt-[14px] gap-3">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[23px] py-[15px]">

                            {/* Шапка шага: Номер и Кнопка удаления */}
                            <div className="flex justify-between w-[100%]">
                                <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                                    <span className='font-montserrat text-[24px] text-[#000000] tracking-[0.2px] leading-6'>
                                        Шаг {index + 1}
                                    </span>
                                </div>
                                {/* Показываем корзину только если шагов больше одного */}
                                {steps.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveStep(step.id)}>
                                        <Delete className="w-[20px] text-black hover:text-red-500 transition-colors" />
                                    </button>
                                )}
                            </div>

                            {/* Превью картинки шага (если загружена) */}
                            {step.imagePreview && (
                                <img
                                    src={step.imagePreview}
                                    alt={`Фото шага ${index + 1}`}
                                    className="w-full h-[200px] object-cover rounded-[8px] mt-4"
                                />
                            )}

                            {/* Кнопка загрузки фото для конкретного шага */}
                            <div className="flex justify-between items-end mt-4">
                                <input
                                    type="file"
                                    id={`step-img-${step.id}`}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e) => handleStepImageChange(step.id, e)}
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById(`step-img-${step.id}`)?.click()}
                                    className='w-[175px] h-[30px] text-[14px]'
                                >
                                    {step.imagePreview ? 'Изменить фото' : 'Загрузить фото'}
                                </button>
                            </div>

                            {/* Описание шага */}
                            <div className="flex flex-col mt-[25px]">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-h3">Описание шага</h3>
                                        <span className="text-[#E0232E] font-bold">*</span>
                                    </div>
                                    <Input
                                        placeholder="Например: Помойте и почистите картошку..."
                                        value={step.description}
                                        onChange={(e: any) => handleStepDescriptionChange(step.id, e.target.value)}
                                    />
                                </div>
                                {/* Логика отображения таймера */}
                                {step.isTimerVisible ? (
                                    <div className="flex items-center justify-end gap-3 mt-[17px]">
                                        <span className="font-montserrat text-[14px] text-[#737373]">Таймер (мин):</span>
                                        <Input
                                            placeholder="0"
                                            type="number"
                                            className="w-[75px] text-center"
                                            value={step.timerMinutes}
                                            onChange={(e: any) => handleStepTimerChange(step.id, e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleToggleTimer(step.id, false)}
                                            className="text-[#E0232E] font-montserrat text-[14px] hover:underline ml-2"
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleToggleTimer(step.id, true)}
                                        className='w-[175px] h-[30px] text-[14px] text-white mt-[17px] ml-auto bg-[#8F94989C] rounded-[5px] hover:bg-[#7ACDFC] transition-colors border-none'
                                    >
                                        Добавить таймер
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Кнопка добавления нового шага */}
                    <button
                        type="button"
                        onClick={handleAddStep}
                        className="w-[160px] h-[30px] ml-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold tracking-[0.2px] leading-7 hover:bg-[#23A6F0] hover:text-white transition-colors"
                    >
                        Добавить шаг
                    </button>
                </div>

                {/* ---------------- КНОПКА ОТПРАВКИ ---------------- */}
                <div className="flex justify-center mt-[14px] mb-[50px]">
                    <button
                        type="button"
                        className='w-[350px] h-[55px] text-[20px] rounded-[9px]'
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Опубликовать рецепт
                    </button>
                </div>
            </div>
        </div >
    )
}