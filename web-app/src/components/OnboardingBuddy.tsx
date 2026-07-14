import React from 'react';
import { 
  ChevronDown, 
  X, 
  Plus, 
  Check, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw 
} from 'lucide-react';
import { usePeopleStore } from '../store/peopleStore';
import { renderAppIcon } from '../App';
import { EmployeeSearchDropdown } from './EmployeeSearchDropdown';

interface OnboardingBuddyProps {
  isDarkMode: boolean;
  isResponsiveMode: boolean;
  onboardLeftWidth: number;
  startResizingOnboard: (e: React.MouseEvent) => void;
  isResizingOnboard: boolean;
  cardClass: string;
}

export const OnboardingBuddy: React.FC<OnboardingBuddyProps> = ({
  isDarkMode,
  isResponsiveMode,
  onboardLeftWidth,
  startResizingOnboard,
  isResizingOnboard,
  cardClass,
}) => {
  // Store state and actions
  const employees = usePeopleStore(state => state.employees);
  const setEmployees = usePeopleStore(state => state.setEmployees);
  const syncWithBackend = usePeopleStore(state => state.syncWithBackend);
  const selectedOnboardCandidateId = usePeopleStore(state => state.selectedOnboardCandidateId);
  const setSelectedOnboardCandidateId = usePeopleStore(state => state.setSelectedOnboardCandidateId);
  
  const newOnboardingItemName = usePeopleStore(state => state.newOnboardingItemName);
  const setNewOnboardingItemName = usePeopleStore(state => state.setNewOnboardingItemName);
  const isEditingChecklist = usePeopleStore(state => state.isEditingChecklist);
  const setIsEditingChecklist = usePeopleStore(state => state.setIsEditingChecklist);
  
  const hideCompletedTasks = usePeopleStore(state => state.hideCompletedTasks);
  const setHideCompletedTasks = usePeopleStore(state => state.setHideCompletedTasks);
  
  const expandedTaskNoteId = usePeopleStore(state => state.expandedTaskNoteId);
  const setExpandedTaskNoteId = usePeopleStore(state => state.setExpandedTaskNoteId);
  const editingNotes = usePeopleStore(state => state.editingNotes);
  const setEditingNotes = usePeopleStore(state => state.setEditingNotes);
  
  const provisionedAccounts = usePeopleStore(state => state.provisionedAccounts);
  const setProvisionedAccounts = usePeopleStore(state => state.setProvisionedAccounts);
  
  const isRipplingSearchOpen = usePeopleStore(state => state.isRipplingSearchOpen);
  const setIsRipplingSearchOpen = usePeopleStore(state => state.setIsRipplingSearchOpen);
  const isRipplingFilterOpen = usePeopleStore(state => state.isRipplingFilterOpen);
  const setIsRipplingFilterOpen = usePeopleStore(state => state.setIsRipplingFilterOpen);
  const isFilterDropdownOpen = usePeopleStore(state => state.isFilterDropdownOpen);
  const setIsFilterDropdownOpen = usePeopleStore(state => state.setIsFilterDropdownOpen);
  const isSortDropdownOpen = usePeopleStore(state => state.isSortDropdownOpen);
  const setIsSortDropdownOpen = usePeopleStore(state => state.setIsSortDropdownOpen);
  
  const ripplingSearchQuery = usePeopleStore(state => state.ripplingSearchQuery);
  const setRipplingSearchQuery = usePeopleStore(state => state.setRipplingSearchQuery);
  const ripplingFilterStatus = usePeopleStore(state => state.ripplingFilterStatus);
  const setRipplingFilterStatus = usePeopleStore(state => state.setRipplingFilterStatus);
  const ripplingSortOrder = usePeopleStore(state => state.ripplingSortOrder);
  const setRipplingSortOrder = usePeopleStore(state => state.setRipplingSortOrder);

  const selectedOnboardCandObj = employees.find(e => e.id === selectedOnboardCandidateId);
  const rawOnboardingItems = selectedOnboardCandObj?.onboarding.items || [];

  const onboardingItems = React.useMemo(() => {
    if (hideCompletedTasks) {
      return rawOnboardingItems.filter(item => item.status !== 'completed');
    }
    return rawOnboardingItems;
  }, [rawOnboardingItems, hideCompletedTasks]);

  const completedCount = rawOnboardingItems.filter(item => item.status === 'completed').length;
  const completionPercentage = rawOnboardingItems.length > 0 ? Math.round((completedCount / rawOnboardingItems.length) * 105) : 0;

  const onboardingCandidatesList = React.useMemo(() => {
    return employees.filter(emp => emp.onboarding.items.some(item => item.status === 'pending'))
      .sort((a, b) => {
        const aLastName = a.name.split(' ').slice(-1)[0] || '';
        const bLastName = b.name.split(' ').slice(-1)[0] || '';
        return aLastName.localeCompare(bLastName);
      });
  }, [employees]);

  const processedAccounts = React.useMemo(() => {
    let result = provisionedAccounts.map(acc => ({
      ...acc,
      account_email: selectedOnboardCandObj ? (selectedOnboardCandObj.work_email ?? selectedOnboardCandObj.personal_email ?? acc.account_email).replace(/@[^@]+$/, '@example.com') : acc.account_email
    }));

    if (ripplingSearchQuery.trim() !== '') {
      const q = ripplingSearchQuery.toLowerCase();
      result = result.filter(acc => {
        const isSlack = acc.app_name.toLowerCase() === 'slack';
        const displayValue = isSlack ? '@' + acc.account_email.split('@')[0] : acc.account_email;
        return acc.app_name.toLowerCase().includes(q) ||
          acc.account_email.toLowerCase().includes(q) ||
          displayValue.toLowerCase().includes(q);
      });
    }

    if (ripplingFilterStatus !== 'all') {
      result = result.filter(acc => acc.status === ripplingFilterStatus);
    }

    if (ripplingSortOrder === 'default') {
      result.sort((a, b) => a.app_name.localeCompare(b.app_name));
    } else if (ripplingSortOrder === 'active-first') {
      result.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return 0;
      });
    } else if (ripplingSortOrder === 'pending-first') {
      result.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
      });
    } else if (ripplingSortOrder === 'inactive-first') {
      result.sort((a, b) => {
        if (a.status === 'inactive' && b.status !== 'inactive') return -1;
        if (a.status !== 'inactive' && b.status === 'inactive') return 1;
        return 0;
      });
    }

    return result;
  }, [provisionedAccounts, ripplingSearchQuery, ripplingFilterStatus, ripplingSortOrder, selectedOnboardCandObj]);

  const toggleOnboardingItem = (id: string) => {
    const updated = employees.map(emp => {
      if (emp.id === selectedOnboardCandidateId) {
        return {
          ...emp,
          onboarding: {
            ...emp.onboarding,
            items: emp.onboarding.items.map(item => {
              if (item.id === id) {
                const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
                return { ...item, status: nextStatus as 'completed' | 'pending' };
              }
              return item;
            })
          }
        };
      }
      return emp;
    });
    setEmployees(updated);
    syncWithBackend(updated);
  };

  const deleteOnboardingItem = (id: string) => {
    const updated = employees.map(emp => {
      if (emp.id === selectedOnboardCandidateId) {
        return {
          ...emp,
          onboarding: {
            ...emp.onboarding,
            items: emp.onboarding.items.filter(item => item.id !== id)
          }
        };
      }
      return emp;
    });
    setEmployees(updated);
    syncWithBackend(updated);
  };

  const saveTaskNote = (taskId: string, noteValue: string) => {
    const updated = employees.map(emp => {
      if (emp.id === selectedOnboardCandidateId) {
        return {
          ...emp,
          onboarding: {
            ...emp.onboarding,
            items: emp.onboarding.items.map(item =>
              item.id === taskId ? { ...item, note: noteValue } : item
            )
          }
        };
      }
      return emp;
    });
    setEmployees(updated);
    syncWithBackend(updated);
  };

  const toggleAccountStatus = (appName: string) => {
    setProvisionedAccounts(provisionedAccounts.map(acc => {
      if (acc.app_name === appName) {
        const nextStatus = acc.status === 'active' ? 'pending' : (acc.status === 'pending' ? 'inactive' : 'active');
        return { ...acc, status: nextStatus as 'active' | 'pending' | 'inactive' };
      }
      return acc;
    }));
  };

  const ripplingSearchInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isRipplingSearchOpen) {
      setTimeout(() => {
        ripplingSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isRipplingSearchOpen]);

  return (
    <div className={`flex-1 flex min-h-0 relative ${isResponsiveMode ? 'flex-col space-y-6' : 'flex-row space-x-2'}`}>
      {/* Onboarding Checklist Card */}
      <div
        style={isResponsiveMode ? {} : { width: `${onboardLeftWidth}px` }}
        className={`shrink-0 flex flex-col ${isResponsiveMode ? 'w-full h-auto max-h-[350px]' : 'overflow-y-auto h-full pr-3'} ${cardClass}`}
      >
        <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
          <div className="min-w-0 mr-3">
            {selectedOnboardCandObj ? (
              <>
                <h3 className={`font-display font-bold text-lg leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>
                  {selectedOnboardCandObj.name}
                </h3>
                <span className={`text-xs block mt-0.5 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {(selectedOnboardCandObj.work_email ?? selectedOnboardCandObj.personal_email ?? '').replace(/@[^@]+$/, '@example.com')}
                </span>
              </>
            ) : (
              <>
                <h3 className={`font-display font-semibold text-lg truncate ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>
                  Your Onboarding Checklist
                </h3>
                <span className={`text-xs block truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track and check off Day 1 tasks</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1.5 shrink-0 whitespace-nowrap">
            <span className={`text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-655'}`}>{completionPercentage}% Complete</span>
            <button
              onClick={() => setIsEditingChecklist(!isEditingChecklist)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isEditingChecklist ? 'bg-primary/15 border-primary/45 text-primary font-bold shadow-sm' : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50 shadow-sm')}`}
            >
              {isEditingChecklist ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Onboarding Candidate Search Selector */}
        <div className="mb-5 relative shrink-0 onboard-dropdown-container">
          <EmployeeSearchDropdown
            isDarkMode={isDarkMode}
            label="Select Onboarding Candidate"
            selectedValue={selectedOnboardCandidateId}
            onSelect={setSelectedOnboardCandidateId}
            employees={onboardingCandidatesList}
            badgeSelector={(emp) => emp.target_job || 'Hired'}
            badgeClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            headerRight={
              <label className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none">
                <input
                  type="checkbox"
                  checked={hideCompletedTasks}
                  onChange={(e) => setHideCompletedTasks(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-3 h-3 cursor-pointer"
                />
                <span>Hide Compl.</span>
              </label>
            }
          />
        </div>

        {/* Progress bar */}
        <div className={`w-full h-2.5 rounded-full overflow-hidden mb-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-200 border-slate-300'}`}>
          <div
            className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {/* Add New Task Inline Form */}
        {isEditingChecklist && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newOnboardingItemName.trim()) return;
              const newItem = {
                id: `task_${Date.now()}`,
                name: newOnboardingItemName.trim(),
                status: 'pending' as const
              };
              const updated = employees.map(emp => {
                if (emp.id === selectedOnboardCandidateId) {
                  return {
                    ...emp,
                    onboarding: {
                      ...emp.onboarding,
                      items: [...emp.onboarding.items, newItem]
                    }
                  };
                }
                return emp;
              });
              setEmployees(updated);
              syncWithBackend(updated);
              setNewOnboardingItemName('');
            }}
            className="flex items-center space-x-2 mb-4 shrink-0"
          >
            <input
              type="text"
              placeholder="Add new task..."
              value={newOnboardingItemName}
              onChange={(e) => setNewOnboardingItemName(e.target.value)}
              className={`flex-1 text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-205 text-slate-800'}`}
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-primary hover:bg-opacity-90 text-white transition-all flex items-center justify-center cursor-pointer shrink-0"
              title="Add Task"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* List */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {onboardingItems.map((item) => {
            const isExpanded = expandedTaskNoteId === item.id;
            return (
              <div
                key={item.id}
                className={`flex flex-col rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-900/35 border-slate-700/40' : 'bg-white border-slate-205 shadow-sm'} ${isExpanded ? 'ring-1 ring-primary/30' : ''}`}
              >
                <div
                  onClick={() => toggleOnboardingItem(item.id)}
                  className="flex items-center justify-between space-x-3 p-3.5 cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 ${item.status === 'completed' ? 'bg-primary text-white' : `border ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}`}>
                      {item.status === 'completed' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-sm truncate ${item.status === 'completed' ? 'line-through text-slate-505' : (isDarkMode ? 'text-slate-200' : 'text-slate-805')}`}>
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
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-705 shadow-sm'}`}
                      title="Toggle Task Notes"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                    </button>

                    {isEditingChecklist && item.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOnboardingItem(item.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30' : 'bg-white border-slate-200 text-slate-500 hover:text-red-550 hover:border-red-550/30 shadow-sm'}`}
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className={`p-3 border-t ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'}`}>
                    <textarea
                      rows={2}
                      value={editingNotes[item.id] !== undefined ? editingNotes[item.id] : (item.note || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingNotes({ ...editingNotes, [item.id]: val });
                      }}
                      onBlur={() => {
                        saveTaskNote(item.id, editingNotes[item.id] || '');
                      }}
                      placeholder="Write a task note (auto-saves)..."
                      className={`w-full text-xs border rounded-lg p-2 focus:outline-none focus:border-primary resize-y min-h-[38px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
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
          })}
        </div>
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={startResizingOnboard}
        className={`cursor-col-resize self-stretch flex items-center justify-center group relative z-30 transition-all duration-150 select-none ${isResponsiveMode ? 'hidden' : 'w-2.5 hover:w-3.5'}`}
      >
        <div className={`w-1 group-hover:w-1.5 h-20 rounded bg-slate-550/20 group-hover:bg-primary transition-all ${isResizingOnboard ? 'bg-primary w-1.5' : ''}`}></div>
      </div>

      {/* Rippling App Provisioning Status */}
      <div className={`flex-1 min-w-[360px] ${cardClass} max-w-full overflow-x-hidden ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto h-full pr-3'}`}>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className={`font-display font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>Rippling App Provisioning</h3>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>IT Account access controls</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
            Sync Status: Active
          </span>
        </div>

        {/* Search, Filter, Sort Controls */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center space-x-2 flex-1 min-w-[150px]">
            <button
              onClick={() => {
                setIsRipplingSearchOpen(!isRipplingSearchOpen);
                if (isRipplingSearchOpen) setRipplingSearchQuery('');
              }}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${isRipplingSearchOpen ? 'bg-primary/10 border-primary/40 text-primary' : (isDarkMode ? 'bg-slate-900 border-slate-805 text-slate-400 hover:text-slate-202' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700')}`}
              title="Toggle Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            <div className={`overflow-hidden transition-all duration-300 flex-1 relative ${isRipplingSearchOpen ? 'max-w-md opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}`}>
              <input
                ref={ripplingSearchInputRef}
                type="text"
                placeholder="Search apps..."
                value={ripplingSearchQuery}
                onChange={(e) => setRipplingSearchQuery(e.target.value)}
                className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-808'}`}
              />
              {ripplingSearchQuery && (
                <button
                  type="button"
                  onClick={() => setRipplingSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
                  title="Clear Search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Sort popover toggle */}
          <div className="relative rippling-filter-popover-container">
            <button
              onClick={() => {
                setIsRipplingFilterOpen(!isRipplingFilterOpen);
                setIsFilterDropdownOpen(false);
                setIsSortDropdownOpen(false);
              }}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${isRipplingFilterOpen ? 'bg-primary/10 border-primary/40 text-primary' : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700')}`}
              title="Filter & Sort"
            >
              <Filter className="w-3.5 h-3.5" />
            </button>

            {isRipplingFilterOpen && (
              <div className={`absolute right-0 top-full mt-2 w-56 p-4 rounded-xl border shadow-xl z-50 transition-colors duration-500 ${isDarkMode ? 'bg-slate-955 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                <div className="space-y-4">
                  {/* Filter Option */}
                  <div className="relative rippling-filter-status-container">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Filter by Status</label>
                    <button
                      onClick={() => {
                        setIsFilterDropdownOpen(!isFilterDropdownOpen);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                    >
                      <span>
                        {ripplingFilterStatus === 'all' && 'Filter: All'}
                        {ripplingFilterStatus === 'active' && 'Active Only'}
                        {ripplingFilterStatus === 'pending' && 'Pending Only'}
                        {ripplingFilterStatus === 'inactive' && 'Inactive Only'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    {isFilterDropdownOpen && (
                      <div className={`absolute top-full left-0 right-0 mt-1 z-50 border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                        {[
                          { id: 'all', name: 'Filter: All' },
                          { id: 'active', name: 'Active Only' },
                          { id: 'pending', name: 'Pending Only' },
                          { id: 'inactive', name: 'Inactive Only' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setRipplingFilterStatus(opt.id as any);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 text-left text-xs font-medium hover:bg-primary/10 transition-colors ${ripplingFilterStatus === opt.id ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                          >
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort Option */}
                  <div className="relative rippling-sort-container">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Sort Order</label>
                    <button
                      onClick={() => {
                        setIsSortDropdownOpen(!isSortDropdownOpen);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                    >
                      <span>
                        {ripplingSortOrder === 'default' && 'Sort: Default'}
                        {ripplingSortOrder === 'active-first' && 'Active First'}
                        {ripplingSortOrder === 'pending-first' && 'Pending First'}
                        {ripplingSortOrder === 'inactive-first' && 'Inactive First'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    {isSortDropdownOpen && (
                      <div className={`absolute top-full left-0 right-0 mt-1 z-50 border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                        {[
                          { id: 'default', name: 'Sort: Default' },
                          { id: 'active-first', name: 'Active First' },
                          { id: 'pending-first', name: 'Pending First' },
                          { id: 'inactive-first', name: 'Inactive First' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setRipplingSortOrder(opt.id as any);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 text-left text-xs font-medium hover:bg-primary/10 transition-colors ${ripplingSortOrder === opt.id ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                          >
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-slate-800/40' : 'divide-slate-205'}`}>
          {processedAccounts.map((acc) => (
            <div
              key={acc.app_name}
              className={`grid grid-cols-[2fr_1.2fr_auto] items-center gap-4 py-3.5 border-b last:border-b-0 transition-all duration-305 ${isDarkMode ? 'border-slate-700/40' : 'border-slate-200'}`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`}>
                  {renderAppIcon(acc.app_name, isDarkMode)}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{acc.app_name}</div>
                  <div className={`text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {acc.app_name.toLowerCase() === 'slack' ? `@${acc.account_email.split('@')[0]}` : acc.account_email}
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1.5 ${acc.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : acc.status === 'pending'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${acc.status === 'active'
                    ? 'bg-emerald-400 animate-pulse'
                    : acc.status === 'pending'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                    }`}></span>
                  <span>
                    {acc.status === 'active' && 'Active'}
                    {acc.status === 'pending' && 'Pending'}
                    {acc.status === 'inactive' && 'Inactive'}
                  </span>
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toggleAccountStatus(acc.app_name)}
                  className={`p-1.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-202' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-505 hover:text-slate-707 shadow-sm'}`}
                  title="Toggle Account Status"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
