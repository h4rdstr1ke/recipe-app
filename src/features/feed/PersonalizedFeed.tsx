import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { mapRecipeDtoToPost } from '../../utils/mappers';
import type { Post } from '../../types/index';
import Publication from './Publication';
import { useAuthStore } from '../../stores/authStore';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function PersonalizedFeed() {
    const [recipes, setRecipes] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => !!state.token);

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const fetchPersonalized = async () => {
            // Если гость или нет ID — не делаем запрос
            if (!isAuthenticated || !user?.id) return;

            setIsLoading(true);
            try {
                //  Стучимся к ИИ за списком подходящих рецептов
                const aiResponse = await api.post('/ai/api/recommendations/personalized', {
                    user_id: user.id,
                    top_k: 4 // Покажем 4 самых подходящих рецепта временно
                });

                if (aiResponse.data && aiResponse.data.items) {
                    const recommendedIds = aiResponse.data.items.map((item: any) => item.recipe_id);

                    if (recommendedIds.length > 0) {
                        // Достаем полные данные из основной базы
                        const fullRecipesPromises = recommendedIds.map((id: string) =>
                            api.get(`/api/recipes/${id}`)
                        );
                        const results = await Promise.allSettled(fullRecipesPromises);

                        const loadedRecipes = results
                            .filter((res): res is PromiseFulfilledResult<any> => res.status === 'fulfilled')
                            // Прогоняем через маппер
                            .map(res => mapRecipeDtoToPost(res.value.data));

                        setRecipes(loadedRecipes);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке персональной ленты:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPersonalized();
    }, [user?.id, isAuthenticated]);

    // Если гость — вообще не рендерим этот блок
    if (!isAuthenticated) return null;

    // Пока грузится — показываем лоадер
    /*
    if (isLoading) return (
        <div className="mt-8 mb-4 font-montserrat text-[#737373] text-[18px]">
            ✨ ИИ подбирает рецепты специально для вас...
        </div>
    );*/

    // Если ИИ вернул пустой массив (пользователь еще ничего не лайкал)
    if (recipes.length === 0) return null;

    return (
        <div className='w-[100%] flex items-center flex-col mt-4 md:mt-8 mb-8 pb-8 border-b-[2px] border-dashed border-[#E6E6E6]'>
            {/* Заголовок блока */}


            {/* Сетка рецептов (используем те же классы, что и Feed.tsx) */}
            {isMobile ? (
                <div className='flex flex-col gap-y-6 max-w-[100%]'>
                    {recipes.map(post => (
                        <Publication key={`pers-${post.id}`} post={post} />
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-2 gap-x-[85px] gap-y-6 max-w-[1200px]'>
                    {recipes.map(post => (
                        <Publication key={`pers-${post.id}`} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}