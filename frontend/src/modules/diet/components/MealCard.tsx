import React from "react";
import { Clock, Lightbulb } from "lucide-react";
import { Meal } from "@/lib/types/dashboard";
import { getMealIcon } from "@/lib/utils/diet";

interface MealCardProps {
  meal: Meal;
  index: number;
}

const cleanText = (str: any) => {
  if (!str) return "";
  return String(str)
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}\u{200D}\u{FE0F}]/gu, "")
    .trim();
};

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
        <p className="font-semibold text-sm text-[#10243e] mb-1">{cleanText(meal.name)}</p>
        {(meal.protein || meal.carbs || meal.fat) && (
          <div className="flex gap-3 text-xs text-slate-700 mb-2 font-normal">
            {meal.protein && <span>Protein: <span className="font-bold text-emerald-800">{meal.protein}g</span></span>}
            {meal.carbs && <span>Carbs: <span className="font-bold text-orange-800">{meal.carbs}g</span></span>}
            {meal.fat && <span>Fat: <span className="font-bold text-sky-800">{meal.fat}g</span></span>}
          </div>
        )}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="mt-2 mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 block">Ingredients</span>
            <div className="flex flex-wrap gap-1.5">
              {meal.ingredients.map((ing, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-300/80 text-slate-800 font-medium shadow-xs">
                  {cleanText(typeof ing === 'object' ? `${ing.quantity || ''} ${ing.item || ''}` : ing)}
                </span>
              ))}
            </div>
          </div>
        )}
        {meal.tips && (
          <p className="text-xs text-slate-700 mt-2 flex items-start gap-1.5 bg-orange-50/70 p-2.5 rounded-lg border border-orange-200">
            <Lightbulb className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{cleanText(meal.tips)}</span>
          </p>
        )}
      </div>
    </div>
  );
};
