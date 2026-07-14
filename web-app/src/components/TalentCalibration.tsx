import React from 'react';
import { 
  Minimize2, 
  Maximize2, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp 
} from 'lucide-react';
import { usePeopleStore } from '../store/peopleStore';
import { ALIGNMENT_DATA_MAP } from '../App';
import { EmployeeSearchDropdown } from './EmployeeSearchDropdown';

interface TalentCalibrationProps {
  isDarkMode: boolean;
  isResponsiveMode: boolean;
  calibrateLeftWidth: number;
  startResizingCalibrate: (e: React.MouseEvent) => void;
  isResizingCalibrate: boolean;
  cardClass: string;
}

export const TalentCalibration: React.FC<TalentCalibrationProps> = ({
  isDarkMode,
  isResponsiveMode,
  calibrateLeftWidth,
  startResizingCalibrate,
  isResizingCalibrate,
  cardClass,
}) => {
  // Store state and actions
  const employees = usePeopleStore(state => state.employees);
  const selectedCalibrateCandidateId = usePeopleStore(state => state.selectedCalibrateCandidateId);
  const setSelectedCalibrateCandidateId = usePeopleStore(state => state.setSelectedCalibrateCandidateId);
  const feedbacksMap = usePeopleStore(state => state.feedbacksMap);
  const toggleFeedbackExpanded = usePeopleStore(state => state.toggleFeedbackExpanded);
  const toggleAllFeedbacksExpanded = usePeopleStore(state => state.toggleAllFeedbacksExpanded);
  const setFeedbackBiasAccepted = usePeopleStore(state => state.setFeedbackBiasAccepted);
  const setFeedbackBiasDismissed = usePeopleStore(state => state.setFeedbackBiasDismissed);

  const selectedCalibrateCandObj = employees.find(e => e.id === selectedCalibrateCandidateId) || employees[0];

  const highlightText = (fullText: string, highlightPart: string, highlightClass: string, icon?: React.ReactNode) => {
    if (!highlightPart) return fullText;
    const index = fullText.indexOf(highlightPart);
    if (index === -1) return fullText;

    const before = fullText.slice(0, index);
    const after = fullText.slice(index + highlightPart.length);

    return (
      <>
        {before}
        <span className={highlightClass}>
          {icon}
          {highlightPart}
        </span>
        {after}
      </>
    );
  };

  if (!selectedCalibrateCandObj) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading calibration data…</span>
      </div>
    );
  }

  const alignmentData = ALIGNMENT_DATA_MAP[selectedCalibrateCandObj.id] || ALIGNMENT_DATA_MAP['emp_002'];

  return (
    <div className={`flex-1 flex min-h-0 relative ${isResponsiveMode ? 'flex-col space-y-4' : 'flex-row space-x-2'}`}>

      {/* LEFT COLUMN: Calibration Candidate selector + Peer Feedback Auditor */}
      <div
        style={isResponsiveMode ? {} : { width: `${calibrateLeftWidth}px` }}
        className={`shrink-0 flex flex-col ${isResponsiveMode ? 'w-full' : 'h-full'} gap-3`}
      >
        <EmployeeSearchDropdown
          isDarkMode={isDarkMode}
          label="Calibration Candidate"
          selectedValue={selectedCalibrateCandidateId}
          onSelect={setSelectedCalibrateCandidateId}
          employees={employees}
          badgeSelector={(emp) => emp.target_job}
          badgeClass="bg-amber-500/10 text-amber-400 border-amber-500/20"
          dropdownContainerClass={`shrink-0 ${cardClass} py-3 px-4 z-20`}
        />

        {/* Peer Feedback Auditor Card */}
        <div className={`flex-1 space-y-6 ${cardClass} ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto min-h-0 pr-3'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display font-semibold text-base mb-1">Peer Feedback Auditor</h3>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedCalibrateCandObj.department} · {selectedCalibrateCandObj.target_job}</span>
            </div>

            <button
              onClick={toggleAllFeedbacksExpanded}
              className={`p-1.5 rounded-lg border transition-all duration-300 hover:scale-105 flex items-center space-x-1 cursor-pointer text-[10px] font-bold ${(feedbacksMap[selectedCalibrateCandObj.id] || []).some(fb => fb.isExpanded)
                ? 'bg-primary/10 border-primary/30 text-primary'
                : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm')
                }`}
              title={(feedbacksMap[selectedCalibrateCandObj.id] || []).some(fb => fb.isExpanded) ? "Collapse all suggestions" : "Expand all suggestions"}
            >
              {(feedbacksMap[selectedCalibrateCandObj.id] || []).some(fb => fb.isExpanded) ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Collapse All</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Expand All</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {(feedbacksMap[selectedCalibrateCandObj.id] || []).map((fb) => {
              const hasBiasFlag = !fb.biasAccepted && !fb.biasDismissed;
              return (
                <div key={fb.id} className="space-y-3 pb-4 border-b border-slate-700/20 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{fb.reviewer}</span>
                    {fb.biasAccepted && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Check className="w-2.5 h-2.5" />
                        <span>Audit Passed</span>
                      </span>
                    )}
                    {!fb.biasAccepted && fb.biasDismissed && (
                      <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Audit Dismissed</span>
                    )}
                    {hasBiasFlag && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Bias Coded</span>
                      </span>
                    )}
                  </div>

                  {/* Feedback text area with active warning */}
                  <div className={`relative border rounded-xl p-5 pb-9 font-sans leading-relaxed text-sm transition-all duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-slate-350' : 'bg-slate-50 border-slate-205 text-slate-707'}`}>
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
                      className={`absolute bottom-2.5 right-2.5 p-1 rounded-lg border transition-all hover:scale-105 flex items-center justify-center cursor-pointer ${fb.isExpanded
                        ? 'bg-primary/20 border-primary text-primary'
                        : hasBiasFlag
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                          : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500')
                        }`}
                      title={fb.isExpanded ? "Minimize suggestion" : "Expand suggestion"}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Suggestion Card */}
                  {fb.isExpanded && !fb.biasAccepted && !fb.biasDismissed && (
                    <div className={`border rounded-xl p-5 flex items-start space-x-4 shadow-lg transition-all duration-500 min-w-0 ${isDarkMode ? 'bg-slate-900 border-amber-500/20 shadow-amber-500/5' : 'bg-amber-500/5 border border-amber-500/20 shadow-amber-500/2'}`}>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className={`text-xs font-bold truncate ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>Unconscious Bias Flagged (Gender Coded Phrasing)</div>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-606'}`}>
                          {fb.biasExplanation}
                        </p>
                        <div className={`rounded-lg p-3 text-xs border transition-all duration-500 break-words ${isDarkMode ? 'bg-slate-955/60 border-slate-708/50 text-slate-308' : 'bg-white border-slate-200 text-slate-707'}`}>
                          <span className={`font-semibold block mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>AI Recommendation:</span>
                          "{fb.rewrittenHighlight}"
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setFeedbackBiasAccepted(fb.id, true)}
                            className="bg-amber-500 hover:bg-amber-650 text-slate-900 font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          >
                            Accept Rewrite
                          </button>
                          <button
                            onClick={() => setFeedbackBiasDismissed(fb.id, true)}
                            className={`border font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-600'}`}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {fb.isExpanded && fb.biasDismissed && !fb.biasAccepted && (
                    <div className="flex justify-end pr-2 gap-2 items-center">
                      <span className="text-[10px] text-slate-500">AI suggestion hidden.</span>
                      <button
                        onClick={() => setFeedbackBiasDismissed(fb.id, false)}
                        className={`text-xs font-semibold underline transition-colors cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-505'}`}
                      >
                        Show suggestion
                      </button>
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
            })}
          </div>
        </div>
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={startResizingCalibrate}
        className={`cursor-col-resize self-stretch flex items-center justify-center group relative z-30 transition-all duration-150 select-none ${isResponsiveMode ? 'hidden' : 'w-2.5 hover:w-3.5'}`}
      >
        <div className={`w-1 group-hover:w-1.5 h-20 rounded bg-slate-550/20 group-hover:bg-primary transition-all ${isResizingCalibrate ? 'bg-primary w-1.5' : ''}`}></div>
      </div>

      {/* RIGHT COLUMN: Calibration Signal + Level Alignment Matrix */}
      <div className={`flex-1 flex flex-col ${isResponsiveMode ? 'w-full' : 'h-full'} gap-3 min-w-0`}>

        {/* Calibration Signal Card */}
        <div className={`shrink-0 ${cardClass} flex flex-col justify-center py-3 px-4`}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-semibold text-slate-505 uppercase tracking-wider">Calibration Signal</label>
            <span className="flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              <span>Promotion Ready</span>
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className={`text-lg font-display font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>82%</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Overall score</span>
            </div>
            <div className={`w-px self-stretch ${isDarkMode ? 'bg-slate-705' : 'bg-slate-205'}`} />
            <div className="flex flex-col">
              <span className={`text-lg font-display font-bold leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {(feedbacksMap[selectedCalibrateCandObj.id] ?? []).length}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Peers reviewed</span>
            </div>
            <div className={`w-px self-stretch ${isDarkMode ? 'bg-slate-705' : 'bg-slate-205'}`} />
            <div className="flex flex-col">
              <span className="text-lg font-display font-bold leading-none text-amber-400">
                {(feedbacksMap[selectedCalibrateCandObj.id] ?? []).filter(fb => !fb.biasAccepted && !fb.biasDismissed).length}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Bias flags</span>
            </div>
            <div className={`w-px self-stretch ${isDarkMode ? 'bg-slate-705' : 'bg-slate-205'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-550">Cycle</span>
              <span className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>H2 2025</span>
            </div>
          </div>
        </div>

        {/* Level Alignment Matrix Card */}
        <div className={`flex-1 space-y-6 ${cardClass} ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto min-h-0 pr-3'}`}>
          <div>
            <h3 className="font-display font-semibold text-base mb-1">Level Alignment Matrix</h3>
            <span className={`text-xs ${isDarkMode ? 'text-slate-450' : 'text-slate-500'}`}>
              {selectedCalibrateCandObj.name} vs <strong>{alignmentData.targetRole}</strong> expectations
            </span>
          </div>

          <div className="space-y-4">
            {alignmentData.metrics.map((metric) => (
              <div key={metric.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{metric.name}</span>
                  <span className="text-primary font-semibold">{metric.actual}% / {metric.expected}%</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden border relative ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-150 border-slate-250'}`}>
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10" 
                    style={{ left: `${metric.expected}%` }}
                    title={`Expected: ${metric.expected}%`}
                  />
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metric.actual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={`rounded-xl p-4 border text-xs leading-relaxed space-y-2 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-slate-50 border-slate-202 text-slate-606'}`}>
            <div className={`font-semibold flex items-center space-x-1.5 ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>Promotion Recommendation</span>
            </div>
            <p>
              {alignmentData.recommendation}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
