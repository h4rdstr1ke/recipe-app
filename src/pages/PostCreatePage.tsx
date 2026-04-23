import Input from "../components/input/Input"
import Button from "../components/button/Button"
import ButtonBackRecipes from "../components/button/ButtonBackRecipes"

import Delete from "../assets/icons/delete.svg?react"
import AiStar from "../assets/icons/aiStar.svg?react"
import PublicationAdd from "../assets/icons/imageAdd.svg?react"
import { useState } from "react"

const MEAL_TYPES = ['Завтрак', 'Обед', 'Полдник', 'Ужин', 'Перекус'];
const DISH_TYPES = ['Первые блюда', 'Вторые блюда', 'Салаты', 'Закуски', 'Выпечка', 'Соусы и маринады', 'Заготовки', 'Десерты', 'Напитки', 'Гарниры'];

export default function PostCreatePage() {
    const [selectedMeal, setSelectedMeal] = useState<string>('');
    const [selectedDish, setSelectedDish] = useState<string>('');
    return (
        <div className="flex flex-col items-center">
            <div className="flex w-[890px] my-[18px]"> {/* поменять! */}
                <ButtonBackRecipes />
            </div>
            <div className="max-w-[638px] w-[100%] flex flex-col">
                {/* Фото */}
                <div className="flex flex-col items-center w-[100%] border-[2px] border-dashed border-[#E6E6E6] rounded-[10px] py-[25px]">
                    <div className="flex gap-3">
                        <PublicationAdd className="w-[105px] h-[102px] text-[#E6E6E6] rotate-[-10.52deg]" />
                        <PublicationAdd className="w-[74px]  text-[#E6E6E6] rotate-[5.7deg] translate-y-6" />
                    </div>
                    <Button className='w-[350px] h-[55px] text-[20px] rounded-[9px] mt-[25px]'>Загрузить обложку рецепта</Button> {/* Поменять rounded! */}
                    <div className="flex flex-col items-center mt-3">
                        <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Выберите изображение на вашем устройстве.</span>
                        <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Пожалуйста, используйте свои авторские фото.</span>
                        <span className="font-montserrat text-[13px] font-light tracking-[0.2px] leading-[22px]">Допустимые форматы фотографий для загрузки: JPEG, JPG, PNG.</span>
                    </div>
                </div>
                {/* Блок про рецепт */}
                <div className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[20px] py-[15px] mt-[30px]">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Название рецепта</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <Input placeholder="Например: торт “Муравейник”" />
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Описание рецепта</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex justify-between rounded-[5px] bg-[#F9F9F9] border-[1px] border-[#E6E6E6]">
                            <Input placeholder="Расскажите, каким будет готовое блюдо?"
                                className="border-none w-[90%]" />
                            <div className="flex items-center gap-[2px] pr-[12px]">
                                <span className="text-[#737373] font-montserrat text-[14px] tracking-[0.2px] leading-7">ИИ</span>
                                <AiStar />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Количество порций</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <Input placeholder="0" className="max-w-[75px] text-center" />
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-1">
                            <h3 className="font-h3">Время на кухне</h3>
                            <span className="text-[#E0232E] font-bold">*</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex gap-3 items-center">
                                <Input placeholder="0" className="max-w-[75px] text-center" />
                                <span className="font-h3">Часов</span>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Input placeholder="0" className="max-w-[75px] text-center" />
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
                {/* Блок ингредиенты */}
                <div className="flex flex-col w-[100%] px-[20px] mt-[30px]">
                    <h3 className="font-h3 mb-[3px]">Ингредиенты</h3>

                    {/* Ингредиент */}
                    <div className="flex items-center gap-4">
                        <div className="flex justify-between items-center w-[100%]">
                            <span className="font-montserrat font-light text-[16px] text-[#000000] tracking-[0.2px] leading-7 underline">Картофель</span>
                            <span className="font-montserrat font-light text-[16px] text-[#000000] tracking-[0.2px] leading-7">5 штук</span>
                        </div>
                        <Delete className="w-[16px] text-[#BFBFBF]" />
                    </div>


                    {/* Добавить ингредиент */}
                    <div className="flex flex-col py-1">
                        <div className="flex flex-col gap-2">
                            <Input placeholder="Например курица" className="px-[23px]" />
                            <div className="flex gap-6">
                                <Input placeholder="Количество" className="text-center w-[165px]" />
                                <Input placeholder="Единица измерения" className="w-[100%] px-[23px]" />
                            </div>
                        </div>
                        <button className="w-[225px] h-[30px] mt-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold tracking-[0.2px] leading-7">Добавить ингредиент</button>
                    </div>
                </div>
                {/* Добавить шаг */}
                <div className="flex flex-col mt-[14px] gap-3">
                    <div className="flex flex-col w-[100%] border-[2px] rounded-[10px] border-[#E6E6E6] px-[23px] py-[15px]">
                        <div className="flex flex-col">
                            <div className="flex justify-between w-[100%]">
                                <div className='flex items-center justify-center border-[2px] border-[#23A6F0] rounded-[10px] w-[85px] h-[30px]'>
                                    <span className='font-montserrat text-[24px] text-[#000000] tracking-[0.2px] leading-6'>Шаг 1</span>
                                </div>
                                <Delete className="w-[20px] text-black" />
                            </div>
                            <img></img>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                            <Button className='w-[175px] h-[30px] text-[14px]'>Загрузить фото</Button>
                        </div>

                        <div className="flex flex-col mt-[25px]">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-1">
                                    <h3 className="font-h3">Описание шага</h3>
                                    <span className="text-[#E0232E] font-bold">*</span>
                                </div>
                                <Input placeholder="Помойте и почистите картошку" />
                            </div>
                            <Button className='w-[175px] h-[30px] text-[14px] mt-[17px] ml-auto'>Добавить таймер</Button>
                        </div>
                    </div>
                    <button className="w-[160px] h-[30px] ml-[25px] border-[1px] border-[#23A6F0] rounded-[37px] font-montserrat text-[14px] text-[#23A6F0] font-bold tracking-[0.2px] leading-7">Добавить шаг</button>
                </div>
                <div className="flex justify-center mt-[14px] mb-[50px]">
                    <Button className='w-[350px] h-[55px] text-[20px] rounded-[9px]'>Опубликовать рецепт</Button> {/* Поменять rounded! */}
                </div>
            </div>
        </div >
    )
}