import React, { useState } from 'react';
import { 
  Search, 
  X, 
  ChevronDown, 
  GripVertical, 
  Check 
} from 'lucide-react';
import { usePeopleStore } from '../store/peopleStore';

interface RecruiterHubProps {
  isDarkMode: boolean;
  isMobileView: boolean;
  isResponsiveMode: boolean;
  recruitLeftWidth: number;
  startResizingRecruit: (e: React.MouseEvent) => void;
  isResizingRecruit: boolean;
  cardClass: string;
  textTitleClass: string;
}

export const RecruiterHub: React.FC<RecruiterHubProps> = ({
  isDarkMode,
  isMobileView,
  isResponsiveMode,
  recruitLeftWidth,
  startResizingRecruit,
  isResizingRecruit,
  cardClass,
  textTitleClass,
}) => {
  // Store state and actions
  const candidates = usePeopleStore(state => state.candidates);
  const setCandidates = usePeopleStore(state => state.setCandidates);
  const selectedCandidate = usePeopleStore(state => state.selectedCandidate);
  const setSelectedCandidate = usePeopleStore(state => state.setSelectedCandidate);
  const draggedCandidateIndex = usePeopleStore(state => state.draggedCandidateIndex);
  const setDraggedCandidateIndex = usePeopleStore(state => state.setDraggedCandidateIndex);
  
  const candidateSearchQuery = usePeopleStore(state => state.candidateSearchQuery);
  const setCandidateSearchQuery = usePeopleStore(state => state.setCandidateSearchQuery);
  const candidateFilterStage = usePeopleStore(state => state.candidateFilterStage);
  const setCandidateFilterStage = usePeopleStore(state => state.setCandidateFilterStage);
  
  const employees = usePeopleStore(state => state.employees);
  const setSelectedCalibrateCandidateId = usePeopleStore(state => state.setSelectedCalibrateCandidateId);
  const setSelectedOnboardCandidateId = usePeopleStore(state => state.setSelectedOnboardCandidateId);
  
  const isCandidateSearchOpen = usePeopleStore(state => state.isCandidateSearchOpen);
  const setIsCandidateSearchOpen = usePeopleStore(state => state.setIsCandidateSearchOpen);
  const isStageMenuOpen = usePeopleStore(state => state.isStageMenuOpen);
  const setIsStageMenuOpen = usePeopleStore(state => state.setIsStageMenuOpen);
  
  const isResumeExpanded = usePeopleStore(state => state.isResumeExpanded);
  const setIsResumeExpanded = usePeopleStore(state => state.setIsResumeExpanded);
  const isScorecardExpanded = usePeopleStore(state => state.isScorecardExpanded);
  const setIsScorecardExpanded = usePeopleStore(state => state.setIsScorecardExpanded);
  
  const evaluationNotes = usePeopleStore(state => state.evaluationNotes);
  const setEvaluationNotes = usePeopleStore(state => state.setEvaluationNotes);
  const isEvalNotesExpanded = usePeopleStore(state => state.isEvalNotesExpanded);
  const setIsEvalNotesExpanded = usePeopleStore(state => state.setIsEvalNotesExpanded);
  const evalNotesLogged = usePeopleStore(state => state.evalNotesLogged);
  const setEvalNotesLogged = usePeopleStore(state => state.setEvalNotesLogged);
  const evalError = usePeopleStore(state => state.evalError);
  const setEvalError = usePeopleStore(state => state.setEvalError);

  // Local component states
  const [interviewScore, setInterviewScore] = useState(4);
  const [interviewNotes, setInterviewNotes] = useState('');
  const [interviewLogged, setInterviewLogged] = useState(false);

  const [candidateActiveIndex, setCandidateActiveIndex] = useState<number>(-1);
  React.useEffect(() => {
    setCandidateActiveIndex(-1);
  }, [candidateSearchQuery, candidateFilterStage]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredCandidates.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCandidateActiveIndex(prev => (prev + 1) % filteredCandidates.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCandidateActiveIndex(prev => (prev - 1 + filteredCandidates.length) % filteredCandidates.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCandidates.length === 1) {
        setSelectedCandidate(filteredCandidates[0]);
      } else if (candidateActiveIndex >= 0 && candidateActiveIndex < filteredCandidates.length) {
        setSelectedCandidate(filteredCandidates[candidateActiveIndex]);
      }
    }
  };

  const candidateSearchInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isCandidateSearchOpen) {
      setTimeout(() => {
        candidateSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isCandidateSearchOpen]);

  const isScorecardEnabled = ['recruiter_screen', 'manager_screen', 'panel_interview', 'final_interview'].includes(selectedCandidate?.stage || '');

  React.useEffect(() => {
    if (!isScorecardEnabled) {
      setIsScorecardExpanded(false);
    }
  }, [selectedCandidate, isScorecardEnabled, setIsScorecardExpanded]);

  React.useEffect(() => {
    if (candidateSearchQuery.trim() !== '') {
      const q = candidateSearchQuery.toLowerCase();
      const matchCand = candidates.some(c => c.name.toLowerCase().includes(q));
      if (!matchCand) {
        const matchEmp = employees.find(e => e.name.toLowerCase().includes(q));
        if (matchEmp) {
          setSelectedCalibrateCandidateId(matchEmp.id);
          setSelectedOnboardCandidateId(matchEmp.id);
        }
      }
    }
  }, [candidateSearchQuery, candidates, employees, setSelectedCalibrateCandidateId, setSelectedOnboardCandidateId]);

  React.useEffect(() => {
    setEvaluationNotes('');
    setEvalNotesLogged(false);
    setEvalError('');
    setInterviewLogged(false);
    setInterviewNotes('');
  }, [selectedCandidate, setEvaluationNotes, setEvalNotesLogged, setEvalError]);

  const filteredCandidates = React.useMemo(() => {
    let result = [...candidates];
    if (candidateSearchQuery.trim() !== '') {
      const q = candidateSearchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.target_job.toLowerCase().includes(q));
    }
    if (candidateFilterStage !== 'all') {
      result = result.filter(c => c.stage === candidateFilterStage);
    }
    // Sort alphabetically by last name
    return result.sort((a, b) => {
      const aLastName = a.name.split(' ').slice(-1)[0] || '';
      const bLastName = b.name.split(' ').slice(-1)[0] || '';
      return aLastName.localeCompare(bLastName);
    });
  }, [candidates, candidateSearchQuery, candidateFilterStage]);

  return (
    <div className={`flex-1 flex min-h-0 relative ${isResponsiveMode ? 'flex-col space-y-6' : 'flex-row space-x-2'}`}>
      {/* Candidate Pipeline */}
      <div
        style={isResponsiveMode ? {} : { width: `${recruitLeftWidth}px` }}
        className={`shrink-0 flex flex-col ${isResponsiveMode ? 'w-full h-auto max-h-[350px]' : 'overflow-y-auto h-full pr-3'} ${cardClass}`}
      >
        <div className="flex justify-between items-center mb-1 flex-wrap">
          <h3 className={textTitleClass}>Greenhouse Candidates</h3>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded mb-4">
            Greenhouse API: Connected
          </span>
        </div>

        {/* Greenhouse Search, Filter Controls */}
        <div className="flex items-center justify-between gap-2.5 mb-4 flex-wrap">
          <div className="flex items-center space-x-1.5 flex-1 min-w-[140px]">
            <button
              onClick={() => {
                setIsCandidateSearchOpen(!isCandidateSearchOpen);
                if (isCandidateSearchOpen) setCandidateSearchQuery('');
              }}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${isCandidateSearchOpen ? 'bg-primary/10 border-primary/40 text-primary' : (isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700')}`}
              title="Search Candidates"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <div className={`overflow-hidden transition-all duration-300 flex-1 relative ${isCandidateSearchOpen ? 'max-w-md opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}`}>
              <input
                ref={candidateSearchInputRef}
                type="text"
                placeholder="Search name, job..."
                value={candidateSearchQuery}
                onChange={(e) => setCandidateSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-55 border-slate-205 text-slate-808'}`}
              />
              {candidateSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setCandidateSearchQuery('');
                    candidateSearchInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-205 transition-colors p-0.5 cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="relative stage-dropdown-container">
            <button
              onClick={() => setIsStageMenuOpen(!isStageMenuOpen)}
              className={`flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer space-x-1 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800/50' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}
            >
              <span className="truncate max-w-[125px]">
                {candidateFilterStage === 'all' && 'All Stages'}
                {candidateFilterStage === 'application' && 'Application Review'}
                {candidateFilterStage === 'recruiter_screen' && 'Recruiter Screen'}
                {candidateFilterStage === 'manager_screen' && 'Manager Screen'}
                {candidateFilterStage === 'panel_interview' && 'Panel Interview'}
                {candidateFilterStage === 'final_interview' && 'Final Interview'}
                {candidateFilterStage === 'offer' && 'Offer Stage'}
                {candidateFilterStage === 'archived' && 'Archived'}
                {candidateFilterStage === 'hired' && 'Hired'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {isStageMenuOpen && (
              <div className={`absolute ${recruitLeftWidth > 290 ? 'right-0' : 'left-0'} top-full mt-1 w-36 z-[60] border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                {[
                  { id: 'all', name: 'All Stages' },
                  { id: 'application', name: 'Application Review' },
                  { id: 'recruiter_screen', name: 'Recruiter Screen' },
                  { id: 'manager_screen', name: 'Manager Screen' },
                  { id: 'panel_interview', name: 'Panel Interview' },
                  { id: 'final_interview', name: 'Final Interview' },
                  { id: 'offer', name: 'Offer Stage' },
                  { id: 'archived', name: 'Archived' },
                  { id: 'hired', name: 'Hired' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setCandidateFilterStage(opt.id as any);
                      setIsStageMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-left text-xs font-medium hover:bg-primary/10 transition-colors ${candidateFilterStage === opt.id ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {filteredCandidates.map((cand, index) => (
            <div
              key={cand.id}
              draggable={candidateSearchQuery === '' && candidateFilterStage === 'all'}
              onDragStart={(e) => {
                setDraggedCandidateIndex(index);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={() => {
                if (draggedCandidateIndex === null || draggedCandidateIndex === index) return;
                const updated = [...candidates];
                const [removed] = updated.splice(draggedCandidateIndex, 1);
                updated.splice(index, 0, removed);
                setCandidates(updated);
                setDraggedCandidateIndex(null);
              }}
              onDragEnd={() => setDraggedCandidateIndex(null)}
              className={`flex items-center space-x-1.5 transition-all duration-300 ${draggedCandidateIndex === index ? 'opacity-40 scale-[0.98]' : ''}`}
            >
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-305 shrink-0">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              <button
                onClick={() => {
                  setSelectedCandidate(cand);
                }}
                className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 ${selectedCandidate.id === cand.id ? 'bg-primary/10 border-primary/50 text-primary font-semibold shadow-sm' : `${isDarkMode ? 'bg-slate-900/30 border-slate-700/40 text-slate-400 hover:border-slate-600/60' : 'bg-slate-55 border-slate-205 text-slate-655 hover:bg-slate-105/50'}`} ${index === candidateActiveIndex ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              >
                <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{cand.name}</div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-450' : 'text-slate-500'}`}>{cand.target_job}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {cand.stage.replace('_', ' ')}
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={startResizingRecruit}
        className={`cursor-col-resize self-stretch flex items-center justify-center group relative z-30 transition-all duration-150 select-none ${isResponsiveMode ? 'hidden' : 'w-2.5 hover:w-3.5'}`}
      >
        <div className={`w-1 group-hover:w-1.5 h-20 rounded bg-slate-550/20 group-hover:bg-primary transition-all ${isResizingRecruit ? 'bg-primary w-1.5' : ''}`}></div>
      </div>

      {/* AI screening and scoring */}
      <div className={`flex-1 min-w-[360px] space-y-6 ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto pr-2 h-full'}`}>
        <div className={cardClass}>
          <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <h3 className={`font-display font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>{selectedCandidate.name}</h3>
              <span className={`text-xs block truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedCandidate.email}</span>
              {selectedCandidate.phone && (
                <span className={`text-xs block mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedCandidate.phone}</span>
              )}
            </div>
            <span className="text-[11px] uppercase font-semibold text-accent tracking-wider bg-accent/10 border border-accent/20 px-2.5 py-1 rounded text-center whitespace-normal break-words w-fit max-w-[130px] shrink-0">
              Resume Parser (Active)
            </span>
          </div>

          {/* Collapsible Resume Accordion */}
          <div className={`border rounded-xl mb-6 overflow-hidden transition-colors duration-500 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-205 shadow-sm'}`}>
            <button
              onClick={() => setIsResumeExpanded(!isResumeExpanded)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900/40 hover:bg-slate-900/60' : 'bg-slate-50 hover:bg-slate-100/70'}`}
            >
              <span className={`text-sm font-semibold flex items-center space-x-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-750'}`}>
                <span>Candidate Resume</span>
                <span className="text-[10px] font-normal opacity-60">
                  ({selectedCandidate.resume.split('\n').length} lines)
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isResumeExpanded ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
            </button>

            {isResumeExpanded && (
              <div className={`transition-all duration-300 ease-in-out overflow-hidden`}>
                <div className={`p-4 border-t overflow-auto max-h-80 ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                  <pre className={`text-xs font-mono whitespace-pre-wrap ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {selectedCandidate.resume}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Interview feedback submission (Collapsible Accordion) */}
          <div className={`border rounded-xl mt-6 overflow-hidden transition-all duration-500 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-205 shadow-sm'} ${!isScorecardEnabled ? 'opacity-40 bg-slate-100/5 dark:bg-slate-900/5' : ''}`}>
            <button
              disabled={!isScorecardEnabled}
              onClick={() => setIsScorecardExpanded(!isScorecardExpanded)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${!isScorecardEnabled ? 'cursor-not-allowed text-slate-400 dark:text-slate-500' : 'cursor-pointer'} ${isDarkMode ? 'bg-slate-900/40 hover:bg-slate-900/60' : 'bg-slate-55 hover:bg-slate-100/70'}`}
            >
              <span className={`text-sm font-semibold flex items-center space-x-2 ${!isScorecardEnabled ? 'text-slate-400 dark:text-slate-505' : (isDarkMode ? 'text-slate-200' : 'text-slate-755')}`}>
                <span>Submit Interview Scorecard</span>
                {interviewLogged && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Logged
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isScorecardExpanded ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
            </button>

            {isScorecardExpanded && (
              <div className={`transition-all duration-300 ease-in-out overflow-hidden`}>
                <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                  {interviewLogged ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-sm flex items-center space-x-2">
                      <Check className="w-5 h-5 shrink-0" />
                      <span>Scorecard successfully logged to Greenhouse pipeline! Stage updated.</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`flex ${isMobileView ? 'flex-col space-y-4 space-x-0' : 'items-start space-x-6'}`}>
                        <div>
                          <label className={`text-xs font-medium block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rating (1 to 5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={interviewScore}
                            onChange={(e) => setInterviewScore(Number(e.target.value))}
                            className={`border text-sm font-semibold rounded-lg p-2 w-20 focus:outline-none focus:border-primary ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-205 text-slate-805'}`}
                          />
                        </div>
                        <div className="flex-1">
                          <label className={`text-xs font-medium block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-505'}`}>Interview Notes</label>
                          <textarea
                            rows={3}
                            value={interviewNotes}
                            onChange={(e) => setInterviewNotes(e.target.value)}
                            className={`w-full border text-sm rounded-lg p-2 focus:outline-none focus:border-primary resize-y min-h-[38px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setInterviewLogged(true)}
                        className="bg-primary hover:bg-opacity-90 text-white font-medium text-sm rounded-xl px-5 py-2.5 transition-all shadow-md shadow-primary/20 cursor-pointer"
                      >
                        Submit to Greenhouse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Evaluation Notes (Collapsible Accordion) */}
          <div className={`border rounded-xl mt-6 overflow-hidden transition-all duration-500 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-205 shadow-sm'}`}>
            <button
              onClick={() => setIsEvalNotesExpanded(!isEvalNotesExpanded)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900/40 hover:bg-slate-900/60' : 'bg-slate-50 hover:bg-slate-100/70'}`}
            >
              <span className={`text-sm font-semibold flex items-center space-x-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-750'}`}>
                <span>Evaluation Notes</span>
                {evalNotesLogged && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-405 border border-emerald-500/20">
                    Logged
                  </span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isEvalNotesExpanded ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
            </button>

            {isEvalNotesExpanded && (
              <div className={`transition-all duration-300 ease-in-out overflow-hidden`}>
                <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                  {evalNotesLogged ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-sm flex items-center space-x-2">
                      <Check className="w-5 h-5 shrink-0" />
                      <span>Evaluation notes successfully logged to Greenhouse!</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className={`text-xs font-medium block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-505'}`}>
                          Notes {selectedCandidate?.stage === 'archived' && <span className="text-rose-505 font-bold">* (Required for Archived)</span>}
                        </label>
                        <textarea
                          rows={3}
                          value={evaluationNotes}
                          onChange={(e) => {
                            setEvaluationNotes(e.target.value);
                            if (e.target.value.trim() !== '') setEvalError('');
                          }}
                          placeholder="Enter evaluation details..."
                          className={`w-full border text-sm rounded-lg p-2 focus:outline-none focus:border-primary resize-y min-h-[38px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        />
                        {evalError && (
                          <p className="text-xs text-rose-500 mt-1">{evalError}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          if (selectedCandidate?.stage === 'archived' && evaluationNotes.trim() === '') {
                            setEvalError('Evaluation notes cannot be empty for archived candidates.');
                          } else {
                            setEvalError('');
                            setEvalNotesLogged(true);
                          }
                        }}
                        className="bg-primary hover:bg-opacity-90 text-white font-medium text-sm rounded-xl px-5 py-2.5 transition-all shadow-md shadow-primary/20 cursor-pointer"
                      >
                        Submit to Greenhouse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
