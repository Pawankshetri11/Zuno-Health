import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Lock, LockOpen } from "lucide-react";
import { DayPlan } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
  dayPlans: DayPlan[];
  selectedDay: number;
  setSelectedDay: (index: number) => void;
  canUnlockDay: (day: DayPlan, index: number) => boolean;
  getLocalISODate: () => string;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  dayPlans,
  selectedDay,
  setSelectedDay,
  canUnlockDay,
  getLocalISODate
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollDays = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        onClick={() => scrollDays('left')}
        className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] transition-all"
        aria-label="Previous days"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div 
        ref={scrollContainerRef} 
        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
      >
        {dayPlans.map((day, index) => {
          const isPurchased = (day as any).is_purchased;
          const isUnlocked = day.is_unlocked;
          const isSelected = selectedDay === index;
          
          return (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(index)}
              className={cn(
                "flex-shrink-0 h-9 px-4 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5",
                isSelected 
                  ? "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] border-t border-white/40 text-white shadow-[0_2.5px_5px_rgba(249,115,22,0.42),inset_0_1.5px_1px_rgba(255,255,255,0.65),inset_0_-1.5px_1px_rgba(0,0,0,0.28)]" 
                  : isPurchased
                    ? isUnlocked 
                      ? "bg-gradient-to-b from-white to-[#f8fbff] border-slate-200/90 text-slate-700 hover:border-orange-300 hover:text-orange-600 shadow-[0_1.5px_2px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]"
                      : "bg-gradient-to-b from-white to-slate-50 border-slate-200/80 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                    : "bg-slate-50 border-slate-200/80 opacity-60 text-slate-400 hover:opacity-100 hover:border-slate-300"
              )}
            >
              {!isPurchased ? <Lock className="h-3 w-3 opacity-60" /> : isUnlocked ? <LockOpen className="h-3 w-3 text-emerald-500" /> : <Lock className="h-3 w-3" />}
              Day {day.day_number}
              {!isPurchased && <span className="ml-1 text-[9px] font-bold text-orange-600 uppercase">Buy</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scrollDays('right')}
        className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-b from-white to-slate-100 border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-300 shadow-[0_1.5px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] transition-all"
        aria-label="Next days"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
