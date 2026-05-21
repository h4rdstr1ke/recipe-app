import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePostStore } from "../stores/postStore";
import { useAuthStore } from "../stores/authStore";
import RecipeForm from "../features/publicationEdit/RecipeForm";
import ButtonBackRecipes from "../components/button/ButtonBackRecipes";

export default function PostEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { fetchPostById, currentPost, updateRecipe, updateRecipeStep, createRecipeStep, deleteRecipeStep, deleteRecipe, isLoading, clearCurrentPost } = usePostStore();

    const { user } = useAuthStore();

    useEffect(() => { if (id) fetchPostById(id); }, [id]);

    // ЗАЩИТА СТРАНИЦЫ: Проверяем, чей это рецепт
    useEffect(() => {
        // Ждем, пока пост загрузится и юзер будет доступен
        if (currentPost && user) {
            if (currentPost.authorId !== user.id) {
                alert("У вас нет прав на редактирование или удаление чужого рецепта!");
                navigate(-1); // возвращаем на шаг назад
            }
        }
    }, [currentPost, user, navigate]);

    const handleUpdate = async ({ recipeFormData, steps, deletedStepIds }: any) => {
        if (!id) return;
        const success = await updateRecipe(id, recipeFormData);
        if (success) {
            for (const delId of deletedStepIds) await deleteRecipeStep(id, delId);
            for (let i = 0; i < steps.length; i++) {
                const s = steps[i];
                const sData = new FormData();
                sData.append('Description', s.description);
                sData.append('Order', (i + 1).toString());
                if (s.timerMinutes) sData.append('CookingTime', `00:${s.timerMinutes.padStart(2, '0')}:00`);
                if (s.imageFile) sData.append('Image', s.imageFile);

                if (s.isNew) await createRecipeStep(id, sData);
                else await updateRecipeStep(id, s.id, sData);
            }

            clearCurrentPost();
            navigate(`/publication/${id}`);
        }
    };

    // Функция обработки удаления рецепта
    const handleDelete = async () => {
        if (!id) return;

        // Защита от случайного клика
        const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот рецепт? Это действие нельзя отменить.");
        if (!confirmDelete) return;

        const success = await deleteRecipe(id);
        if (success) {
            alert("Рецепт успешно удален!");
            clearCurrentPost();
            navigate('/profile');
        }
    };
    if (!currentPost) return <div className="text-center mt-10 font-montserrat">Загрузка...</div>;
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-[890px] my-4"><ButtonBackRecipes /></div>
            <RecipeForm
                initialData={currentPost}
                onSubmit={handleUpdate}
                onDelete={handleDelete}
                isLoading={isLoading}
                isEdit
            />
        </div>
    );
}