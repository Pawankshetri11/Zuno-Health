import React, { useState } from "react";
import { Sun, HeartPulse, RefreshCw, Sparkles, ChefHat, Info } from "lucide-react";
import { TimelineItem } from "@/lib/types/dashboard";
import { MealSubstitutionModal } from "./MealSubstitutionModal";

interface TimelineItemCardProps {
  item: TimelineItem;
  index: number;
  total: number;
  // Meal substitution props (optional — only when plan is active)
  mealIndex?: number;
  subscriptionId?: number;
  dayNumber?: number;
  changesRemaining?: number;
  swapDisabled?: boolean;
  onMealSubstituted?: (mealIndex: number, newMeal: any, updatedChangesCount: number) => void;
}

const renderBenefits = (benefits: any) => {
  if (!benefits) return null;
  let list = Array.isArray(benefits) ? benefits : [benefits];

  if (list.length === 0) return null;

  // Auto-correct AI behavior if it returns a single numbered string instead of an array
  if (list.length === 1 && typeof list[0] === "string" && list[0].includes("1.") && list[0].includes("2.")) {
    list = list[0].split(/\d+\.\s*/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  }

  return (
    <div className="mt-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/15 shadow-sm">
      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em] flex items-center gap-2 mb-2.5">
        <HeartPulse className="w-3.5 h-3.5" /> Therapeutic Goal Impact
      </span>
      <ul className="text-[11px] text-emerald-300/90 space-y-2">
        {list.map((step: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1 shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="leading-relaxed">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const TimelineItemCard: React.FC<TimelineItemCardProps> = ({
  item,
  index,
  total,
  mealIndex,
  subscriptionId,
  dayNumber,
  changesRemaining = 5,
  swapDisabled = false,
  onMealSubstituted,
}) => {
  const [showSubModal, setShowSubModal] = useState(false);

  // Compute macro targets from this meal (average of option_1 & option_2 if dual)
  const getMacroTargets = () => {
    if (item.option_1 && item.option_2) {
      return {
        calories: Math.round((parseFloat(item.option_1.calories) + parseFloat(item.option_2.calories)) / 2),
        protein:  Math.round((parseFloat(item.option_1.protein)  + parseFloat(item.option_2.protein))  / 2),
        carbs:    Math.round((parseFloat(item.option_1.carbs)    + parseFloat(item.option_2.carbs))    / 2),
        fat:      Math.round((parseFloat(item.option_1.fat)      + parseFloat(item.option_2.fat))      / 2),
      };
    }
    return {
      calories: parseFloat(String(item.calories || 0)),
      protein:  parseFloat(String(item.protein  || 0)),
      carbs:    parseFloat(String(item.carbs    || 0)),
      fat:      parseFloat(String(item.fat      || 0)),
    };
  };

  const canSubstitute =
    item.type !== "ritual" &&
    subscriptionId !== undefined &&
    dayNumber !== undefined &&
    mealIndex !== undefined &&
    onMealSubstituted &&
    changesRemaining > 0 &&
    !swapDisabled;

  return (
    <div className="flex gap-2 md:gap-4 group">
      <div className="flex flex-col items-center">
        <div className="w-12 md:w-16 py-1.5 bg-blue-50 rounded-xl text-[10px] md:text-xs font-bold text-center text-blue-700 border border-blue-200/90 shadow-sm shrink-0">
          {item.time}
        </div>
        {index < total - 1 && (
          <div className="w-px flex-1 bg-slate-200 my-2 group-hover:bg-blue-300 transition-colors" />
        )}
      </div>

      <div className="flex-1 pb-3 md:pb-4 overflow-hidden">
        <div
          className={`p-3.5 md:p-4 rounded-2xl border transition-all
          ${item.type === "ritual" ? "bg-gradient-to-b from-white to-blue-50/40 border-blue-200 shadow-[0_1.5px_3px_rgba(37,99,235,0.04),inset_0_1px_0_rgba(255,255,255,1)]" : "bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border-slate-200/90 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] hover:border-orange-300"}`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2 md:mb-3">
            <h4 className="font-medium text-sm md:text-base flex items-center gap-2 text-[#10243e] tracking-tight">
              {item.type === "ritual" && <Sun className="w-4 h-4 text-blue-500 shrink-0" />}
              {item.title}
            </h4>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {item.calories && (
                <span className="text-[10px] md:text-xs font-bold text-orange-600 px-2.5 py-0.5 md:py-1 bg-orange-50 rounded-full border border-orange-200/80">
                  {item.calories} kcal
                </span>
              )}
              {/* Change Meal Button */}
              {canSubstitute && (
                <button
                  onClick={() => setShowSubModal(true)}
                  title={`${changesRemaining} changes remaining`}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-2 py-0.5 rounded-lg transition-all hover:bg-blue-50"
                >
                  <RefreshCw className="w-3 h-3 text-blue-500" />
                  Change
                </button>
              )}
              {item.type !== "ritual" && subscriptionId !== undefined && !swapDisabled && changesRemaining === 0 && (
                <span className="text-[9px] text-red-400/60 border border-red-500/10 px-1.5 py-0.5 rounded-md">
                  Limit Reached
                </span>
              )}
              {item.type !== "ritual" && subscriptionId !== undefined && swapDisabled && (
                <span
                  title="You have already unlocked a later day, so swaps for this day are locked."
                  className="text-[9px] text-muted-foreground border border-border/70 px-1.5 py-0.5 rounded-md"
                >
                  Swap Locked
                </span>
              )}
            </div>
          </div>

          {item.name && <p className="text-primary font-medium mb-1">{item.name}</p>}

          {/* RITUAL ITEMS */}
          {item.type === "ritual" && item.items && (
            <div className="mt-3 space-y-3">
              {item.items.map((rit, i) => (
                <div key={i} className="p-3 bg-background/40 rounded-lg border border-blue-500/20">
                  <p className="font-bold text-blue-400 text-sm mb-1">
                    {rit.name}{" "}
                    <span className="text-xs font-normal text-muted-foreground ml-2">({rit.quantity})</span>
                  </p>
                  {rit.instruction && (
                    <p className="text-xs text-muted-foreground mb-2 whitespace-pre-line">{rit.instruction}</p>
                  )}
                  {renderBenefits(rit.benefit || rit.benefits)}
                </div>
              ))}
            </div>
          )}

          {/* MEAL OPTIONS — Original dual options */}
          {item.option_1 && item.option_2 ? (
            <div className="mt-3 space-y-4">
              <MealOption data={item.option_1} label="Option 1" />
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-xs text-muted-foreground font-semibold">OR</span>
                <div className="h-px bg-border flex-1"></div>
              </div>
              <MealOption data={item.option_2} label="Option 2" />
            </div>

          ) : item.option_1 && !item.option_2 ? (
            /* SUBSTITUTED MEAL — show quantities, macros, tips, benefits. No prep steps (food already cooked) */
            item.type !== "ritual" && (
              <div className="mt-3 space-y-3">
                {/* Substituted badge */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  AI Substituted Meal
                </div>

                {/* Meal name */}
                {item.option_1.name && (
                  <p className="font-bold text-[#10243e] text-sm">{item.option_1.name}</p>
                )}

                {/* Macro row */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] sm:text-[10px] bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1">
                    <span className="text-orange-500 font-bold">{item.option_1.calories}</span>
                    <span className="text-[8px] text-slate-500 uppercase tracking-tighter">kcal</span>
                  </div>
                  <span className="text-slate-300 mx-0.5">•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">{item.option_1.protein}g</span>
                    <span className="text-[8px] text-slate-400 uppercase">P</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-orange-600 font-bold">{item.option_1.carbs}g</span>
                    <span className="text-[8px] text-slate-400 uppercase">C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sky-600 font-bold">{item.option_1.fat}g</span>
                    <span className="text-[8px] text-slate-400 uppercase">F</span>
                  </div>
                </div>

                {/* Ingredient quantities — the main ask: "kitna khana hai" */}
                {item.option_1.ingredients?.length > 0 && (
                  <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-orange-600 mb-2">
                      How Much To Eat
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.option_1.ingredients.map((ing: any, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-orange-200 text-slate-800 font-medium shadow-xs"
                        >
                          {typeof ing === "object" ? `${ing.quantity || ""} ${ing.item || ""}` : ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity tip */}
                {item.option_1.quantity_tips && (
                  <div className="flex items-start gap-2 text-[10px] text-slate-600 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-orange-500 mt-0.5 shrink-0">💡</span>
                    <span>{item.option_1.quantity_tips}</span>
                  </div>
                )}

                {/* Goal impact / benefits */}
                {renderBenefits(item.option_1.benefits || item.option_1.benefit)}
              </div>
            )

          ) : (
            /* ORIGINAL simple meal (no options) */
            item.type !== "ritual" && (
              <>
                {(item.protein || item.carbs || item.fat) && (
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span>
                      Protein: <span className="text-slate-900 font-semibold">{item.protein}g</span>
                    </span>
                    <span>
                      • Carbs: <span className="text-slate-900 font-semibold">{item.carbs}g</span>
                    </span>
                    <span>
                      • Fat: <span className="text-slate-900 font-semibold">{item.fat}g</span>
                    </span>
                    {(item as any).fiber && (
                      <span>
                        • Fiber: <span className="text-blue-600 font-semibold">{(item as any).fiber}g</span>
                      </span>
                    )}
                  </div>
                )}
                {item.preparation_steps && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Preparation
                    </span>
                    <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1.5">
                      {item.preparation_steps.map((step, i) => (
                        <li key={i} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {renderBenefits(item.benefits || (item as any).benefit)}
              </>
            )
          )}
        </div>
      </div>

      {/* Meal Substitution Modal */}
      {showSubModal && subscriptionId !== undefined && dayNumber !== undefined && mealIndex !== undefined && (
        <MealSubstitutionModal
          isOpen={showSubModal}
          onClose={() => setShowSubModal(false)}
          mealTitle={item.title}
          mealIndex={mealIndex}
          macroTargets={getMacroTargets()}
          subscriptionId={subscriptionId}
          dayNumber={dayNumber}
          changesRemaining={changesRemaining}
          onSubstituted={(newMeal, updatedCount) => {
            onMealSubstituted!(mealIndex, newMeal, updatedCount);
          }}
        />
      )}
    </div>
  );
};

const MealOption = ({ data, label }: { data: any; label: string }) => (
  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
      <p className="font-bold text-[#10243e] text-xs sm:text-sm leading-tight">{label}: <span className="text-orange-600">{data.name}</span></p>
      <span className="text-[10px] bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-700 shrink-0 font-semibold shadow-2xs">{data.calories} kcal</span>
    </div>

    {/* ── Feature 3: Full macro breakdown per option ── */}
    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] sm:text-[10px] mb-3 bg-white px-2.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
      <span className="text-emerald-700 font-medium">P: <span className="font-bold text-emerald-800">{data.protein}g</span></span>
      <span className="text-orange-700 font-medium">C: <span className="font-bold text-orange-800">{data.carbs}g</span></span>
      <span className="text-sky-700 font-medium">F: <span className="font-bold text-sky-800">{data.fat}g</span></span>
      {data.fiber && <span className="text-blue-700 font-medium">Fiber: <span className="font-bold text-blue-800">{data.fiber}g</span></span>}
    </div>

    <div className="mt-2 flex flex-wrap gap-1.5 mb-3">
      {data.ingredients?.map((ing: any, i: number) => (
        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-orange-300 transition-colors shadow-2xs">
          {typeof ing === "object" ? `${ing.quantity || ""} ${ing.item || ""}` : ing}
        </span>
      ))}
    </div>

    {data.preparation_steps && data.preparation_steps.length > 0 && (
      <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2 mb-3">
          <ChefHat className="w-3.5 h-3.5 text-blue-600" /> Culinary Preparation Guide
        </span>
        <ul className="text-[11px] text-slate-600 space-y-2.5">
          {data.preparation_steps.map((step: string, i: number) => (
            <li key={i} className="flex items-start gap-3 group/step">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[9px] font-bold shrink-0 mt-0.5 group-hover/step:bg-blue-600 group-hover/step:text-white transition-all">
                {i + 1}
              </span>
              <span className="leading-relaxed text-slate-700 transition-colors">
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {renderBenefits(data.benefits || data.benefit)}
  </div>
);
