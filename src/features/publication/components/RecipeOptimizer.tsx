import { useState } from 'react';
import { api } from '../../../api/api'; // Проверь правильность пути до твоего api.ts

// Типы, которые возвращает ИИ согласно Swagger
type Suggestion = {
    original: string;
    replacement: string;
    grams: number;
    nutrition_delta: {
        kcal?: number;
        protein_g?: number;
        fat_g?: number;
        carbs_g?: number;
    };
};

type RecipeOptimizerProps = {
    recipeId: string;
};

export default function RecipeOptimizer({ recipeId }: RecipeOptimizerProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasOptimized, setHasOptimized] = useState(false); // Флаг, что мы уже запрашивали данные

    // Можно расширить на 'higher_protein' (больше белка), но пока сделаем похудение
    const targetGoal = 'lower_kcal';

    const handleOptimize = async () => {
        setIsLoading(true);
        try {
            // Запрашиваем замены у ИИ через наш прокси
            const response = await api.post('/ai/api/recipes/optimize-substitutions', {
                recipe_id: recipeId,
                goal: targetGoal,
                max_replacements: 3
            });

            if (response.data && response.data.suggestions) {
                setSuggestions(response.data.suggestions);
            }
        } catch (error) {
            console.error("Ошибка при оптимизации рецепта:", error);
        } finally {
            setIsLoading(false);
            setHasOptimized(true);
        }
    };

    return (
        <div className="w-[100%] mt-8 p-5 bg-[#F9F9F9] border-[1px] border-[#E6E6E6] rounded-[10px]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col">
                    <h3 className="font-montserrat text-[20px] font-bold tracking-[0.2px] text-[#23A6F0]">
                        ✨ ИИ-Оптимизатор ЗОЖ
                    </h3>
                    <p className="font-montserrat text-[14px] text-[#737373] mt-1">
                        Хотите снизить калорийность? Наш ИИ подскажет, как сделать блюдо более диетическим без потери вкуса!
                    </p>
                </div>

                <button
                    onClick={handleOptimize}
                    disabled={isLoading}
                    className={`shrink-0 px-6 py-3 rounded-[37px] font-montserrat text-[14px] font-bold transition-all shadow-sm
                        ${isLoading
                            ? 'bg-[#E6E6E6] text-[#737373] cursor-not-allowed'
                            : 'bg-[#23A6F0] text-white hover:bg-[#1A8CD8]'}`}
                >
                    {isLoading ? 'Анализируем...' : 'Сделать диетическим'}
                </button>
            </div>

            {/* Блок с результатами оптимизации */}
            {hasOptimized && (
                <div className="mt-6 flex flex-col gap-3">
                    {suggestions.length > 0 ? (
                        suggestions.map((sug, idx) => (
                            <div key={idx} className="flex flex-col p-4 bg-white border-[1px] border-dashed border-[#23A6F0] rounded-[8px]">
                                <span className="font-montserrat text-[15px] font-semibold">
                                    Замените <span className="line-through text-[#E0232E] mx-1">{sug.original}</span>
                                    на <span className="text-[#23A6F0] font-bold mx-1">{sug.replacement}</span>
                                    ({sug.grams} г)
                                </span>

                                {/* Показываем, сколько калорий мы сэкономили */}
                                {sug.nutrition_delta.kcal && sug.nutrition_delta.kcal < 0 && (
                                    <span className="font-montserrat text-[13px] text-[#4CAF50] mt-1 font-bold">
                                        🔻 Это сэкономит вам {Math.abs(sug.nutrition_delta.kcal)} ккал!
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="font-montserrat text-[14px] text-[#737373]">
                            ИИ считает, что этот рецепт уже достаточно сбалансирован!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}