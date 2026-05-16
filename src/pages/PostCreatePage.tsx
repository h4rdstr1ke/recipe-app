import { useNavigate } from 'react-router-dom';
import { usePostStore } from "../stores/postStore";
import RecipeForm from "../features/publicationEdit/RecipeForm";
import ButtonBackRecipes from "../components/button/ButtonBackRecipes";
import { aiApi } from "../api/aiApi";

export default function PostCreatePage() {
    const { createRecipe, createRecipeStep, isLoading } = usePostStore();
    const navigate = useNavigate();

    const handleCreate = async ({ recipeFormData, steps }: any) => {
        // Логика расчета КБЖУ через ИИ 
        try {
            const nutritionRes = await aiApi.post('/api/recipes/nutrition-per-100g', { /* ...ингредиенты... */ });
            if (nutritionRes.data?.per_100g) {
                const p = nutritionRes.data.per_100g;
                recipeFormData.append('CaloricValue', Math.round(p.calories || 0).toString());
                recipeFormData.append('Proteins', Math.round(p.proteins || 0).toString());
                recipeFormData.append('Fats', Math.round(p.fats || 0).toString());
                recipeFormData.append('Carbohydrates', Math.round(p.carbohydrates || 0).toString());
            }
        } catch (e) { console.error("ИИ КБЖУ недоступен"); }

        const recipeId = await createRecipe(recipeFormData);
        if (recipeId) {
            for (let i = 0; i < steps.length; i++) {
                const s = steps[i];
                const sData = new FormData();
                sData.append('Description', s.description);
                sData.append('Order', (i + 1).toString());
                if (s.timerMinutes) sData.append('CookingTime', `00:${s.timerMinutes.padStart(2, '0')}:00`);
                if (s.imageFile) sData.append('Image', s.imageFile);
                await createRecipeStep(recipeId, sData);
            }
            navigate(`/publication/${recipeId}`);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-[890px] my-4"><ButtonBackRecipes /></div>
            <RecipeForm onSubmit={handleCreate} isLoading={isLoading} />
        </div>
    );
}