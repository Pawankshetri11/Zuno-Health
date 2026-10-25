import React from "react";
import { Sparkles, Droplets, Target, TrendingDown, TrendingUp, Minus, Clock, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DayPlan, UserData } from "@/lib/types/dashboard";

interface DailySummaryProps {
  currentDayPlan: DayPlan;
  targetCalories: number;
  userData?: UserData | null;
  printMode?: boolean;
}

const GOAL_LABELS: Record<string, string> = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Gain",
  "maintenance": "Maintenance",
  "general-fitness": "General Fitness",
};

export const DailySummary: React.FC<DailySummaryProps> = ({
  currentDayPlan,
  targetCalories,
  userData,
  printMode = false,
}) => {
  if (!currentDayPlan?.is_unlocked || !currentDayPlan?.meal_plan) {
    return (
      <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]" data-aos="fade-up" data-aos-delay="400">
        <CardHeader>
          <CardTitle className="text-base font-medium text-[#10243e] tracking-tight">Daily Summary</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-slate-500 text-xs font-medium">Unlock today's plan to see your daily summary</p>
        </CardContent>
      </Card>
    );
  }

  const { meal_plan } = currentDayPlan;

  // Parse target stats from AI
  let actual = {
    calories: parseFloat(meal_plan.target_stats?.calories || "0"),
    protein:  parseFloat(meal_plan.target_stats?.protein  || "0"),
    carbs:    parseFloat(meal_plan.target_stats?.carbs    || "0"),
    fat:      parseFloat(meal_plan.target_stats?.fat      || "0"),
    fiber:    parseFloat(meal_plan.target_stats?.fiber    || "0"),
  };

  // Fallback: sum meals if AI target_stats missing
  if (actual.calories === 0) {
    if (meal_plan.timeline) {
      meal_plan.timeline.forEach((item) => {
        if (item.option_1 && item.option_2) {
          actual.calories += (parseFloat(item.option_1.calories) + parseFloat(item.option_2.calories)) / 2;
          actual.protein  += (parseFloat(item.option_1.protein)  + parseFloat(item.option_2.protein))  / 2;
          actual.carbs    += (parseFloat(item.option_1.carbs)    + parseFloat(item.option_2.carbs))    / 2;
          actual.fat      += (parseFloat(item.option_1.fat)      + parseFloat(item.option_2.fat))      / 2;
          actual.fiber    += (parseFloat(item.option_1.fiber || 0) + parseFloat(item.option_2.fiber || 0)) / 2;
        } else if (item.calories) {
          actual.calories += parseFloat(String(item.calories));
          actual.protein  += parseFloat(String(item.protein || 0));
          actual.carbs    += parseFloat(String(item.carbs   || 0));
          actual.fat      += parseFloat(String(item.fat     || 0));
          actual.fiber    += parseFloat(String((item as any).fiber || 0));
        }
      });
    } else if (meal_plan.meals) {
      meal_plan.meals.forEach((m) => {
        actual.calories += m.calories;
        actual.protein  += m.protein || 0;
        actual.carbs    += m.carbs   || 0;
        actual.fat      += m.fat     || 0;
        actual.fiber    += m.fiber   || 0;
      });
    }
  }

  const displayCalories = Math.round(actual.calories);

  // Surplus/Deficit Calculation  
  const difference  = displayCalories - targetCalories;
  const isDeficit   = difference < 0;
  const isSurplus   = difference > 0;
  const goal        = userData?.goal || "maintenance";
  const isOnTrack   = goal === "weight-loss"
    ? isDeficit
    : goal === "muscle-gain"
    ? isSurplus
    : Math.abs(difference) < 100;

  // User profile data
  const currentWeight = userData?.weight;
  const targetWeight  = userData?.extended_data?.expectedWeight
    ? parseFloat(String(userData.extended_data.expectedWeight))
    : null;
  const weightDiff    = currentWeight && targetWeight ? Math.abs(currentWeight - targetWeight) : null;
  const weightAction  = goal === "weight-loss" ? "to lose" : goal === "muscle-gain" ? "to gain" : "to maintain";

  // Special desires
  const dietType           = userData?.extended_data?.dietType;
  const foodsDislike       = userData?.extended_data?.foodsDislike;
  const specialInstructions = userData?.extended_data?.specialInstructions;
  const allergies          = userData?.allergies;
  const dietaryRestrictions = userData?.dietary_restrictions;

  const hasSpecialDesires = dietType?.length || foodsDislike || specialInstructions || allergies || dietaryRestrictions?.length;


  return (
    <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]" data-aos="fade-up" data-aos-delay="400">
      <CardHeader>
        <CardTitle className="text-base font-medium text-[#10243e] tracking-tight">Daily Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* ── Feature 4: Target Weight Card ── */}
        {currentWeight && targetWeight && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weight Progress</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base font-bold text-[#10243e]">{currentWeight} kg</p>
                <p className="text-[10px] text-slate-500 font-medium">Current</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full h-px bg-slate-200 relative">
                  <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-slate-400 bg-slate-50 px-1">→</span>
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-orange-500">{targetWeight} kg</p>
                <p className="text-[10px] text-slate-500 font-medium">Target</p>
              </div>
            </div>
            {weightDiff !== null && weightDiff > 0 && (
              <p className="text-center text-xs text-slate-600">
                <span className="text-orange-500 font-bold">{weightDiff} kg</span> {weightAction}
              </p>
            )}
          </div>
        )}

        {/* ── Feature 1: Goal + Special Desires ── */}
        {userData?.goal && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Goal</p>
              <span className="text-xs font-bold text-blue-700 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                {GOAL_LABELS[goal] || goal}
              </span>
            </div>

            {hasSpecialDesires && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dietary Preferences</p>
                <div className="flex flex-wrap gap-1.5">
                  {dietType?.map((d: string, i: number) => (
                    <span key={i} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                      {d}
                    </span>
                  ))}
                  {dietaryRestrictions?.map((r: string, i: number) => (
                    <span key={i} className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                      {r}
                    </span>
                  ))}
                  {allergies && (
                    <span key="allergy" className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600">
                      Allergy: {allergies}
                    </span>
                  )}
                </div>
                {(foodsDislike || specialInstructions) && (
                  <ul className="text-xs text-slate-600 space-y-0.5 mt-1">
                    {foodsDislike && <li>• Dislikes: <span className="text-slate-800 font-medium">{foodsDislike}</span></li>}
                    {specialInstructions && <li>• Note: <span className="text-slate-800 font-medium">{specialInstructions}</span></li>}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}


        {/* ── Feature 3: Calorie + Surplus/Deficit ── */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Calories (Actual / Target)
            </span>
            <span className={`font-bold text-sm ${displayCalories < targetCalories * 0.9 ? "text-amber-500" : "text-emerald-600"}`}>
              {displayCalories} / {targetCalories}
            </span>
          </div>

          {/* Surplus/Deficit status bar */}
          {difference !== 0 && (
            <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl
              ${isOnTrack ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
              {isDeficit ? (
                <TrendingDown className={`w-3.5 h-3.5 ${isOnTrack ? "text-emerald-600" : "text-amber-600"}`} />
              ) : isSurplus ? (
                <TrendingUp className={`w-3.5 h-3.5 ${isOnTrack ? "text-emerald-600" : "text-orange-500"}`} />
              ) : (
                <Minus className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>
                {isDeficit ? `${Math.abs(difference)} kcal deficit` : `${difference} kcal surplus`}
                {" · "}
                <span className="font-bold">{isOnTrack ? "On Track" : "Adjust Intake"}</span>
              </span>
            </div>
          )}
        </div>

        {/* ── Feature 3: Macro Grid (with Fiber) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-base md:text-xl font-bold text-emerald-600">
              {Math.round(actual.protein) || parseFloat(meal_plan.target_stats?.protein || "0") || 0}g
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Protein</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-base md:text-xl font-bold text-orange-500">
              {Math.round(actual.carbs) || parseFloat(meal_plan.target_stats?.carbs || "0") || 0}g
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Carbs</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-base md:text-xl font-bold text-sky-500">
              {Math.round(actual.fat) || parseFloat(meal_plan.target_stats?.fat || "0") || 0}g
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Fat</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <p className="text-base md:text-xl font-bold text-blue-600">
              {Math.round(actual.fiber) || parseFloat(meal_plan.target_stats?.fiber || "0") || 0}g
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Fiber</p>
          </div>
        </div>

        {meal_plan.day_summary && (
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80">
            <h4 className="text-sm font-bold text-orange-600 mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Professional Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">{meal_plan.day_summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 pt-2">
          {meal_plan.daily_dos && (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-sm font-semibold text-green-500 mb-2 flex items-center gap-2">✅ Daily Do's</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {meal_plan.daily_dos.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          )}
          {meal_plan.daily_donts && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <h4 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-2">❌ Daily Don'ts</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {meal_plan.daily_donts.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          )}
        </div>

        {meal_plan.water_intake && (
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400">
                <Droplets className="h-5 w-5" />
                <span className="font-semibold text-sm">Hydration Plan</span>
              </div>
              {/* Total liters badge */}
              {typeof meal_plan.water_intake === 'object' && (meal_plan.water_intake as any).total_liters && (
                <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  {(meal_plan.water_intake as any).total_liters}L / day
                </span>
              )}
            </div>

            {/* Old string format fallback */}
            {typeof meal_plan.water_intake === 'string' && (
              <p className="text-xs text-muted-foreground">{meal_plan.water_intake}</p>
            )}

            {/* New structured object format */}
            {typeof meal_plan.water_intake === 'object' && (
              <>
                {/* Schedule */}
                {(meal_plan.water_intake as any).schedule?.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400/70 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Intake Schedule
                    </p>
                    <ul className="space-y-1">
                      {(meal_plan.water_intake as any).schedule.map((s: string, i: number) => (
                        <li key={i} className="text-[10px] text-blue-200/80 flex items-start gap-1.5">
                          <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {(meal_plan.water_intake as any).tips?.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-blue-500/10">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-blue-400/70 flex items-center gap-1">
                      <Lightbulb className="w-2.5 h-2.5" /> Hydration Tips
                    </p>
                    <ul className="space-y-1">
                      {(meal_plan.water_intake as any).tips.map((t: string, i: number) => (
                        <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                          <span className="text-blue-400 mt-0.5 shrink-0">✦</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
