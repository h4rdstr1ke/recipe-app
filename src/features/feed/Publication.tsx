import avatar from '../../assets/avatar.svg';
import testPost from '../../assets/testPost2.png';
import BanIcon from '../../assets/icons/feed/ban.svg?react';
import CommentIcon from '../../assets/icons/feed/comment.svg?react';
import FavoritesIcon from '../../assets/icons/feed/favorites.svg?react';
import LikeIcon from '../../assets/icons/feed/like.svg?react';
import StarIcon from '../../assets/icons/feed/star.svg?react';
import UnwnantedIcon from '../../assets/icons/feed/unwanted.svg?react';
import AllergenIcon from '../../assets/icons/feed/allergen.svg?react';
import { usePostStore, type Post } from '../../stores/postStore';
import { useAuthStore } from '../../stores/authStore';

export default function Publication({ post }: { post: Post }) {
    const { likePost, unlikePost, favoritePost, unfavoritePost, subscribeToAuthor } = usePostStore();
    const { isAuthenticated } = useAuthStore();

    const handleLike = () => {
        if (!isAuthenticated) {
            //Уведолмение о необходимости входа
            return;
        }

        if (post.isLiked) {
            unlikePost(post.id);
        } else {
            likePost(post.id);
        }
    };

    const handleFavorite = () => {
        if (!isAuthenticated) return;

        if (post.isFavorited) {
            unfavoritePost(post.id);
        } else {
            favoritePost(post.id);
        }
    };

    const handleSubscribe = () => {
        if (!isAuthenticated) return;
        subscribeToAuthor(post.authorId);
    };
    return (
        <div className="w-[550px] flex flex-col border-[2px] border-[#E6E6E6]">
            <div className="flex py-[5px] justify-between items-center border-b-[2px] border-[#E6E6E6]">
                <div className='flex ml-[22px] gap-2 items-center'>
                    <img src={avatar} className='w-[35px]' />
                    <span className='font-montserrat text-[14px] text-[#000000] tracking-[0.2px] font-semibold leading-6'>{post?.authorNickname}</span>
                </div>
                <button className='w-[150px] h-[30px] mr-[9px] bg-[#23A6F0] rounded-[5px]' onClick={handleSubscribe}>
                    <span className='font-montserrat text-[14px] text-[#FFFFFF] tracking-[0.2px] leading-7 font-bold'>Подписаться</span>
                </button>
            </div>

            <div className="relative ">
                <img src={testPost} className='h-[344px] w-[100%]' />

                {/* Фиксированный элемент сверху справа */}
                <div className='absolute top-0 right-0 flex flex-col mx-1 mt-1'>
                    <div className='w-[56px] h-[30px] flex items-center justify-center gap-1 border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>
                        <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold'>5</span>
                        <StarIcon className='w-[20px] h-[20px]' />
                    </div>
                </div>
                <div className='absolute bottom-0 right-0 mx-1 mb-2' >
                    <span className='px-[12px] py-[3px] font-montserrat text-[16px] text-[#000000] tracking-[0.2px] leading-7 font-bold border-[2px] border-[#E6E6E6] bg-[#FFFFFF] rounded-[10px]'>50 минут</span>
                </div>
            </div>

            <div className='flex border-t-[2px] items-center justify-between'>
                <div className='flex -mt-[2px] pb-[6px] pt-[7px] gap-4 px-[7px] border-b-[2px] border-t-[2px] border-r-[2px] border-[#E6E6E6] rounded-r-[10px] max-w-[170px]'>
                    <LikeIcon
                        className={`cursor-pointer ${post.isLiked ? 'fill-red-500' : ''}`}
                        onClick={handleLike}
                    />
                    {/*<span>{post.likesCount}</span>*/}
                    <FavoritesIcon
                        className={`cursor-pointer ${post.isFavorited ? 'fill-yellow-500' : ''}`}
                        onClick={handleFavorite}
                    />
                    <CommentIcon />
                    <BanIcon />
                </div>
                <div className='flex gap-2 mr-1'>
                    <AllergenIcon className='w-[30px] h-[30px]' />
                    <UnwnantedIcon className='w-[30px] h-[30px]' />
                </div>
            </div>
            <div className='flex mt-[6px] flex-col pl-[7px] gap-[6px] '>
                <span className='font-montserrat text-[20px] text-[#000000] tracking-[0.2px] font-bold leading-7'>Картошка по деревенски</span>
                <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] leading-4'>Вкусная картошка с домашним майонезом и кетчупом, специями</span>
            </div>
            <div className='flex w-[100%] pr-[10px] pb-[5px] justify-end items-center'>
                <span className='font-montserrat text-[16px] text-[#737373] tracking-[0.2px] font-medium leading-7'>27.01.2025</span>
            </div>
        </div>
    )
}