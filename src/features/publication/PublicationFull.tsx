import type { Post } from '../../types/index';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { usePostStore } from '../../stores/postStore';

import avatar from '../../assets/avatar.svg';
import testPost from '../../assets/testPost2.png';

import NutritionalValue from './components/NutritionalValue';
import ProductsForCooking from './components/ProductsForCooking';
import SwitchDisplay from './components/SwitchDisplay';
import PhotoRecipe from './components/PhotoRecipe';
import RecipeRating from './components/RecipeRating';
import Comments from './components/Comments';
import PublicationHeader from './components/PublicationHeader';

type PublicationFullProps = {
    post: Post;
};

export default function PublicationFull({ post }: PublicationFullProps) {
    // Достаем новые тогглы из postStore
    const { updateLikeCount, updateFavoriteCount } = usePostStore();
    const { isAuthenticated } = useAuthStore();

    // Достаем тоггл подписки из userSettingsStore
    const {
        settings,
        toggleSubscription,
        isSubscribed,
        toggleLike,
        toggleFavorite
    } = useUserSettingsStore();

    const hasAllergen = (settings && post.products?.some(
        product => settings.allergens.includes(product.name)
    )) ?? null;

    const hasUnwanted = (settings && post.products?.some(
        product => settings.unwanted.includes(product.name)
    )) ?? null;

    // Вычисляем статусы на лету (вместо post.isLiked)
    const isLiked = settings?.likedPosts.includes(post.id) || false;
    const isFavorited = settings?.favoritePosts.includes(post.id) || false;
    const subscribed = isSubscribed(post.authorId);

    // Обработчики
    const handleLike = () => {
        if (!isAuthenticated) return;
        toggleLike(post.id);
        updateLikeCount(post.id, !isLiked);
    };

    const handleFavorite = () => {
        if (!isAuthenticated) return;
        toggleFavorite(post.id);
        updateFavoriteCount(post.id, !isFavorited);
    };

    const handleSubscribe = () => {
        if (!isAuthenticated) return;
        toggleSubscription(post.authorId);
    };

    return (
        <div className="max-w-[640px] mx-auto flex flex-col items-center justify-center">
            <PublicationHeader
                // динамические данные 
                avatar={post.authorAvatar || avatar}
                username={post.username}
                authorName={post.firstName}
                onSubscribe={handleSubscribe}
                image={post.image || testPost}
                time={post.timeAgo}
                title={post.title}
                rating={post.rating}
                description={post.description}
                likesCount={post.likesCount}
                favoritesCount={post.favoritesCount}
                commentsCount={post.commentsCount}
                isLiked={isLiked}
                isFavorited={isFavorited}
                isSubscribed={subscribed}
                onLike={handleLike}
                onFavorite={handleFavorite}
                onComment={() => { }}
                onBan={() => { }}
                hasAllergen={hasAllergen}
                hasUnwanted={hasUnwanted}
            />

            <NutritionalValue nutrition={post.nutrition} />
            <ProductsForCooking
                products={post.products}
                portions={post.portions || 0} />
            <SwitchDisplay />
            <PhotoRecipe steps={post.steps} />
            <RecipeRating rating={post.rating} />
            <Comments postId={post.id} />
        </div >
    );
}