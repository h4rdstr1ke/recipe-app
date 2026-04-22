import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AvatarDefault from '../../../assets/defaultAvatar.svg';
import LoupeIcon from '../../../assets/icons/loupe.svg?react';

import { useProfileStore } from '../../../stores/profileStore';
import { useUserSettingsStore } from '../../../stores/userSettingsStore';

export default function SubscriptionsModal({ onClose }: { onClose: () => void }) {
    const [searchQuery, setSearchQuery] = useState('');

    // ДОСТАЕМ МАССИВ ПОДПИСОК (на кого подписан юзер)
    const { subscriptionsList } = useProfileStore();
    const { isSubscribed, toggleSubscription } = useUserSettingsStore();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const filteredUsers = subscriptionsList.filter(user =>
        user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white w-[500px] h-[650px] rounded-[20px] shadow-2xl flex flex-col border border-gray-100" onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center relative py-5 border-b border-gray-100">
                    <button onClick={onClose} className="absolute left-6 text-[28px] font-light text-black hover:text-gray-500 transition-colors">✕</button>
                    <h2 className="font-montserrat text-[24px] font-bold w-full text-center">Подписки</h2>
                </div>

                <div className="px-6 py-4">
                    <div className="flex items-center bg-[#F9F9F9] border border-[#E6E6E6] rounded-[8px] h-[45px] px-4">
                        <input
                            type="text"
                            placeholder="Поиск"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none font-montserrat text-[14px] text-black placeholder-[#737373]"
                        />
                        <LoupeIcon className="w-[16px] h-[16px] text-black" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-3 custom-scrollbar">
                    {filteredUsers.map(user => {
                        const subscribed = isSubscribed(user.id);

                        return (
                            <div key={user.id} className="flex items-center justify-between bg-[#F1F1F1] rounded-[10px] p-3">
                                <Link
                                    to={`/profile/${user.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                >
                                    <img src={user.avatarUrl || AvatarDefault} alt="avatar" className="w-[45px] h-[45px] rounded-full object-cover" />
                                    <span className="font-montserrat font-semibold text-[18px] text-black">{user.nickname}</span>
                                </Link>

                                <button
                                    onClick={() => toggleSubscription(user.id)}
                                    className={`w-[130px] h-[32px] rounded-[5px] font-montserrat font-bold text-[14px] tracking-[0.2px] text-white transition-colors 
                                        ${subscribed
                                            ? 'bg-[#8F94989C] hover:bg-[#7ACDFC]'
                                            : 'bg-[#23A6F0] hover:bg-[#7ACDFC]'
                                        }`}
                                >
                                    {subscribed ? 'Вы подписаны' : 'Подписаться'}
                                </button>
                            </div>
                        );
                    })}

                    {filteredUsers.length === 0 && (
                        <div className="text-center text-gray-500 font-montserrat mt-10">Пользователи не найдены</div>
                    )}
                </div>
            </div>
        </div>
    );
}