import { useEffect, useState } from 'react';
import { useCommentsStore } from '../../../stores/commentStore';
import { useAuthStore } from '../../../stores/authStore';


import DefaultAvatar from '../../../assets/defaultAvatar.svg';
import ImageAdd from '../../../assets/icons/imageAdd.svg?react';
import Reply from '../../../assets/icons/reply.svg?react';
import { LikeIcon } from '../../../components/icons/LikeIcon';
import Pencil from '../../../assets/icons/pencil.svg?react';
import BanIcon from '../../../assets/icons/ban.svg?react'
import DeleteIcon from '../../../assets/icons/delete.svg?react'

// 
// 1. ПОДКОМПОНЕНТ: Отрисовка ОДНОГО комментария (рекурсивная)
// 
const CommentItem = ({ comment, isReply = false }: { comment: any, isReply?: boolean }) => {
    const { addReply, toggleCommentLike, editReply, deleteComment } = useCommentsStore(); //  Достаем функцию из стора
    const { user } = useAuthStore(); // Достаем текущего пользователя

    const [showReplies, setShowReplies] = useState(false); // Показать/скрыть ветку
    const [isReplying, setIsReplying] = useState(false);   // Открыто ли окно ответа
    const [replyText, setReplyText] = useState('');        // Текст ответа

    // Стейты для редактирования ответа (теперь работают локально и для корневых, и для ответов)
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);

    // Функция для сохранения изменения ответа
    const handleSaveEdit = () => {
        if (editText.trim()) {
            editReply('root', comment.id, editText);
            setIsEditing(false); // Закрываем режим редактирования
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return; // Защита от пустого ответа

        // Отправляем ответ в стор (к любому родителю)
        addReply(comment.id, replyText);

        // порядок после отправки:
        setReplyText('');        // Очищаем поле
        setIsReplying(false);    // Закрываем поле ввода
        setShowReplies(true);    // Автоматически раскрываем ветку ответов, чтобы юзер увидел свой текст!
    };

    // Функция для ответа на конкретный ответ
    const handleReplyToReply = (replyAuthor: string) => {
        setIsReplying(true);
        setShowReplies(true); // На всякий случай раскрываем ветку
        setReplyText(`${replyAuthor}, `); // Подставляем никнейм с запятой
    };

    return (
        <div className={`flex flex-col mt-6 ${isReply ? '' : 'border-b-[1px] border-[#E6E6E6]'} pb-4`}>
            {/* ШАПКА КОММЕНТАРИЯ */}
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <img
                        src={comment.authorAvatar || DefaultAvatar}
                        className='w-[30px] h-[30px] object-cover rounded-full'
                        alt="avatar"
                    />
                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>
                        {comment.author}
                    </span>
                </div>

                <div className={`flex items-center ${isReply ? 'gap-2' : 'gap-4 translate-y-3'}`}>
                    <div className='flex items-center gap-[7px]'>
                        <LikeIcon
                            isLiked={comment.isLiked}
                            className={`cursor-pointer ${isReply ? 'w-[16px]' : ''} ${comment.isLiked ? 'text-[#FF0000]' : 'text-black'}`}
                            onClick={() => toggleCommentLike(comment.id)}
                        />
                        <span className={`font-montserrat tracking-[0.2px] font-medium ${isReply ? 'text-[15px] leading-relaxed' : 'text-[20px] leading-7'}`}>
                            {comment.likesCount}
                        </span>
                    </div>
                    <Reply
                        className={`${isReply ? 'w-[15px]' : ''} cursor-pointer hover:opacity-70`}
                        onClick={() => isReply ? handleReplyToReply(comment.author) : setIsReplying(!isReplying)}
                    />
                    {/* Карандаш и удалить видно только если ответ/коммент написал пользователь */}
                    {comment.author === user?.nickname ? (
                        <div className='flex items-center gap-2'>
                            <Pencil
                                className={`${isReply ? 'w-[15px]' : 'w-[20px]'} cursor-pointer hover:opacity-70`}
                                onClick={() => {
                                    setIsEditing(true);     // Включаем режим ред. для этого ID
                                    setEditText(comment.text);    // Подставляем текущий текст в инпут
                                }}
                            />
                            {/* Логика удаления основного комментария и ответа */}
                            <DeleteIcon
                                className={`${isReply ? 'h-[16px]' : 'w-[20px]'} cursor-pointer hover:opacity-70`}
                                onClick={() => deleteComment(comment.id)}
                            /> {/* Удалить свой комменатрий */}
                        </div>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <BanIcon className={`${isReply ? 'w-[15px]' : 'w-[25px]'} cursor-pointer hover:opacity-70`} />
                        </div>
                    )}
                </div>
            </div>

            {/* УСЛОВИЕ: Показываем либо поле ввода, либо обычный текст */}
            {isEditing ? (
                <div className="mt-2 flex flex-col gap-2">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className='min-h-[50px] w-[100%] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] rounded-[5px] p-2 font-montserrat text-[14px] resize-none focus:outline-none'
                    />
                    <div className='flex justify-end gap-3'>
                        <button
                            onClick={() => setIsEditing(false)}
                            className='font-montserrat text-[12px] text-[#737373] hover:text-black'
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className='bg-[#23A6F0] text-white px-4 py-1 rounded-[5px] font-montserrat text-[12px] font-bold hover:bg-[#7ACDFC] transition-colors'
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* ТЕКСТ КОММЕНТАРИЯ */}
                    <span className={`font-montserrat text-[16px] text-[#000000] tracking-[0.2px] font-light mt-2 ${isReply ? 'mt-1 leading-7' : 'leading-7'}`}>
                        {comment.text}
                    </span>
                    {!isReply && comment.imageUrl && (
                        <img src={comment.imageUrl} className='w-[300px] h-[200px] rounded-[10px] bg-[#E6E6E6] mt-2 object-cover' alt='Фото' />
                    )}
                    {/* ДАТА КОММЕНТАРИЯ */}
                    <div className={`flex justify-end w-[100%] ${isReply ? 'mt-1' : 'mt-2'}`}>
                        <span className={`font-montserrat tracking-[0.2px] font-semibold leading-7 ${isReply ? 'text-[12px] text-[#737373]' : 'text-[14px] text-[#000000]'}`}>
                            {comment.createdAt}
                        </span>
                    </div>
                </>
            )}

            {/* показывается только если нажали на иконку */}
            {isReplying && (
                <div className='flex flex-col mt-3 pl-8 border-l-[2px] border-[#23A6F0]'>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Ответить ${comment.author}...`}
                        className='min-h-[50px] w-[100%] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] rounded-[5px] p-2 font-montserrat text-[14px] resize-none focus:outline-none'
                    />
                    <div className='flex justify-end gap-3 mt-2'>
                        <button
                            onClick={() => setIsReplying(false)}
                            className='font-montserrat text-[12px] text-[#737373] hover:text-black'
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleSendReply}
                            className='bg-[#23A6F0] text-white px-4 py-1 rounded-[5px] font-montserrat text-[12px] font-bold hover:bg-[#7ACDFC] transition-colors'
                        >
                            Отправить
                        </button>
                    </div>
                </div>
            )}

            {/* БЛОК ОТВЕТОВ */}
            {comment.replies && comment.replies.length > 0 && (
                <div className='flex flex-col mt-4 pl-8 '>
                    <span
                        onClick={() => setShowReplies(!showReplies)}
                        className='font-montserrat mb-4 text-[14px] text-[#737373] tracking-[0.2px] leading-6 underline cursor-pointer hover:text-black'
                    >
                        {showReplies ? 'Скрыть ответы' : `Посмотреть ответы (${comment.replies.length})`}
                    </span>

                    {showReplies && comment.replies.map((reply: any) => (
                        <CommentItem key={reply.id} comment={reply} isReply={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

// 
// 2. ГЛАВНЫЙ КОМПОНЕНТ КОММЕНТАРИЕВ
// 
type CommentsProps = {
    postId: string;
}

export default function Comments({ postId }: CommentsProps) {
    const { comments, fetchCommentsByPostId, addComment } = useCommentsStore();

    // Стейты для текста и картинки
    const [newCommentText, setNewCommentText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchCommentsByPostId(postId);
    }, [postId, fetchCommentsByPostId]);

    // Обработчик выбора картинки
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Создаем временную ссылку на локальный файл для превью
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handlePublish = () => {
        // Разрешаем отправку, если есть либо текст, либо картинка
        if (!newCommentText.trim() && !selectedImage) return;

        // Передаем картинку в стор третьим аргументом
        addComment(postId, newCommentText, selectedImage || undefined);

        // Очищаем форму после публикации
        setNewCommentText('');
        setSelectedImage(null);
    };

    // Считаем все комментарии + все ответы (рекурсивно)
    const countTotal = (items: any[]): number => {
        return items.reduce((total, item) => total + 1 + countTotal(item.replies || []), 0);
    };
    const totalCommentsCount = countTotal(comments);

    return (
        <div id="comments-section" className='w-[100%] flex flex-col mt-5'>
            {/* ПОЛЕ ВВОДА */}
            <div>
                <div className='flex gap-1 mb-6'>
                    <h3 className='font-montserrat text-[28px] font-bold tracking-[0.2px] leading-7'>КОММЕНТАРИИ</h3>
                    <span className='font-montserrat text-[28px] font-light text-[#D1D1D1] tracking-[0.2px] leading-7'>
                        ({totalCommentsCount})
                    </span>
                </div>
                <div className='pl-5 relative'>
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder='Напишите отзыв по блюду!'
                        className={`min-h-[83px] h-[83px] w-[100%] bg-[#F9F9F9] border-[1px] border-[#E6E6E6] rounded-[5px]
                        font-montserrat text-[14px] tracking-[0.2px] leading-7
                        focus:outline-none resize-none placeholder:font-montserrat placeholder:text-[14px] placeholder:leading-7 placeholder:tracking-[0.2px] placeholder:text-[#737373]
                        py-[7px] px-[21px]`}
                    />
                    {/* СКРЫТЫЙ INPUT ДЛЯ ФАЙЛА */}
                    <input
                        type="file"
                        id="comment-image-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    {/* LABEL, СВЯЗАННЫЙ С INPUT */}
                    <label htmlFor="comment-image-upload">
                        <ImageAdd className='absolute top-[11px] right-[7px] text-[#737373] cursor-pointer hover:text-black transition-colors' />
                    </label>

                    {/* ПРЕВЬЮ ВЫБРАННОЙ КАРТИНКИ */}
                    {selectedImage && (
                        <div className="relative w-[150px] h-[100px] mt-2">
                            <img src={selectedImage} alt="preview" className="w-full h-full object-cover rounded-[5px] border-[1px] border-[#E6E6E6]" />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
                <div className='w-[100%] flex justify-end mt-4'>
                    <button
                        onClick={handlePublish}
                        className='w-[135px] h-[30px] bg-[#23A6F0] rounded-[5px] hover:bg-[#7ACDFC] transition-colors'
                    >
                        <span className='font-montserrat text-[14px] text-[#FFFFFF] font-bold tracking-[0.2px] leading-7'>Опубликовать</span>
                    </button>
                </div>
            </div>

            {/* СПИСОК КОММЕНТАРИЕВ */}
            <div className='flex flex-col mt-4'>
                {/* React берет массив comments и для каждого объекта Comment 
                    подкомпонент CommentItem, передавая ему данные внутрь
                */}
                {comments.length === 0 ? (
                    <span className="text-center text-[#737373] mt-8 font-montserrat">
                        Пока нет комментариев. Будьте первым!
                    </span>
                ) : (
                    comments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                )}
            </div>
        </div>
    )
}