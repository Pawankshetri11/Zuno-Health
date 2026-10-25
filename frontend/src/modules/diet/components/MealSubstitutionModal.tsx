import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X, ChefHat, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealSubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealTitle: string;
  mealIndex: number;
  macroTargets: MacroTargets;
  subscriptionId: number;
  dayNumber: number;
  changesRemaining: number;
  onSubstituted: (newMeal: any, updatedChangesCount: number) => void;
}

export const MealSubstitutionModal: React.FC<MealSubstitutionModalProps> = ({
  isOpen,
  onClose,
  mealTitle,
  mealIndex,
  macroTargets,
  subscriptionId,
  dayNumber,
  changesRemaining,
  onSubstituted,
}) => {
  const [userHas, setUserHas] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubstitute = async () => {
    if (!userHas.trim()) {
      toast.error("Please tell us what food you have available.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await api.dietPlans.substituteMeal({
        subscription_id: subscriptionId,
        day_number: dayNumber,
        meal_index: mealIndex,
        user_has: userHas.trim(),
        target_macros: macroTargets,
      });
      if (result.meal) {
        toast.success("Meal substituted successfully!");
        onSubstituted(result.meal, result.changes_remaining);
        onClose();
      } else {
        toast.error(result.error || "Could not generate substitution.");
      }
    } catch (e: any) {
      toast.error("Substitution failed: " + (e.message || "Server error"));
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#10243e]">Change Meal</h2>
              <p className="text-xs text-slate-500">{mealTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Macro Targets */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Meal Targets (AI will match these)
          </p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Calories", value: `${macroTargets.calories} kcal`, color: "text-orange-500" },
              { label: "Protein", value: `${macroTargets.protein}g`, color: "text-emerald-600" },
              { label: "Carbs", value: `${macroTargets.carbs}g`, color: "text-orange-600" },
              { label: "Fat", value: `${macroTargets.fat}g`, color: "text-sky-600" },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
              >
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              What food do you have available?
            </label>
            <textarea
              value={userHas}
              onChange={(e) => setUserHas(e.target.value)}
              placeholder="e.g., I have dal, rice and sabzi at home... or I have eggs, bread and milk available..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white resize-none transition-colors"
            />
          </div>

          {/* Changes remaining badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span>
                <span className={`font-bold ${changesRemaining <= 1 ? "text-red-500" : "text-orange-600"}`}>
                  {changesRemaining}
                </span>{" "}
                changes remaining today
              </span>
            </div>
          </div>

          <Button
            onClick={handleSubstitute}
            disabled={isLoading || !userHas.trim()}
            className="w-full h-11 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(249,115,22,0.25)] disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI is calculating quantities...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Substitute & Calculate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
