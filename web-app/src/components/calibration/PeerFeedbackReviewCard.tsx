import React from 'react';
import { Check, AlertTriangle, Sparkles } from 'lucide-react';
import { Feedback } from '../../store/peopleStore';

interface PeerFeedbackReviewCardProps {
  fb: Feedback;
  isDarkMode: boolean;
  highlightText: (
    fullText: string,
    highlightPart: string,
    highlightClass: string,
    icon?: React.ReactNode
  ) => React.ReactNode;
  toggleFeedbackExpanded: (id: string) => void;
  setFeedbackBiasAccepted: (id: string, accepted: boolean) => void;
  setFeedbackBiasDismissed: (id: string, dismissed: boolean) => void;
}

export const PeerFeedbackReviewCard: React.FC<PeerFeedbackReviewCardProps> = ({
  fb,
  isDarkMode,
  highlightText,
  toggleFeedbackExpanded,
  setFeedbackBiasAccepted,
  setFeedbackBiasDismissed
}) => {
  const hasBiasFlag = !fb.biasAccepted && !fb.biasDismissed;

  return (
    <div className="space-y-3 pb-4 border-b border-slate-700/20 last:border-b-0 last:pb-0">
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {fb.reviewer}
        </span>
        {fb.biasAccepted && (
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <Check className="w-2.5 h-2.5" />
            <span>Audit Passed</span>
          </span>
        )}
        {!fb.biasAccepted && fb.biasDismissed && (
          <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Audit Dismissed
          </span>
        )}
        {hasBiasFlag && (
          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Bias Coded</span>
          </span>
        )}
      </div>

      {/* Feedback text area with active warning */}
      <div
        className={`relative border rounded-xl p-5 pb-9 font-sans leading-relaxed text-sm transition-all duration-500 ${
          isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-slate-350' : 'bg-slate-55 border-slate-205 text-slate-707'
        }`}
      >
        {fb.biasAccepted ? (
          <p>
            {highlightText(
              fb.rewrittenText,
              fb.rewrittenHighlight,
              "bg-emerald-500/10 text-emerald-600 px-1 border border-emerald-500/20 rounded font-medium"
            )}
          </p>
        ) : (
          <p>
            {highlightText(
              fb.originalText,
              fb.originalHighlight,
              "bg-amber-500/15 text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium inline-flex items-center space-x-1",
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 inline mr-0.5" />
            )}
          </p>
        )}

        {/* Bottom Right Expand/Collapse Toggle Button */}
        <button
          onClick={() => toggleFeedbackExpanded(fb.id)}
          className={`absolute bottom-2.5 right-2.5 p-1 rounded-lg border transition-all hover:scale-105 flex items-center justify-center cursor-pointer ${
            fb.isExpanded
              ? 'bg-primary/20 border-primary text-primary'
              : hasBiasFlag
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
              : isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-400'
              : 'bg-white border-slate-200 text-slate-505'
          }`}
          title={fb.isExpanded ? "Minimize suggestion" : "Expand suggestion"}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bias mitigation options - only visible when bias is detected and not resolved */}
      {hasBiasFlag && fb.isExpanded && (
        <div className="space-y-4 pt-3 pl-2 border-l-2 border-amber-500/30">
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Detected Bias Signal</span>
            </div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-705'}>{fb.biasExplanation}</p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>De-biased Alternative Suggestion</span>
            </div>
            <p className={isDarkMode ? 'text-slate-300 font-medium' : 'text-slate-800 font-semibold'}>
              {fb.rewrittenText}
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={() => setFeedbackBiasAccepted(fb.id, true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-xs font-semibold flex items-center space-x-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Correction</span>
            </button>
            <button
              onClick={() => setFeedbackBiasDismissed(fb.id, true)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-slate-700 hover:text-white cursor-pointer ${
                isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Dismiss Suggestion
            </button>
          </div>
        </div>
      )}

      {fb.biasAccepted && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="w-4.5 h-4.5 shrink-0" />
            <span>Bias correction applied successfully.</span>
          </div>
          <button
            onClick={() => setFeedbackBiasAccepted(fb.id, false)}
            className="text-[10px] font-semibold underline transition-colors hover:text-emerald-305 cursor-pointer"
          >
            Revert
          </button>
        </div>
      )}
    </div>
  );
};
