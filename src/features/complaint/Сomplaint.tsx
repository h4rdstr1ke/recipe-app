import { useState } from "react";
import Arrow from "../../assets/arrow.svg?react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";

type ScreenType = 'reasons' | 'customInput' | 'success';

export default function Complaint({ onClose }: { onClose: () => void }) {
    const [screen, setScreen] = useState<ScreenType>('reasons');

    const handleCustomOption = () => {
        setScreen('customInput');
    };

    const handleSendComplaint = () => {
        // Здесь логика отправки жалобы
        setScreen('success');
    };

    const handleClose = () => {
        onClose();
    };

    // Экран 1 Выбор причины жалобы
    if (screen === 'reasons') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#FFFFFF] relative flex flex-col w-[900px] py-[23px] border-[2px] border-[#E6E6E6] rounded-[10px]">
                    <div className="flex relative mx-[30px] justify-center items-center">
                        <button
                            onClick={onClose}
                            className="absolute left-0 top-[-1] text-[40px] text-[#000000] hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h1 className="font-montserrat text-[32px] font-bold tracking-[0.2px] leading-7">Пожаловаться</h1>
                    </div>
                    <div className="flex flex-col mt-[30px]">
                        <span className="px-[75px] mb-[13px] font-montserrat text-[20px] font-semibold tracking-[0.2px] leading-7">
                            Почему вы хотите пожаловаться на этот рецепт?
                        </span>
                        <div>
                            <div className="flex justify-between items-center pl-[75px] pr-[160px] py-[14px] border-t-[1px] border-b-[1px] cursor-pointer">
                                <span className="font-montserrat text-[20px] font-medium tracking-[0.2px] leading-7">
                                    Фото не соответствует рецепту
                                </span>
                                <Arrow className="w-[20px] text-[#000000]" />
                            </div>
                            <div className="flex justify-between items-center pl-[75px] pr-[160px] py-[14px] border-t-[1px] border-b-[1px] cursor-pointer">
                                <span className="font-montserrat text-[20px] font-medium tracking-[0.2px] leading-7">
                                    Описание не соответствует рецепту
                                </span>
                                <Arrow className="w-[20px] text-[#000000]" />
                            </div>
                            <div
                                onClick={handleCustomOption}
                                className="cursor-pointer flex justify-between items-center pl-[75px] pr-[160px] py-[14px] border-t-[1px] border-b-[1px]"
                            >
                                <span className="font-montserrat text-[20px] font-medium tracking-[0.2px] leading-7">
                                    Свой вариант
                                </span>
                                <Arrow className="w-[20px] text-[#000000]" />
                            </div>
                        </div>
                    </div>
                    <Button className="text-[14px] w-[200px] h-[50px] mx-auto mt-[15px]">
                        Отправить жалобу
                    </Button>
                </div>
            </div>
        );
    }

    // Экран 2 Свой вариант (поле ввода)
    if (screen === 'customInput') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#FFFFFF] relative flex flex-col w-[900px] py-[23px] border-[2px] border-[#E6E6E6] rounded-[10px]">
                    <div className="flex relative mx-[30px] justify-center items-center">
                        <button
                            onClick={onClose}
                            className="absolute left-0 top-[-1] text-[40px] text-[#000000] hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h1 className="font-montserrat text-[32px] font-bold tracking-[0.2px] leading-7">Пожаловаться</h1>
                    </div>
                    <div className="flex flex-col mt-[30px]">
                        <span className="mb-[13px] px-[75px] font-montserrat text-[20px] font-semibold tracking-[0.2px] leading-7">
                            Почему вы хотите пожаловаться на этот рецепт?
                        </span>
                        <Input
                            placeholder="Напишите, почему вы хотите пожаловаться"
                            className="mr-[180px] ml-[75px]"
                        />
                    </div>
                    <Button
                        onClick={handleSendComplaint}
                        className="text-[14px] w-[200px] h-[50px] mx-auto mt-[15px]"
                    >
                        Отправить жалобу
                    </Button>
                </div>
            </div>
        );
    }

    // Экран 3= Успешная отправка
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#FFFFFF] relative flex flex-col w-[900px] py-[23px] border-[2px] border-[#E6E6E6] rounded-[10px]">
                <div className="flex relative mx-[30px] justify-center items-center">
                    <button
                        onClick={onClose}
                        className="absolute left-0 top-[-1] text-[40px] text-[#000000] hover:text-gray-700"
                    >
                        ✕
                    </button>
                    <h1 className="font-montserrat text-[32px] font-bold tracking-[0.2px] leading-7">Спасибо что сообщили</h1>
                </div>
                <div className="flex flex-col mt-[30px] text-center w-[600px] mx-auto">
                    <span className="font-montserrat text-[20px] font-light tracking-[0.2px] leading-7">Когда мы рассмотрим вашу жалобу, вы получите уведомление.
                        Спасибо, что помогаете поддерживать атмосферу безопасности и взаимопомощи!</span>
                </div>
                <Button
                    onClick={handleClose}
                    className="text-[20px] w-[200px] h-[50px] leading-6 mx-auto mt-[15px]"
                >
                    Закрыть
                </Button>
            </div>
        </div>
    );
}