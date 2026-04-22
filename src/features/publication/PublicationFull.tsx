import type { Post } from '../../types/index';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { usePostStore } from '../../stores/postStore';

import DefaultAvatar from '../../assets/defaultAvatar.svg';

import NutritionalValue from './components/NutritionalValue';
import ProductsForCooking from './components/ProductsForCooking';
import SwitchDisplay from './components/SwitchDisplay';
import PhotoRecipe from './components/PhotoRecipe';
import RecipeRating from './components/RecipeRating';
import Comments from './components/Comments';
import PublicationHeader from './components/PublicationHeader';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

    const { hash } = useLocation();

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
    // Для перехода к коментариям =======================
    // СКРОЛЛ ПРИ ЗАГРУЗКЕ
    useEffect(() => {
        if (hash === '#comments-section') {
            const element = document.getElementById('comments-section');
            if (element) {
                // Небольшая задержка, чтобы компоненты успели отрисоваться
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    // Функция скролла до комментариев
    const handleScrollToComments = () => {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            // Браузер плавно прокрутит страницу до этого элемента
            commentsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    // =======================
    return (
        <div className="max-w-[640px] mx-auto flex flex-col items-center justify-center">
            <PublicationHeader
                // динамические данные 
                avatar={post.authorAvatar || DefaultAvatar}
                username={post.username}
                authorName={post.firstName}
                onSubscribe={handleSubscribe}
                image={post.image}
                time={post.timeCooking}
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
                onComment={handleScrollToComments}
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