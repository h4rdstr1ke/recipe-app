import type { Post } from '../../types/index';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
//import { usePostStore } from '../../stores/postStore';

import DefaultAvatar from '../../assets/defaultAvatar.svg';
import { useProfileStore } from '../../stores/profileStore';
import NutritionalValue from './components/NutritionalValue';
import ProductsForCooking from './components/ProductsForCooking';
import SwitchDisplay from './components/SwitchDisplay';
import PhotoRecipe from './components/PhotoRecipe';
import RecipeRating from './components/RecipeRating';
import Comments from './components/Comments';
import PublicationHeader from './components/PublicationHeader';
import RecipeOptimizer from './components/RecipeOptimizer';
import SimilarRecipes from './components/SimilarRecipes';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type PublicationFullProps = {
    post: Post;
};

export default function PublicationFull({ post }: PublicationFullProps) {

    const { isAuthenticated, user } = useAuthStore();
    const { currentProfile } = useProfileStore();

    const {
        settings,
        toggleSubscription,
        isSubscribed,
        toggleLike,
        toggleFavorite
    } = useUserSettingsStore();

    const { hash } = useLocation();

    const hasAllergen = (settings && post.products?.some(
        product => settings.allergens.some((allergen: any) => allergen.id === product.id)
    )) ?? null;

    const hasUnwanted = (settings && post.products?.some(
        product => settings.unwanted.some((item: any) => item.id === product.id)
    )) ?? null;

    // Вычисляем статусы на лету (вместо post.isLiked)
    const isLiked = settings?.likedPosts.includes(post.id) || false;
    const isFavorited = settings?.favoritePosts.includes(post.id) || false;
    const subscribed = isSubscribed(post.authorId);

    // Обработчики
    const handleLike = () => {
        if (!isAuthenticated) return;
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

    // Вычисляем умную аватарку
    const isMyPost = post.authorId === user?.id;
    const displayAvatar = isMyPost
        ? (currentProfile?.avatarUrl || user?.avatarUrl || DefaultAvatar)
        : (post.authorAvatar || DefaultAvatar);
    // =======================
    return (
        <div className="w-[100%] mt-4 md:mt-0 px-2 md:px-0 md:max-w-[640px] mx-auto flex flex-col items-center justify-center">
            <PublicationHeader
                // динамические данные 
                authorId={post.authorId}
                postId={post.id}
                avatar={displayAvatar || DefaultAvatar}
                username={post.username}
                authorName={post.name}
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
                isMyPost={isMyPost}
            />

            <NutritionalValue nutrition={post.nutrition} />
            <ProductsForCooking
                products={post.products}
                portions={post.portions || 0} />
            <RecipeOptimizer recipeId={post.id} />
            <SwitchDisplay />
            <PhotoRecipe steps={post.steps} recipeId={post.id} />
            <RecipeRating rating={post.rating as any} recipeId={post.id} />
            <SimilarRecipes recipeId={post.id} />
            <Comments postId={post.id} />
        </div >
    );
}