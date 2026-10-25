import React from "react";
import ReactDOM from "react-dom";
import { Sun, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckinData } from "@/lib/types/dashboard";

interface CheckinModalProps {
  checkinData: CheckinData;
  setCheckinData: (data: CheckinData) => void;
  processUnlock: (skip: boolean) => void;
  langOptions: string[];
  onClose?: () => void;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  checkinData,
  setCheckinData,
  processUnlock,
  langOptions,
  onClose
}) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <Card className="w-full sm:max-w-md bg-white border-slate-200 shadow-2xl rounded-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-slate-100 bg-white sticky top-0 z-10 flex flex-row items-center justify-between gap-3 pr-3 py-4">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2.5 min-w-0 text-[#10243e]">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
              <Sun className="h-4.5 w-4.5 text-orange-600" />
            </div>
            <span className="truncate">Check-in & Customize</span>
          </CardTitle>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            Help our AI expert personalize your plan by selecting your preferred language and current symptoms.
          </p>

          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Response Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {langOptions.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCheckinData({ ...checkinData, language: lang })}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    checkinData.language === lang
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-2xs font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              2. How are you feeling today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {['Energy Low', 'Stress', 'Bloating'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const currentNotes = checkinData.notes || "";
                    if (currentNotes.includes(tag)) {
                      setCheckinData({ ...checkinData, notes: currentNotes.replace(new RegExp(`${tag}(,\\s*)?`), "").trim().replace(/^,\s*|,\s*$/, "") });
                    } else {
                      setCheckinData({ ...checkinData, notes: currentNotes ? `${currentNotes}, ${tag}` : tag });
                    }
                  }}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    checkinData.notes?.includes(tag)
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-2xs font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              3. Custom Notes (Quantities, Likings, etc.)
            </label>
            <textarea
              className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50 h-20 sm:h-24 resize-none focus:outline-none focus:border-orange-500 focus:bg-white text-xs placeholder:text-slate-400 text-slate-800 transition-colors"
              placeholder="e.g., I'm at my friend's house, please suggest accordingly..."
              value={checkinData.notes}
              onChange={(e) => setCheckinData({ ...checkinData, notes: e.target.value })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="flex-1 h-12 text-xs font-semibold border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700" onClick={() => processUnlock(true)}>
              Default Plan
            </Button>
            <Button className="flex-1 h-12 text-xs font-bold uppercase tracking-wider rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.25)] transition-all" onClick={() => processUnlock(false)}>
              Generate Personalized
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
};

