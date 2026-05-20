import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useModerationStore } from '../stores/moderationStore';
import DefaultAvatar from '../assets/defaultAvatar.svg';

export default function ModeratorPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
    const [searchQuery, setSearchQuery] = useState('');

    const { reports, fetchReports, isLoading, dismissReport, takeAction } = useModerationStore();

    useEffect(() => {
        if (activeTab === 'reports') {
            fetchReports('Pending', true);
        }
    }, [activeTab, fetchReports]);

    // Моковые данные пользователей
    const mockUsers = [
        { id: '1', username: 'vlad228' },
        { id: '2', username: 'agata222' },
        { id: '3', username: 'marina111' },
    ].filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleBanUser = (userId: string) => {
        alert(`Пользователь ${userId} заблокирован (мокап)`);
    };

    // Вспомогательная функция для перевода причины на русский
    const getReasonText = (report: any) => {
        if (report.reason === 'PhotoDoesNotMatchRecipe') return 'Фото не соответствует рецепту';
        if (report.reason === 'DescriptionDoesNotMatchRecipe') return 'Описание не соответствует рецепту';
        if (report.reason === 'CommunityRulesViolation') return 'Нарушает правила сообщества';
        if (report.reason === 'InappropriatePhoto') return 'Фото непристойного характера';
        if (report.reason === 'OffensiveContent') return 'Оскорбляет чувства других';
        if (report.reason === 'Other') return report.customReason || 'Иная причина';
        return report.reason || 'Жалоба';
    };

    return (
        <div className="w-full min-h-screen bg-[#F9F9F9] flex justify-center pb-20">
            <div className="w-full max-w-[800px] mt-8 bg-white rounded-[15px] shadow-sm border border-gray-100 p-8 min-h-[600px]">

                {/* Навигация */}
                <div className="flex justify-center gap-12 border-b border-gray-200 pb-4 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`text-[22px] font-montserrat transition-colors ${activeTab === 'users'
                            ? 'text-black border-b-[2px] border-black pb-1 -mb-[17px]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Пользователи
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`text-[22px] font-montserrat transition-colors ${activeTab === 'reports'
                            ? 'text-black border-b-[2px] border-black pb-1 -mb-[17px]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Жалобы
                    </button>
                </div>

                {/* КОНТЕНТ: ПОЛЬЗОВАТЕЛИ */}
                {activeTab === 'users' && (
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-[45px] mb-4">
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-full bg-[#F9F9F9] border border-[#DADADA] rounded-[8px] pl-4 pr-10 outline-none focus:border-[#23A6F0] font-montserrat text-[14px]"
                            />
                            <svg className="absolute right-4 top-[14px] w-4 h-4 text-gray-500" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.9382 13 9.2673 12.5329 10.3439 11.7422L14.2929 15.6912C14.6834 16.0818 15.3166 16.0818 15.7071 15.6912C16.0976 15.3007 16.0976 14.6675 15.7071 14.277L11.7422 10.3439ZM11 6.5C11 8.98528 8.98528 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5Z" fill="currentColor" />
                            </svg>
                        </div>

                        {mockUsers.map(user => (
                            <div key={user.id} className="flex justify-between items-center bg-[#F4F4F4] rounded-[10px] p-4">
                                <div className="flex items-center gap-4">
                                    <img src={DefaultAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <span className="font-montserrat font-bold text-[16px]">{user.username}</span>
                                </div>
                                <button
                                    onClick={() => handleBanUser(user.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                                        <path d="M5.5 5.5L18.5 18.5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* КОНТЕНТ: ЖАЛОБЫ */}
                {activeTab === 'reports' && (
                    <div className="flex flex-col gap-4">
                        {isLoading && <p className="text-center text-gray-500">Загрузка жалоб...</p>}
                        {!isLoading && reports.length === 0 && (
                            <p className="text-center text-gray-500">Нет активных жалоб.</p>
                        )}

                        {reports.map((report: any) => (
                            <div key={report.id} className="flex justify-between items-center bg-[#F4F4F4] rounded-[10px] p-4">
                                <div className="flex items-center gap-4">
                                    <img src={DefaultAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex flex-col">
                                        {/* Реальное имя заявителя */}
                                        <span className="font-montserrat font-bold text-[16px]">
                                            {report.reporterUserName || 'Пользователь'}
                                        </span>
                                        {/* Переведенная причина */}
                                        <span className="font-montserrat text-[14px] text-gray-600">
                                            {getReasonText(report)}
                                        </span>
                                        {/* Ссылка на рецепт */}
                                        {report.targetType === 'Recipe' && (
                                            <Link
                                                to={`/publication/${report.targetId}`}
                                                target="_blank"
                                                className="text-[#23A6F0] hover:underline text-[12px] font-montserrat mt-1"
                                            >
                                                Посмотреть рецепт →
                                            </Link>
                                        )}
                                        {/* Ссылка на профиль пользователя */}
                                        {(report.targetType?.toLowerCase() === 'userprofile' ||
                                            report.targetType?.toLowerCase() === 'user' ||
                                            report.targetType?.toLowerCase() === 'profile') && (
                                                <Link
                                                    to={`/profile/${report.targetId}`}
                                                    target="_blank"
                                                    className="text-[#23A6F0] hover:underline text-[12px] font-montserrat mt-1"
                                                >
                                                    Посмотреть профиль →
                                                </Link>
                                            )}
                                        {/* Ссылка на комментарий */}
                                        {report.targetType?.toLowerCase() === 'comment' && (
                                            <Link
                                                // Пытаемся взять recipeId или postId из ответа. Если нет, временно упадет на targetId
                                                to={`/publication/${report.recipeId || report.postId || report.targetId}#comments-section`}
                                                target="_blank"
                                                className="text-[#23A6F0] hover:underline text-[12px] font-montserrat mt-1"
                                            >
                                                Посмотреть комментарий →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Кнопка "Принять меры" (галочка) */}
                                    <button
                                        onClick={() => takeAction(report.id, "Жалоба подтверждена, контент удален")}
                                        className="text-green-500 hover:text-green-700 transition-colors bg-white rounded-full p-1"
                                        title="Подтвердить жалобу (принять меры)"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    {/* Кнопка "Отклонить" (крестик) */}
                                    <button
                                        onClick={() => dismissReport(report.id, "Нарушений не обнаружено")}
                                        className="text-red-500 hover:text-red-700 transition-colors bg-white rounded-full p-1"
                                        title="Отклонить жалобу (ложный вызов)"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}