import { type Post } from '../../stores/postStore';
import avatar from '../../assets/avatar.svg';
import { useAuthStore } from '../../stores/authStore';
import { useUserSettingsStore } from '../../stores/userSettingsStore';
import { usePostStore } from '../../stores/postStore';
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
    const { likePost, unlikePost, favoritePost, unfavoritePost, subscribeToAuthor } = usePostStore();
    const { isAuthenticated } = useAuthStore();
    const { settings } = useUserSettingsStore();

    const hasAllergen = settings && post.ingredients.some(
        ingredient => settings.allergens.includes(ingredient)
    );
    const hasUnwanted = settings && post.ingredients.some(
        ingredient => settings.unwanted.includes(ingredient)
    );
    const handleLike = () => {
        if (!isAuthenticated) return;
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
        <div className="max-w-[640px] mx-auto flex flex-col items-center justify-center">
            <PublicationHeader
                avatar={avatar}
                username={post.username}
                authorName={post.firstName}
                onSubscribe={handleSubscribe}
                image={testPost}
                time="50 минут"
                title="Картошка по деревенски"
                rating={post.rating}
                description="Вкусная картошка с домашним майонезом и кетчупом, специями"
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

            {/* Блок кбжу */}
            <NutritionalValue nutrition={post.nutrition} />
            {/* Продукты для приготовления */}
            <ProductsForCooking products={post.products} />
            {/* Негаснущий экран */}
            <SwitchDisplay />
            {/* Пошаговый Фоторецепт */}
            <PhotoRecipe steps={post.steps} />
            {/* Оценка рецепта */}
            <RecipeRating rating={post.rating} />
            {/* Комментарии */}
            <Comments username={post.username} />
        </div >
    );
}