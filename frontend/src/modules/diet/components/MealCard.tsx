import React from "react";
import { Clock } from "lucide-react";
import { Meal } from "@/lib/types/dashboard";
import { getMealIcon } from "@/lib/utils/diet";

interface MealCardProps {
  meal: Meal;
  index: number;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const MealIcon = getMealIcon(meal.type);

  return (
    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-white to-orange-50 border border-orange-200/90 flex items-center justify-center shrink-0 shadow-[0_1.5px_2px_rgba(249,115,22,0.08),inset_0_1px_0_rgba(255,255,255,1)]">
        <MealIcon className="h-5 w-5 text-orange-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-slate-500 capitalize">{meal.type}</p>
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {meal.time}
            </span>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">{meal.calories} kcal</span>
        </div>
        <p className="font-medium text-sm text-[#10243e] mb-1">{meal.name}</p>
        {(meal.protein || meal.carbs || meal.fat) && (
          <div className="flex gap-3 text-[10px] text-slate-600 mb-2">
            {meal.protein && <span>Protein: <span className="font-semibold text-emerald-700">{meal.protein}g</span></span>}
            {meal.carbs && <span>Carbs: <span className="font-semibold text-orange-700">{meal.carbs}g</span></span>}
            {meal.fat && <span>Fat: <span className="font-semibold text-sky-700">{meal.fat}g</span></span>}
          </div>
        )}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="mt-2 mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 block">Ingredients</span>
            <div className="flex flex-wrap gap-1.5">
              {meal.ingredients.map((ing, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
                  {typeof ing === 'object' ? `${ing.quantity || ''} ${ing.item || ''}` : ing}
                </span>
              ))}
            </div>
          </div>
        )}
        {meal.tips && (
          <p className="text-xs text-orange-700 mt-2 italic flex items-start gap-1 bg-orange-50/50 p-2 rounded-lg border border-orange-100">
            <span>💡</span>
            <span>{meal.tips}</span>
          </p>
        )}
      </div>
    </div>
  );
};
