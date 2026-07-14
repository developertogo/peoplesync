import React from 'react';
import { 
  Minimize2, 
  Maximize2,
  TrendingUp
} from 'lucide-react';
import { usePeopleStore } from '../store/peopleStore';
import { ALIGNMENT_DATA_MAP } from '../App';
import { EmployeeSearchDropdown } from './EmployeeSearchDropdown';
import { PeerFeedbackReviewCard } from './calibration/PeerFeedbackReviewCard';
import { LevelAlignmentMatrix } from './calibration/LevelAlignmentMatrix';

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

  const [visibleCount, setVisibleCount] = React.useState(3);
  const feedbacks = feedbacksMap[selectedCalibrateCandObj.id] || [];

  React.useEffect(() => {
    setVisibleCount(3);
  }, [selectedCalibrateCandidateId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 25) {
      if (visibleCount < feedbacks.length) {
        setVisibleCount(prev => Math.min(prev + 3, feedbacks.length));
      }
    }
  };

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
        <div onScroll={handleScroll} className={`flex-1 space-y-6 ${cardClass} ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto min-h-0 pr-3'}`}>
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
            {feedbacks.slice(0, visibleCount).map((fb) => (
              <PeerFeedbackReviewCard
                key={fb.id}
                fb={fb}
                isDarkMode={isDarkMode}
                highlightText={highlightText}
                toggleFeedbackExpanded={toggleFeedbackExpanded}
                setFeedbackBiasAccepted={setFeedbackBiasAccepted}
                setFeedbackBiasDismissed={setFeedbackBiasDismissed}
              />
            ))}
            {visibleCount < feedbacks.length && (
              <div className="py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider animate-pulse">
                Scroll for more feedback...
              </div>
            )}
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
        <LevelAlignmentMatrix
          alignmentData={alignmentData}
          candidateName={selectedCalibrateCandObj.name}
          isDarkMode={isDarkMode}
          cardClass={cardClass}
          isResponsiveMode={isResponsiveMode}
        />

      </div>
    </div>
  );
};
