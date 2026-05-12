import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../api/api';
import { aiApi } from '../../../api/aiApi';
import type { Post } from '../../../types/index';
import { mapRecipeDtoToPost } from '../../../utils/mappers';
// Временно ищет по по похожим ингридиентам, так как рецепт холодный, similar-recipes (Умный поиск по смыслу и поведению), останется только это
type SimilarRecipesProps = {
    recipeId: string;
};

export default function SimilarRecipes({ recipeId }: SimilarRecipesProps) {
    const [recipes, setRecipes] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSimilar = async () => {
            setIsLoading(true);
            try {
                let recommendedIds: string[] = [];

                // ПОПЫТКА 1: Умные рекомендации по поведению
                try {
                    const response = await aiApi.post(`/api/recommendations/similar-recipes`, {
                        recipe_id: recipeId,
                        top_k: 3
                    });
                    if (response.data && response.data.items) {
                        recommendedIds = response.data.items.map((item: any) => item.recipe_id);
                    }
                } catch (error: any) {
                    // ПОПЫТКА 2: Если рецепта нет в матрице, ищем похожие по ингредиентам
                    console.log("Рецепт новый, ищем похожие по составу...");
                    const fallbackResponse = await aiApi.post(`/api/recommendations/similar-by-ingredients`, {
                        recipe_id: recipeId,
                        top_k: 3
                    });

                    if (fallbackResponse.data && fallbackResponse.data.items) {
                        recommendedIds = fallbackResponse.data.items.map((item: any) => item.recipe_id);
                    }
                }

                // ШАГ 3: Запрашиваем полные данные рецептов по найденным ID
                if (recommendedIds.length > 0) {
                    // Создаем массив запросов
                    const fullRecipesPromises = recommendedIds.map(id => api.get(`/api/recipes/${id}`));

                    // Выполняем их параллельно для скорости
                    const responses = await Promise.allSettled(fullRecipesPromises);

                    // Достаем успешные ответы и прогоняем через наш маппер
                    const loadedRecipes = responses
                        .filter((res): res is PromiseFulfilledResult<any> => res.status === 'fulfilled')
                        .map(res => mapRecipeDtoToPost(res.value.data));

                    setRecipes(loadedRecipes);
                }

            } catch (error) {
                console.error("Критическая ошибка при загрузке рекомендаций:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (recipeId) {
            fetchSimilar();
        }
    }, [recipeId]);

    // Если грузимся — показываем текст, если пусто — скрываем компонент
    if (isLoading) return <div className="mt-10 font-montserrat text-center text-[#737373]">Ищем похожие рецепты...</div>;
    if (recipes.length === 0 && !isLoading) return null;

    return (
        <div className="w-full mt-12 mb-10">
            <h3 className="font-montserrat text-[24px] font-bold mb-6">ВАМ ТАКЖЕ МОЖЕТ ПОНРАВИТЬСЯ</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <Link
                        key={recipe.id}
                        to={`/publication/${recipe.id}`}
                        className="flex flex-col group"
                    >
                        <div className="w-full h-[180px] overflow-hidden rounded-[10px] mb-3">
                            <img
                                src={recipe.image || '/default-recipe.png'}
                                alt={recipe.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <h4 className="font-montserrat text-[16px] font-bold leading-tight group-hover:text-[#23A6F0] transition-colors">
                            {recipe.title}
                        </h4>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[13px] text-[#737373]">{recipe.timeCooking}</span>
                            <span className="text-[13px] font-bold text-[#23A6F0]">★ {recipe.rating?.rating}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}