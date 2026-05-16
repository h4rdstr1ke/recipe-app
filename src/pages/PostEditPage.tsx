import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { usePostStore } from "../stores/postStore";
import RecipeForm from "../features/publicationEdit/RecipeForm";
import ButtonBackRecipes from "../components/button/ButtonBackRecipes";

export default function PostEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchPostById, currentPost, updateRecipe, updateRecipeStep, createRecipeStep, deleteRecipeStep, isLoading, clearCurrentPost } = usePostStore();

    useEffect(() => { if (id) fetchPostById(id); }, [id]);

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

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-[890px] my-4"><ButtonBackRecipes /></div>
            <RecipeForm initialData={currentPost} onSubmit={handleUpdate} isLoading={isLoading} isEdit />
        </div>
    );
}