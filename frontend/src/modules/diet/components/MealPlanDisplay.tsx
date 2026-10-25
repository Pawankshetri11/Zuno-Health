import React, { useState } from "react";
import { Lock, Unlock, Sparkles, Utensils, Crown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DayPlan } from "@/lib/types/dashboard";
import { TimelineItemCard } from "./TimelineItemCard";
import { MealCard } from "./MealCard";
import { EarlyUnlockConfirmModal } from "./EarlyUnlockConfirmModal";
import {
  isEarlyUnlock,
  getScheduledDateForDay,
  formatShortDate,
  isSwapDisabledForDay,
} from "@/lib/utils/diet";

interface MealPlanDisplayProps {
  currentDayPlan: DayPlan | null;
  selectedDay: number;
  dayPlans: DayPlan[];
  canUnlockDay: (day: DayPlan, index: number) => boolean;
  unlockTodaysPlan: () => void;
  isGenerating: boolean;
  pendingTimer: boolean;
  timeLeft: string;
  isTimerExpired: boolean;
  handleTimerExpiryUnlock: () => void;
  userData: any;
  activePlanType?: string | null;
  onMealSubstituted?: (mealIndex: number, newMeal: any, updatedChangesCount: number) => void;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({
  currentDayPlan,
  selectedDay,
  dayPlans,
  canUnlockDay,
  unlockTodaysPlan,
  isGenerating,
  pendingTimer,
  timeLeft,
  isTimerExpired,
  handleTimerExpiryUnlock,
  userData,
  activePlanType,
  onMealSubstituted,
}) => {
  const [showEarlyConfirm, setShowEarlyConfirm] = useState(false);

  if (!currentDayPlan) return null;

  const isPurchased = (currentDayPlan as any).is_purchased;
  const changesRemaining = 5 - (currentDayPlan.meal_changes_count || 0);
  const swapDisabled = isSwapDisabledForDay(currentDayPlan, dayPlans);

  const handleUnlockClick = () => {
    if (isEarlyUnlock(currentDayPlan, dayPlans)) {
      setShowEarlyConfirm(true);
    } else {
      unlockTodaysPlan();
    }
  };

  const scheduledDate = getScheduledDateForDay(currentDayPlan.day_number, dayPlans);
  const scheduledLabel = scheduledDate ? formatShortDate(scheduledDate) : "";
  // The day the user is presently on (latest unlocked day_number)
  const currentUnlockedDayNumber =
    [...dayPlans]
      .filter((p) => p.is_unlocked)
      .map((p) => p.day_number)
      .sort((a, b) => b - a)[0] || (currentDayPlan.day_number - 1);

  // Reusable modal — rendered in whichever branch returns
  const earlyUnlockModal = (
    <EarlyUnlockConfirmModal
      isOpen={showEarlyConfirm}
      onClose={() => setShowEarlyConfirm(false)}
      onConfirm={() => {
        setShowEarlyConfirm(false);
        unlockTodaysPlan();
      }}
      dayNumber={currentDayPlan.day_number}
      scheduledDateLabel={scheduledLabel}
      currentDayNumber={currentUnlockedDayNumber}
    />
  );

  if (!currentDayPlan.is_unlocked) {
    return (
      <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-3xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]" data-aos="fade-up" data-aos-delay="300">
        <CardContent className="p-5 md:p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-white to-orange-50/80 flex items-center justify-center mx-auto mb-4 border border-orange-200/90 shadow-[0_2px_4px_rgba(249,115,22,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
            {!isPurchased ? (
               <Utensils className="h-6 w-6 text-slate-400" />
            ) : canUnlockDay(currentDayPlan, selectedDay) ? (
              <Unlock className="h-6 w-6 text-orange-500" />
            ) : (
              <Lock className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <h2 className="text-xl font-medium mb-2 tracking-tight text-[#10243e]">Day {currentDayPlan.day_number} Plan</h2>
          
          {!isPurchased ? (
            <div className="space-y-4">
               <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed font-medium">This day is not included in your current subscription. Upgrade your plan to unlock all 30 days of precision nutrition.</p>
               <Button
                onClick={() => {
                   window.location.href = `/pricing`;
                 }}
                className="bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white font-medium text-xs uppercase tracking-[0.14em] px-6 rounded-xl shadow-[0_2.5px_6px_rgba(249,115,22,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.65)] hover:brightness-105 whitespace-normal h-auto py-3 transition-all"
               >
                 Upgrade & Unlock Day {currentDayPlan.day_number}
               </Button>
            </div>
          ) : canUnlockDay(currentDayPlan, selectedDay) ? (
            pendingTimer && !isTimerExpired ? (
              <div className="mb-4">
                <Sparkles className="h-8 w-8 text-blue-500 animate-pulse mx-auto mb-3" />
                <h3 className="text-base font-medium text-[#10243e] mb-1.5">Our Experts Are Curating Your Plan</h3>
                <div className="bg-gradient-to-b from-white to-slate-50 p-3.5 rounded-xl border border-slate-200 inline-block min-w-[160px] shadow-sm">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">Estimated Time</p>
                  <p className="text-xl font-mono text-orange-500 font-bold">{timeLeft}</p>
                </div>
              </div>
            ) : isTimerExpired ? (
              <Button onClick={handleTimerExpiryUnlock} disabled={isGenerating} className="bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white whitespace-normal h-auto py-3 px-6 font-medium text-xs uppercase tracking-[0.14em] rounded-xl shadow-[0_2.5px_6px_rgba(249,115,22,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.65)] hover:brightness-105 transition-all">
                {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                View Your Plan
              </Button>
            ) : (
              (userData as any)?.is_placeholder ? (
                <Button onClick={() => window.location.href='/health-metrics'} className="bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white whitespace-normal h-auto py-3 px-6 font-medium text-xs uppercase tracking-[0.14em] rounded-xl shadow-[0_2.5px_6px_rgba(249,115,22,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.65)] hover:brightness-105 transition-all">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Complete Health Data to Unlock
                </Button>
              ) : (
                <Button onClick={handleUnlockClick} disabled={isGenerating} className="bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white whitespace-normal h-auto py-3 px-6 min-h-[42px] font-medium text-xs uppercase tracking-[0.14em] rounded-xl shadow-[0_2.5px_6px_rgba(249,115,22,0.4),inset_0_1.5px_1px_rgba(255,255,255,0.65)] hover:brightness-105 transition-all">
                  {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {(!activePlanType || activePlanType === "trial")
                    ? "Get Your Free Diet Plan"
                    : "Get Your Diet Plan for Today"}
                </Button>
              )
            )
          ) : (
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <p className="text-orange-500 font-bold text-base md:text-lg">
                        Best to finish Day {currentDayPlan.day_number - 1} first
                    </p>
                    <p className="text-slate-500 text-xs italic max-w-sm mx-auto leading-relaxed">
                        Completing your previous day's plan and check-in helps the AI tune Day {currentDayPlan.day_number}'s meals to what worked for you.
                    </p>
                </div>

                <div className="pt-2 flex flex-col items-center gap-2">
                    <Button
                        onClick={handleUnlockClick}
                        disabled={isGenerating}
                        className="bg-orange-500 hover:bg-orange-600 text-white whitespace-normal h-auto py-3 px-6 font-bold text-sm tracking-wide rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.25)] transition-all"
                    >
                        {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
                        Unlock Day {currentDayPlan.day_number} Early
                    </Button>
                    <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                        You can unlock now, but Day {currentDayPlan.day_number - 1}'s swap meal will be disabled.
                    </p>
                </div>
            </div>
          )}
        </CardContent>
        {earlyUnlockModal}
      </Card>
    );
  }

  if (!currentDayPlan.meal_plan) return null;

  return (
    <Card className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-3xl shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]" data-aos="fade-up" data-aos-delay="300">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-medium flex items-center gap-2 text-[#10243e] tracking-tight">
          {currentDayPlan.meal_plan.day_title ? (
            <><Crown className="h-5 w-5 text-orange-500 shrink-0" />{currentDayPlan.meal_plan.day_title}</>
          ) : (
            <><Utensils className="h-4 w-4 text-orange-500 shrink-0" />Day {currentDayPlan.day_number} Meal Plan</>
          )}
        </CardTitle>
        {currentDayPlan.meal_plan.daily_objectives && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target className="w-16 h-16 text-blue-600" />
            </div>
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-100/70 text-blue-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              Strategic Day Objectives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10 font-medium">
              {currentDayPlan.meal_plan.daily_objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all">
                   <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                   </div>
                   <span className="text-xs text-slate-700 leading-relaxed">{String(obj)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {currentDayPlan.meal_plan.timeline ? (
          currentDayPlan.meal_plan.timeline.map((item, index) => (
            <TimelineItemCard
              key={index}
              item={item}
              index={index}
              total={currentDayPlan.meal_plan?.timeline?.length || 0}
              mealIndex={index}
              subscriptionId={currentDayPlan.subscription_id}
              dayNumber={currentDayPlan.day_number}
              changesRemaining={changesRemaining}
              swapDisabled={swapDisabled}
              onMealSubstituted={onMealSubstituted}
            />
          ))
        ) : (
          currentDayPlan.meal_plan.meals.map((meal, index) => (
            <MealCard key={index} meal={meal} index={index} />
          ))
        )}
      </CardContent>
    </Card>
  );
};
