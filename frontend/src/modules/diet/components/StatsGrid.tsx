import React from "react";
import { Flame, Calculator, CalendarDays, Crown } from "lucide-react";
import { UserData } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  targetCalories: number;
  selectedDay: number;
  calculateBMI: () => string;
  userData: UserData;
  hasActiveSub: boolean;
  activePlanType: string | null;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  targetCalories,
  selectedDay,
  calculateBMI,
  userData,
  hasActiveSub,
  activePlanType
}) => {
  const isRealUser = !(userData as any).is_placeholder;

  // Capitalize activePlanType safely
  const planDisplay = activePlanType 
    ? (activePlanType.charAt(0).toUpperCase() + activePlanType.slice(1).toLowerCase())
    : (hasActiveSub ? "Active" : "Trial");

  const stats = [
    { 
      icon: Flame, 
      label: "TARGET", 
      value: (hasActiveSub && isRealUser) ? `${targetCalories}` : "---", 
      unit: "kcal", 
      plate: "bg-gradient-to-b from-[#ff8736] via-[#f97316] to-[#dc5c09] text-white shadow-[0_2px_4px_rgba(249,115,22,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] border-t border-white/40"
    },
    { 
      icon: Calculator, 
      label: "BMI", 
      value: (hasActiveSub && isRealUser) ? calculateBMI() : "--.-", 
      unit: "", 
      plate: "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_2px_4px_rgba(37,99,235,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]"
    },
    { 
      icon: CalendarDays, 
      label: "DAY", 
      value: `${selectedDay + 1}`, 
      unit: "", 
      plate: "bg-gradient-to-b from-sky-500 to-sky-600 text-white shadow-[0_2px_4px_rgba(14,165,233,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]"
    },
    { 
      icon: Crown, 
      label: "PLAN", 
      value: planDisplay, 
      unit: "", 
      plate: "bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-[0_2px_4px_rgba(245,158,11,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)]"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-gradient-to-b from-white via-[#fcfdff] to-[#f8fbff] border border-slate-200/90 rounded-2xl px-4 py-3 shadow-[0_2.5px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)]"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white", stat.plate)}>
              <stat.icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.16em] uppercase">{stat.label}</span>
          </div>
          <div className="text-lg font-medium text-[#10243e] tabular-nums leading-tight">
            {stat.value}{stat.unit && <span className="text-[10px] text-slate-500 font-medium ml-1">{stat.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};
