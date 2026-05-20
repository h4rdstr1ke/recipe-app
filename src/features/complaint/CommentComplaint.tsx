import { useState } from "react";
import Arrow from "../../assets/icons/arrow.svg?react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { api } from "../../api/api";

type ScreenType = 'reasons' | 'customInput' | 'success';

export default function CommentComplaint({ commentId, onClose }: { commentId: string; onClose: () => void }) {
    const [screen, setScreen] = useState<ScreenType>('reasons');
    const [customReason, setCustomReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCustomOption = () => {
        setScreen('customInput');
    };

    const handleSendComplaint = async (reasonEnum: string) => {
        setIsLoading(true);
        try {
            const payload: Record<string, string> = {
                reason: reasonEnum
            };

            if (reasonEnum === 'Other' && customReason) {
                payload.customReason = customReason;
            }

            // Отправляем жалобу на КОММЕНТАРИЙ
            await api.post(`/api/reports/comments/${commentId}`, payload);
            setScreen('success');

        } catch (error: any) {
            const serverError = error.response?.data;
            console.error("Детали ошибки от бэкенда:", serverError);
            alert(`Сервер отклонил жалобу: ${JSON.stringify(serverError)}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (screen === 'reasons') {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
                <div
                    className="bg-[#FFFFFF] relative flex flex-col w-[900px] py-[23px] border-[2px] border-[#E6E6E6] rounded-[10px]"
                    onClick={(e) => e.stopPropagation()}
                >
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
                            Почему вы хотите пожаловаться на этот комментарий?
                        </span>
                        <div>
                            {/* InappropriatePhoto */}
                            <div
                                onClick={() => handleSendComplaint("InappropriatePhoto")}
                                className="flex justify-between items-center pl-[75px] pr-[160px] py-[14px] border-t-[1px] border-b-[1px] cursor-pointer hover:bg-gray-50 transition-colors">
                                <span className="font-montserrat text-[20px] font-medium tracking-[0.2px] leading-7">
                                    Содержит фото непристойного характера
                                </span>
                                <Arrow className="w-[20px] text-[#000000]" />
                            </div>
                            {/* OffensiveContent */}
                            <div
                                onClick={() => handleSendComplaint("OffensiveContent")}
                                className="flex justify-between items-center pl-[75px] pr-[160px] py-[14px] border-t-[1px] border-b-[1px] cursor-pointer hover:bg-gray-50 transition-colors">
                                <span className="font-montserrat text-[20px] font-medium tracking-[0.2px] leading-7">
                                    Оскорбляет чувства других пользователей
                                </span>
                                <Arrow className="w-[20px] text-[#000000]" />
                            </div>
                            {/* Other */}
                            <div
                                onClick={handleCustomOption}
                                className="flex justify-between items-center pl-[75px] pr-[160px] py-[14px] border-t-[1px] border-b-[1px] cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-montserrat text-[20px] font-medium tracking-[0.2px] leading-7">
                                    Свой вариант
                                </span>
                                <Arrow className="w-[20px] text-[#000000]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (screen === 'customInput') {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
                <div
                    className="bg-[#FFFFFF] relative flex flex-col w-[900px] py-[23px] border-[2px] border-[#E6E6E6] rounded-[10px]"
                    onClick={(e) => e.stopPropagation()}
                >
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
                            Почему вы хотите пожаловаться на этот комментарий?
                        </span>
                        <Input
                            value={customReason}
                            onChange={(e: any) => setCustomReason(e.target.value)}
                            placeholder="Напишите, почему вы хотите пожаловаться"
                            className="mr-[180px] ml-[75px]"
                        />
                    </div>
                    <button
                        onClick={() => handleSendComplaint('Other')}
                        disabled={isLoading || customReason.trim().length === 0}
                        className={`text-[14px] w-[200px] h-[50px] mx-auto mt-[15px] ${isLoading || customReason.trim().length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? "Отправка..." : "Отправить жалобу"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <div
                className="bg-[#FFFFFF] relative flex flex-col w-[900px] py-[23px] border-[2px] border-[#E6E6E6] rounded-[10px]"
                onClick={(e) => e.stopPropagation()}
            >
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
                    onClick={onClose}
                    className="text-[20px] w-[200px] h-[50px] leading-6 mx-auto mt-[15px]"
                >
                    Закрыть
                </Button>
            </div>
        </div>
    );
}