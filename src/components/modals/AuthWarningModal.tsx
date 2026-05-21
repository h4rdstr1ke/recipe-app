import { useNavigate } from 'react-router-dom';

interface AuthWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthWarningModal({ isOpen, onClose }: AuthWarningModalProps) {
    const navigate = useNavigate();

    // Если модалка закрыта, вообще не рендерим её
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
            onClick={(e) => {
                e.stopPropagation(); // Не даем клику уйти ниже
                onClose(); // Закрываем при клике на фон
            }}
        >
            <div
                className="bg-white p-6 rounded-[10px] w-[90%] max-w-[400px] flex flex-col items-center shadow-lg"
                onClick={(e) => e.stopPropagation()} // Блокируем закрытие при клике на само окно
            >
                <h3 className="font-montserrat text-[20px] tracking-[0.2px] font-bold text-center mb-5">
                    Требуется авторизация
                </h3>
                <div className="flex gap-5 w-full">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="flex-1 py-2 rounded-[5px] border-[2px] border-[#23A6F0] text-[#23A6F0] tracking-[0.2px] font-montserrat font-bold transition-all hover:bg-[#F0F9FF]"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            navigate('/login');
                        }}
                        className="flex-1 py-2 rounded-[5px] bg-[#23A6F0] text-white font-montserrat tracking-[0.2px] font-bold transition-all hover:bg-[#7ACDFC]"
                    >
                        Войти
                    </button>
                </div>
            </div>
        </div>
    );
}