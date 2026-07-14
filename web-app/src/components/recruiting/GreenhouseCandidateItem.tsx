import React from 'react';
import { GripVertical } from 'lucide-react';
import { Candidate } from '../../store/peopleStore';

interface GreenhouseCandidateItemProps {
  cand: Candidate;
  index: number;
  candidateActiveIndex: number;
  selectedCandidate: Candidate;
  isCompact: boolean;
  isDarkMode: boolean;
  candidateSearchQuery: string;
  candidateFilterStages: string[];
  draggedCandidateIndex: number | null;
  setDraggedCandidateIndex: (idx: number | null) => void;
  setSelectedCandidate: (cand: Candidate) => void;
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
}

export const GreenhouseCandidateItem: React.FC<GreenhouseCandidateItemProps> = ({
  cand,
  index,
  candidateActiveIndex,
  selectedCandidate,
  isCompact,
  isDarkMode,
  candidateSearchQuery,
  candidateFilterStages,
  draggedCandidateIndex,
  setDraggedCandidateIndex,
  setSelectedCandidate,
  candidates,
  setCandidates
}) => {
  return (
    <div
      draggable={candidateSearchQuery === '' && candidateFilterStages.includes('all')}
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
      className={`flex items-center space-x-1.5 transition-all duration-300 ${
        draggedCandidateIndex === index ? 'opacity-40 scale-[0.98]' : ''
      }`}
    >
      {/* Drag Handle */}
      <div className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-305 shrink-0">
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {isCompact ? (
        <button
          onClick={() => {
            setSelectedCandidate(cand);
          }}
          className={`flex-1 text-left px-4 py-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 ${
            selectedCandidate.id === cand.id
              ? 'bg-primary/10 border-primary/50 text-primary font-semibold shadow-sm'
              : `${
                  isDarkMode
                    ? 'bg-slate-900/30 border-slate-700/40 text-slate-400 hover:border-slate-600/60'
                    : 'bg-slate-55 border-slate-205 text-slate-655 hover:bg-slate-105/50'
                }`
          } ${index === candidateActiveIndex ? 'ring-2 ring-primary bg-primary/5' : ''}`}
        >
          <div className="flex items-center space-x-1.5 min-w-0 flex-1 text-xs">
            <span className={`font-semibold shrink-0 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{cand.name}</span>
            <span className="opacity-40 shrink-0">*</span>
            <span className={`truncate ${isDarkMode ? 'text-slate-450' : 'text-slate-500'}`}>{cand.target_job}</span>
          </div>
          <span
            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border shrink-0 text-right ${
              isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {cand.stage.replace('_', ' ')}
          </span>
        </button>
      ) : (
        <button
          onClick={() => {
            setSelectedCandidate(cand);
          }}
          className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 ${
            selectedCandidate.id === cand.id
              ? 'bg-primary/10 border-primary/50 text-primary font-semibold shadow-sm'
              : `${
                  isDarkMode
                    ? 'bg-slate-900/30 border-slate-700/40 text-slate-400 hover:border-slate-600/60'
                    : 'bg-slate-55 border-slate-205 text-slate-655 hover:bg-slate-105/50'
                }`
          } ${index === candidateActiveIndex ? 'ring-2 ring-primary bg-primary/5' : ''}`}
        >
          <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{cand.name}</div>
          <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-450' : 'text-slate-500'}`}>{cand.target_job}</div>
          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border transition-colors duration-500 ${
                isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700/50' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {cand.stage.replace('_', ' ')}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
