import React from 'react';
import { Check, ChevronDown, Trash2 } from 'lucide-react';

interface TaskItem {
  id: string;
  name: string;
  status: 'completed' | 'pending';
  note?: string;
}

interface OnboardingTaskItemProps {
  item: TaskItem;
  isDarkMode: boolean;
  isExpanded: boolean;
  isEditingChecklist: boolean;
  editingNotes: Record<string, string>;
  setEditingNotes: (notes: Record<string, string>) => void;
  setExpandedTaskNoteId: (id: string | null) => void;
  toggleOnboardingItem: (id: string) => void;
  deleteOnboardingItem: (id: string) => void;
  saveTaskNote: (taskId: string, noteValue: string) => void;
}

export const OnboardingTaskItem: React.FC<OnboardingTaskItemProps> = ({
  item,
  isDarkMode,
  isExpanded,
  isEditingChecklist,
  editingNotes,
  setEditingNotes,
  setExpandedTaskNoteId,
  toggleOnboardingItem,
  deleteOnboardingItem,
  saveTaskNote
}) => {
  return (
    <div
      className={`flex flex-col rounded-xl border transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900/35 border-slate-700/40' : 'bg-white border-slate-205 shadow-sm'
      } ${isExpanded ? 'ring-1 ring-primary/30' : ''}`}
    >
      <div
        onClick={() => toggleOnboardingItem(item.id)}
        className="flex items-center justify-between space-x-3 p-3.5 cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3.5 flex-1 min-w-0">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 ${
              item.status === 'completed'
                ? 'bg-primary text-white'
                : `border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`
            }`}
          >
            {item.status === 'completed' && <Check className="w-3.5 h-3.5" />}
          </div>
          <span
            className={`text-sm truncate ${
              item.status === 'completed'
                ? 'line-through text-slate-505'
                : isDarkMode
                ? 'text-slate-200'
                : 'text-slate-805'
            }`}
          >
            {item.name}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isExpanded) {
                saveTaskNote(item.id, editingNotes[item.id] || '');
                setExpandedTaskNoteId(null);
              } else {
                setEditingNotes({ ...editingNotes, [item.id]: item.note || '' });
                setExpandedTaskNoteId(item.id);
              }
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-705 shadow-sm'
            }`}
            title="Toggle Task Notes"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}
            />
          </button>

          {isEditingChecklist && item.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteOnboardingItem(item.id);
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-red-550 hover:border-red-550/30 shadow-sm'
              }`}
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={`p-3 border-t ${isDarkMode ? 'border-slate-800 bg-slate-955/20' : 'border-slate-200 bg-slate-50/50'}`}>
          <textarea
            rows={2}
            value={editingNotes[item.id] !== undefined ? editingNotes[item.id] : item.note || ''}
            onChange={(e) => {
              const val = e.target.value;
              setEditingNotes({ ...editingNotes, [item.id]: val });
            }}
            onBlur={() => {
              saveTaskNote(item.id, editingNotes[item.id] || '');
            }}
            placeholder="Write a task note (auto-saves)..."
            className={`w-full text-xs border rounded-lg p-2 focus:outline-none focus:border-primary resize-y min-h-[38px] ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}
          />
          {item.note && (
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Saved</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
