import Button from "../components/button/Button"
import Avatar from "../assets/avatar.svg"
import Medal from "../assets/medal.svg?react"

export default function TopAuthorsPage() {
    return (
        <div className="flex justify-center">
            <div className="flex flex-col w-[900px]">
                <h2 className=" mt-[26px] font-montserrat font-thin text-[48px] leading-7 tracking-[0.2px] mb-[49px]">Топ-авторов</h2>

                {/* Шапка - определяем сетку колонок */}
                <div className="mb-[26px] grid grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center px-[35px] bg-[#D3D3D3] h-[37px] rounded-[10px]">
                    <span className="font-montserrat font-semibold text-[18px]">Топ</span>
                    <span className="font-montserrat font-semibold text-[18px]">Аватарка</span>
                    <span className="font-montserrat font-semibold text-[18px]">Никнейм</span>
                    <span className="font-montserrat font-semibold text-[18px]">Посты</span>
                    <span className="font-montserrat font-semibold text-[18px]">Подписчики</span>
                    <span className="font-montserrat font-semibold text-[18px]">Рейтинг</span>
                    <span className="font-montserrat font-semibold text-[18px] text-right">Подписка</span>
                </div>

                {/* Строка с данными - та же сетка */}
                <div className="flex flex-col gap-[30px]">
                    <div className="grid grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center bg-[#F1F1F1] rounded-[10px] h-[65px] px-[35px]">
                        {/* Топ */}
                        <div className="flex items-center gap-2">
                            <span className="font-montserrat font-semibold text-[24px]">1</span>
                            <Medal className="w-[26px] text-[#FFEF3F]" />
                        </div>

                        {/* Аватарка */}
                        <img alt="avatar" src={Avatar} className="w-[50px]" />

                        {/* Никнейм */}
                        <span className="font-montserrat font-semibold text-[24px] text-[#23A6F0] underline">vlad228</span>

                        {/* Посты */}
                        <span className="font-montserrat font-semibold text-[24px]">29</span>

                        {/* Подписчики */}
                        <span className="font-montserrat font-semibold text-[24px]">323</span>

                        {/* Рейтинг */}
                        <span className="font-montserrat font-semibold text-[24px]">4333</span>

                        {/* Подписка */}
                        <Button className="text-[14px] w-[134px] h-[28px]">Подписаться</Button>
                    </div>

                    {/* Строка с данными - та же сетка */}
                    <div className="grid grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center bg-[#F1F1F1] rounded-[10px] h-[65px] px-[35px]">
                        {/* Топ */}
                        <div className="flex items-center gap-2">
                            <span className="font-montserrat font-semibold text-[24px]">2</span>
                            <Medal className="w-[26px] text-[#E7E7E7]" />
                        </div>

                        {/* Аватарка */}
                        <img alt="avatar" src={Avatar} className="w-[50px]" />

                        {/* Никнейм */}
                        <span className="font-montserrat font-semibold text-[24px] text-[#23A6F0] underline">keiraaaa</span>

                        {/* Посты */}
                        <span className="font-montserrat font-semibold text-[24px]">32</span>

                        {/* Подписчики */}
                        <span className="font-montserrat font-semibold text-[24px]">3423</span>

                        {/* Рейтинг */}
                        <span className="font-montserrat font-semibold text-[24px]">4223</span>

                        {/* Подписка */}
                        <Button className="text-[14px] w-[134px] h-[28px]">Подписаться</Button>
                    </div>

                    {/* Строка с данными - та же сетка */}
                    <div className="grid grid-cols-[60px_120px_160px_80px_160px_120px_170px] items-center justify-items-center bg-[#F1F1F1] rounded-[10px] h-[65px] px-[35px]">
                        {/* Топ */}
                        <div className="flex items-center gap-2">
                            <span className="font-montserrat font-semibold text-[24px]">3</span>
                            <Medal className="w-[26px] text-[#D0B078]" />
                        </div>

                        {/* Аватарка */}
                        <img alt="avatar" src={Avatar} className="w-[50px]" />

                        {/* Никнейм */}
                        <span className="font-montserrat font-semibold text-[24px] text-[#23A6F0] underline">rrffrrfff</span>

                        {/* Посты */}
                        <span className="font-montserrat font-semibold text-[24px]">21</span>

                        {/* Подписчики */}
                        <span className="font-montserrat font-semibold text-[24px]">334</span>

                        {/* Рейтинг */}
                        <span className="font-montserrat font-semibold text-[24px]">3100</span>

                        {/* Подписка */}
                        <Button className="text-[14px] w-[134px] h-[28px]">Подписаться</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}