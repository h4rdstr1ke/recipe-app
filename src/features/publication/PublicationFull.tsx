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
    const { toggleLike, toggleFavorite } = usePostStore();
    const { isAuthenticated } = useAuthStore();

    // Достаем тоггл подписки из userSettingsStore
    const { settings, toggleSubscription } = useUserSettingsStore();

    const hasAllergen = settings && post.ingredients.some(
        ingredient => settings.allergens.includes(ingredient)
    );
    const hasUnwanted = settings && post.ingredients.some(
        ingredient => settings.unwanted.includes(ingredient)
    );

    // Обработчики
    const handleLike = () => {
        if (!isAuthenticated) return; // TODO: Показать модалку входа
        toggleLike(post.id);
    };

    const handleFavorite = () => {
        if (!isAuthenticated) return;
        toggleFavorite(post.id);
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
                isLiked={post.isLiked}
                isFavorited={post.isFavorited}
                onLike={handleLike}
                onFavorite={handleFavorite}
                onComment={() => { }}
                onBan={() => { }}
                hasAllergen={hasAllergen}
                hasUnwanted={hasUnwanted}
            />

            <NutritionalValue nutrition={post.nutrition} />
            <ProductsForCooking products={post.products} />
            <SwitchDisplay />
            <PhotoRecipe steps={post.steps} />
            <RecipeRating rating={post.rating} />
            <Comments postId={post.id} />
        </div >
    );
}