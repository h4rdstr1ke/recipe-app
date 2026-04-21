import Avatar from "../../assets/avatar.svg"
import TestPhoto from "../../assets/testPost.png"

export default function Notifications({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed top-[110px] right-[350px] bg-[#FFFFFF] bottom-0 flex flex-col z-50 border border-black" onClick={onClose}>
            <div>
                <h3 className="font-montserrat text-[32px] tracking-[0.2px] font-bold leading-7">Уведомления</h3>
                <div className="grid grid-cols-[90px_260px_200px] items-center">
                    {/* Первая строка */}
                    <div className="flex justify-center">
                        <img src={Avatar} alt='photo' className="w-[70px] h-[70px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-montserrat text-[20px] tracking-[0.2px] font-semibold leading-7">kailkswjwjsjss</span>
                        <span className="font-montserrat text-[20px] tracking-[0.2px] leading-7">подписался(-ась) на ваши рецепты.</span>
                    </div>
                    <button className="bg-[#23A6F0] rounded-[5px]"><span className="font-montserrat text-white text-[14px] font-bold tracking-[0.2px] leading-7">Подписаться в ответ</span></button>

                    {/* Вторая строка */}
                    <div></div> {/* Пустой блок под фото */}
                    <span className="font-montserrat text-[14px] font-light tracking-[0.2px] leading-7">29 марта</span>
                    <div></div> {/* Пустой блок под кнопкой */}
                </div>
                <div className="grid grid-cols-[90px_260px_200px] items-center">
                    {/* Первая строка */}
                    <div className="flex justify-center">
                        <img src={Avatar} alt='photo' className="w-[70px] h-[70px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-montserrat text-[20px] tracking-[0.2px] font-semibold leading-7">kailkswjwjsjss</span>
                        <span className="font-montserrat text-[20px] tracking-[0.2px] leading-7">поставил(-а) “Нравится” вашему рецепту.</span>
                    </div>
                    <div className="flex justify-center">
                        <img src={TestPhoto} alt="photo" className="w-[100px] h-[85px] rounded-[10px]" />
                    </div>
                    {/* Вторая строка */}
                    <div></div> {/* Пустой блок под фото */}
                    <span className="font-montserrat text-[14px] font-light tracking-[0.2px] leading-7">29 марта</span>
                    <div></div> {/* Пустой блок под кнопкой */}
                </div>
                <div className="grid grid-cols-[90px_260px_200px] items-center">
                    {/* Первая строка */}
                    <div className="flex justify-center">
                        <img src={Avatar} alt='photo' className="w-[70px] h-[70px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-montserrat text-[20px] tracking-[0.2px] font-semibold leading-7">kailkswjwjsjss</span>
                        <span className="font-montserrat text-[20px] tracking-[0.2px] leading-7">прокомментирова(-а) ваш рецепт: Огонь, рец...</span>
                    </div>
                    <div className="flex justify-center">
                        <img src={TestPhoto} alt="photo" className="w-[100px] h-[85px] rounded-[10px]" />
                    </div>
                    {/* Вторая строка */}
                    <div></div> {/* Пустой блок под фото */}
                    <span className="font-montserrat text-[14px] font-light tracking-[0.2px] leading-7">29 марта</span>
                    <div></div> {/* Пустой блок под кнопкой */}
                </div>
                <div className="w-[515px] border-t border-b border-[#D9D9D9] mb-[5px]">
                    <h3 className="font-montserrat text-[20px] font-semibold tracking-[0.2px] leading-7">Предупреждения</h3>
                    <span className="font-montserrat text-[20px] tracking-[0.2px] leading-7">Ваша публикация была удалена из-за нарушения правил сайта. Следующее приведет к удалению аккаунта.</span>
                </div>
                <div className="w-[515px] border-t border-b border-[#D9D9D9] mb-[5px]">
                    <h3 className="font-montserrat text-[20px] font-semibold tracking-[0.2px] leading-7">Статус жалобы</h3>
                    <span className="font-montserrat text-[20px] tracking-[0.2px] leading-7">Мы рассмотрим Вашу жалобу и примем меру в случае нарушения. Спасибо!</span>
                </div>
            </div>
        </div>
    )
}