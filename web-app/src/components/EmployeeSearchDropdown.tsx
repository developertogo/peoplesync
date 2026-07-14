import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Employee } from '../store/peopleStore';

interface EmployeeSearchDropdownProps {
  isDarkMode: boolean;
  label: string;
  selectedValue: string;
  onSelect: (id: string) => void;
  employees: Employee[];
  badgeSelector?: (emp: Employee) => string;
  badgeClass?: string;
  dropdownContainerClass?: string;
  headerRight?: React.ReactNode;
}

export const EmployeeSearchDropdown: React.FC<EmployeeSearchDropdownProps> = ({
  isDarkMode,
  label,
  selectedValue,
  onSelect,
  employees,
  badgeSelector,
  badgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  dropdownContainerClass = "z-20",
  headerRight
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [visibleCount, setVisibleCount] = useState(5);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedEmpObj = employees.find(e => e.id === selectedValue) || employees[0];

  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase();
      list = list.filter(e => 
        e.name.toLowerCase().includes(q) || 
        (e.target_job && e.target_job.toLowerCase().includes(q)) || 
        (e.department && e.department.toLowerCase().includes(q))
      );
    }
    return list;
  }, [employees, searchText]);

  // Focus input when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Reset activeIndex and visibleCount when text or open state changes
  useEffect(() => {
    setActiveIndex(-1);
    setVisibleCount(5);
  }, [searchText, isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const sliced = filteredEmployees.slice(0, visibleCount);
    if (sliced.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % sliced.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + sliced.length) % sliced.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (sliced.length === 1) {
        onSelect(sliced[0].id);
        setIsOpen(false);
      } else if (activeIndex >= 0 && activeIndex < sliced.length) {
        onSelect(sliced[activeIndex].id);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 15) {
      if (visibleCount < filteredEmployees.length) {
        setVisibleCount(prev => Math.min(prev + 5, filteredEmployees.length));
      }
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative shrink-0 flex flex-col justify-center ${dropdownContainerClass}`}
    >
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{label}</label>
        {headerRight}
      </div>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchText('');
        }}
        className={`w-full flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-primary transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800/50' : 'bg-white border-slate-200 text-slate-888 hover:bg-slate-55 shadow-sm'}`}
      >
        <span className="flex items-center space-x-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-semibold text-xs truncate">{selectedEmpObj ? selectedEmpObj.name : "Select Employee"}</span>
          {selectedEmpObj && badgeSelector && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ml-2 shrink-0 ${badgeClass}`}>
              {badgeSelector(selectedEmpObj)}
            </span>
          )}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1 z-50 border rounded-lg shadow-xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-808 text-white' : 'bg-white border-slate-202 text-slate-800'}`}>
          <div className="p-2 border-b border-slate-707/50 relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Type employee name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary ${isDarkMode ? 'bg-slate-955 border-slate-808 text-white' : 'bg-slate-55 border-slate-202 text-slate-800'}`}
            />
            {searchText && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSearchText(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-205 transition-colors p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div onScroll={handleDropdownScroll} className="max-h-48 overflow-y-auto">
            {filteredEmployees.length === 0 ? (
              <div className="p-3 text-xs text-slate-500 text-center">No employees found</div>
            ) : (
              filteredEmployees.slice(0, visibleCount).map((e, idx) => (
                <button
                  type="button"
                  key={e.id}
                  onClick={() => { onSelect(e.id); setIsOpen(false); }}
                  className={`w-full flex flex-col items-start px-3 py-2 text-left hover:bg-primary/10 transition-colors ${selectedValue === e.id ? 'bg-primary/5' : ''} ${idx === activeIndex ? 'bg-primary/20' : ''}`}
                >
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{e.name}</span>
                  <span className="text-[10px] text-slate-500 truncate w-full">{e.target_job} • {e.department}</span>
                </button>
              ))
            )}
            {visibleCount < filteredEmployees.length && (
              <div className="py-2 text-center text-[9px] font-semibold text-slate-500 uppercase tracking-wider animate-pulse border-t dark:border-slate-800 border-slate-100">
                Scroll for more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
