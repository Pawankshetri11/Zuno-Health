import React from "react";
import ReactDOM from "react-dom";
import { Unlock, MessageSquare, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EarlyUnlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dayNumber: number;
  scheduledDateLabel: string;   // e.g. "16 May"
  currentDayNumber: number;     // the day they're presently on (Day N-1)
}

export const EarlyUnlockConfirmModal: React.FC<EarlyUnlockConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  dayNumber,
  scheduledDateLabel,
  currentDayNumber,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 md:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3 border border-orange-200">
            <Unlock className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-[#10243e] mb-1.5">
            Unlock Day {dayNumber} now?
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Day {dayNumber} was scheduled to unlock on {scheduledDateLabel}. You can
            unlock it now, but read the trade-offs below first.
          </p>
        </div>

        {/* Trade-offs */}
        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center border border-amber-300">
              <MessageSquare className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#10243e] mb-1">
                Skipping feedback hurts personalisation
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Finishing today's plan and submitting feedback helps the AI tune
                tomorrow's meals to what worked for you. Unlocking early skips
                that signal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50/60 border border-red-200/60">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center border border-red-200">
              <RefreshCw className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#10243e] mb-1">
                Swap meal will be disabled on your current day
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Once Day {dayNumber} is unlocked, you can no longer swap meals
                on Day {currentDayNumber}. Future swaps will only work on Day{" "}
                {dayNumber}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
            <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-300">
              <Clock className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-emerald-800 mb-1">
                Better: unlock after dinner tonight
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Eating today's full plan first gives the AI complete data —
                weight check-in, mood, energy, what you actually ate. Unlocking
                before dinner throws away half of tomorrow's personalisation
                signal.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            size="lg"
            onClick={onConfirm}
            className="w-full font-bold text-sm tracking-wide bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.25)] transition-all"
          >
            <Unlock className="mr-2 h-4 w-4" />
            Unlock Day {dayNumber} now
          </Button>
          <button
            onClick={onClose}
            className="w-full text-xs text-slate-500 hover:text-slate-800 py-2 transition-colors font-medium"
          >
            I'll wait and give feedback first
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
