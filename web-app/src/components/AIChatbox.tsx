import React, { useRef, useEffect } from 'react';
import { 
  Compass, 
  Minus, 
  Send 
} from 'lucide-react';
import { usePeopleStore } from '../store/peopleStore';
import { ChatResizeEdges } from './chat/ChatResizeEdges';
import { ChatMessageItem } from './chat/ChatMessageItem';

interface AIChatboxProps {
  isDarkMode: boolean;
  isMobileView: boolean;
}

export const AIChatbox: React.FC<AIChatboxProps> = ({
  isDarkMode,
  isMobileView
}) => {
  // Store values and actions
  const candidates = usePeopleStore(state => state.candidates);
  const employees = usePeopleStore(state => state.employees);
  const setActiveTab = usePeopleStore(state => state.setActiveTab);
  
  const setSelectedCandidate = usePeopleStore(state => state.setSelectedCandidate);
  const selectedOnboardCandidateId = usePeopleStore(state => state.selectedOnboardCandidateId);
  const setSelectedOnboardCandidateId = usePeopleStore(state => state.setSelectedOnboardCandidateId);
  const setSelectedCalibrateCandidateId = usePeopleStore(state => state.setSelectedCalibrateCandidateId);
  
  const candidateFilterStages = usePeopleStore(state => state.candidateFilterStages);
  const setCandidateFilterStages = usePeopleStore(state => state.setCandidateFilterStages);
  const setCandidateSearchQuery = usePeopleStore(state => state.setCandidateSearchQuery);
  const setIsCandidateSearchOpen = usePeopleStore(state => state.setIsCandidateSearchOpen);
  
  const setFeedbackBiasAccepted = usePeopleStore(state => state.setFeedbackBiasAccepted);

  const chatMessages = usePeopleStore(state => state.chatMessages);
  const setChatMessages = usePeopleStore(state => state.setChatMessages);
  const inputMessage = usePeopleStore(state => state.inputMessage);
  const setInputMessage = usePeopleStore(state => state.setInputMessage);
  
  const promptHistory = usePeopleStore(state => state.promptHistory);
  const setPromptHistory = usePeopleStore(state => state.setPromptHistory);
  const historyIndex = usePeopleStore(state => state.historyIndex);
  const setHistoryIndex = usePeopleStore(state => state.setHistoryIndex);
  const currentDraft = usePeopleStore(state => state.currentDraft);
  const setCurrentDraft = usePeopleStore(state => state.setCurrentDraft);
  
  const chatWidth = usePeopleStore(state => state.chatWidth);
  const setChatWidth = usePeopleStore(state => state.setChatWidth);
  const chatHeight = usePeopleStore(state => state.chatHeight);
  const setChatHeight = usePeopleStore(state => state.setChatHeight);
  const isMinimized = usePeopleStore(state => state.isMinimized);
  const setIsMinimized = usePeopleStore(state => state.setIsMinimized);
  const isResizingChat = usePeopleStore(state => state.isResizingChat);
  const setIsResizingChat = usePeopleStore(state => state.setIsResizingChat);
  const chatPosition = usePeopleStore(state => state.chatPosition);
  const setChatPosition = usePeopleStore(state => state.setChatPosition);
  const isDraggingChat = usePeopleStore(state => state.isDraggingChat);
  const setIsDraggingChat = usePeopleStore(state => state.setIsDraggingChat);
  const isSidebarCollapsed = usePeopleStore(state => state.isSidebarCollapsed);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const dragStartOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeDirection = useRef<string | null>(null);
  const initialResize = useRef<{ width: number; height: number; x: number; y: number }>({ width: 0, height: 0, x: 0, y: 0 });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!chatPosition) return;
    const sidebarWidth = isSidebarCollapsed ? 80 : 288;
    const leftLimit = sidebarWidth + 10;
    if (chatPosition.x < leftLimit) {
      setChatPosition({ ...chatPosition, x: leftLimit });
    }
  }, [isSidebarCollapsed, chatPosition, setChatPosition]);

  // Dragging support
  const startDraggingChat = (e: React.MouseEvent) => {
    if (isMobileView) return;
    setIsDraggingChat(true);
    const clientX = e.clientX;
    const clientY = e.clientY;
    const currentX = chatPosition?.x ?? (window.innerWidth - chatWidth - 24);
    const currentY = chatPosition?.y ?? (window.innerHeight - chatHeight - 24);
    dragStartOffset.current = {
      x: clientX - currentX,
      y: clientY - currentY
    };
    e.preventDefault();
  };

  // Resizing support
  const startResizingChat = (e: React.MouseEvent, dir: string) => {
    if (isMobileView) return;
    setIsResizingChat(true);
    resizeDirection.current = dir;
    const x = chatPosition?.x ?? (window.innerWidth - chatWidth - 24);
    const y = chatPosition?.y ?? (window.innerHeight - chatHeight - 24);
    initialResize.current = {
      width: chatWidth,
      height: chatHeight,
      x,
      y
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingChat) {
        let x = e.clientX - dragStartOffset.current.x;
        let y = e.clientY - dragStartOffset.current.y;
        
        // Boundaries
        const sidebarWidth = isSidebarCollapsed ? 80 : 288;
        const leftLimit = sidebarWidth + 10;
        x = Math.max(leftLimit, Math.min(x, window.innerWidth - chatWidth - 10));
        y = Math.max(10, Math.min(y, window.innerHeight - chatHeight - 10));
        
        setChatPosition({ x, y });
      }

      if (isResizingChat && resizeDirection.current) {
        const dir = resizeDirection.current;
        const init = initialResize.current;
        const deltaX = e.clientX - (dir.includes('w') ? init.x : (init.x + init.width));
        const deltaY = e.clientY - (dir.includes('n') ? init.y : (init.y + init.height));

        let newWidth = init.width;
        let newHeight = init.height;
        let newX = init.x;
        let newY = init.y;

        // East / West
        if (dir.includes('e')) {
          newWidth = Math.max(280, Math.min(init.width + deltaX, window.innerWidth - init.x - 10));
        } else if (dir.includes('w')) {
          const proposedWidth = init.width - deltaX;
          const sidebarWidth = isSidebarCollapsed ? 80 : 288;
          const leftLimit = sidebarWidth + 10;
          if (proposedWidth >= 280 && (init.x + deltaX) >= leftLimit) {
            newWidth = proposedWidth;
            newX = init.x + deltaX;
          }
        }

        // North / South
        if (dir.includes('s')) {
          newHeight = Math.max(240, Math.min(init.height + deltaY, window.innerHeight - init.y - 10));
        } else if (dir.includes('n')) {
          const proposedHeight = init.height - deltaY;
          if (proposedHeight >= 240 && (init.y + deltaY) >= 10) {
            newHeight = proposedHeight;
            newY = init.y + deltaY;
          }
        }

        setChatWidth(newWidth);
        setChatHeight(newHeight);
        setChatPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingChat(false);
      setIsResizingChat(false);
      resizeDirection.current = null;
    };

    if (isDraggingChat || isResizingChat) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingChat, isResizingChat, chatWidth, chatHeight, chatPosition, isSidebarCollapsed, setChatPosition, setChatWidth, setChatHeight, setIsDraggingChat, setIsResizingChat]);

  // Chat keyboard history support
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (promptHistory.length === 0) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let newIndex = historyIndex;
      if (historyIndex === -1 || historyIndex === promptHistory.length) {
        setCurrentDraft(inputMessage);
        newIndex = promptHistory.length - 1;
      } else {
        newIndex = Math.max(0, historyIndex - 1);
      }
      setHistoryIndex(newIndex);
      setInputMessage(promptHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1 || historyIndex === promptHistory.length) return;

      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (newIndex >= promptHistory.length) {
        setInputMessage(currentDraft);
      } else {
        setInputMessage(promptHistory[newIndex]);
      }
    }
  };

  // Submit trigger
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMessages = [...chatMessages, { sender: 'user' as const, text: userText }];
    setChatMessages(newMessages);

    const updatedHistory = [...promptHistory, userText];
    setPromptHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length);
    setCurrentDraft('');
    setInputMessage('');

    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let responseText = "";
      let agentPrefix = "[AI Assistant]";

      // MULTI-AGENT SUB-IDENTITIES
      const isRecruitingQuery = lowerText.includes('recruit') || lowerText.includes('candidate') || lowerText.includes('greenhouse') || lowerText.includes('john') || lowerText.includes('taylor') || lowerText.includes('stage') || lowerText.includes('pipeline') || lowerText.includes('applied') || lowerText.includes('job');
      const isCalibrationQuery = lowerText.includes('calibrate') || lowerText.includes('calibration') || lowerText.includes('coach') || lowerText.includes('sarah') || lowerText.includes('matrix') || lowerText.includes('performance') || lowerText.includes('bias') || lowerText.includes('rewriting');
      const isOnboardingQuery = lowerText.includes('onboard') || lowerText.includes('checklist') || lowerText.includes('task') || lowerText.includes('slack') || lowerText.includes('github') || lowerText.includes('workspace') || lowerText.includes('jira') || lowerText.includes('rippling') || lowerText.includes('provision');

      if (isRecruitingQuery) {
        agentPrefix = "[Recruiting Specialist]";
      } else if (isCalibrationQuery) {
        agentPrefix = "[Calibration Coach]";
      } else if (isOnboardingQuery) {
        agentPrefix = "[IT Provisioning Buddy]";
      }

      let uiUpdatedMsg = "";

      // Explicit Tab Navigation Checks
      if (lowerText.includes('go to onboarding') || lowerText.includes('go to onboard') || lowerText.includes('show onboarding') || lowerText.includes('open onboarding')) {
        setActiveTab('onboard');
        uiUpdatedMsg = " *(Switched tab to Onboarding Buddy)*";
      } else if (lowerText.includes('go to recruiter') || lowerText.includes('go to recruit') || lowerText.includes('show recruiter') || lowerText.includes('open recruiter')) {
        setActiveTab('recruit');
        uiUpdatedMsg = " *(Switched tab to Recruiter Hub)*";
      } else if (lowerText.includes('go to calibration') || lowerText.includes('go to calibrate') || lowerText.includes('show calibration') || lowerText.includes('open calibration')) {
        setActiveTab('calibrate');
        uiUpdatedMsg = " *(Switched tab to Talent Calibration)*";
      }

      // Candidate & Employee Selection
      let selectedCand = null;
      let selectedEmp = null;

      for (const cand of candidates) {
        const lowerName = cand.name.toLowerCase();
        const firstName = lowerName.split(' ')[0];
        const lastName = lowerName.split(' ')[1] || '';
        if (lowerText.includes(lowerName) || 
            ((lowerText.includes('select') || lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('locate')) && 
             (lowerText.includes(firstName) || (lastName && lowerText.includes(lastName))))) {
          selectedCand = cand;
          break;
        }
      }

      for (const emp of employees) {
        const lowerName = emp.name.toLowerCase();
        const firstName = lowerName.split(' ')[0];
        const lastName = lowerName.split(' ')[1] || '';
        if (lowerText.includes(lowerName) || 
            ((lowerText.includes('select') || lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('locate')) && 
             (lowerText.includes(firstName) || (lastName && lowerText.includes(lastName))))) {
          selectedEmp = emp;
          break;
        }
      }

      if (selectedCand) {
        setSelectedCandidate(selectedCand);
        const matchingEmp = employees.find(e => e.name === selectedCand.name);
        if (matchingEmp) {
          setSelectedCalibrateCandidateId(matchingEmp.id);
          const hasPending = matchingEmp.onboarding.items.some(item => item.status === 'pending');
          if (hasPending) {
            setSelectedOnboardCandidateId(matchingEmp.id);
          }
          uiUpdatedMsg = ` *(Selected ${selectedCand.name}'s profile)*`;
        } else {
          setActiveTab('recruit');
          responseText = `I found candidate ${selectedCand.name}, but there is no corresponding employee record for them.`;
          uiUpdatedMsg = ` *(Switched to Recruiter Hub and selected candidate ${selectedCand.name})*`;
        }
      } else if (selectedEmp) {
        setSelectedCalibrateCandidateId(selectedEmp.id);
        const hasPending = selectedEmp.onboarding.items.some(item => item.status === 'pending');
        if (hasPending) {
          setSelectedOnboardCandidateId(selectedEmp.id);
        }
        const matchingCand = candidates.find(c => c.name === selectedEmp.name);
        if (matchingCand) {
          setSelectedCandidate(matchingCand);
        }
        uiUpdatedMsg = ` *(Selected ${selectedEmp.name}'s calibration record)*`;
      }

      // Filter and Search commands validation
      let searchMatched = false;
      if (lowerText.includes('filter ') || lowerText.includes('search ') || lowerText.includes('find ') || lowerText.includes('select ') || lowerText.includes('locate ')) {
        const filterKeyword = lowerText
          .replace('filter ', '')
          .replace('search ', '')
          .replace('find ', '')
          .replace('select ', '')
          .replace('locate ', '')
          .trim();
        
        const isStageKeyword = ['all', 'clear', 'reset', 'application', 'review', 'recruiter screen', 'screening', 'manager', 'technical', 'tech', 'panel', 'onsite', 'final', 'offer', 'archive', 'hired'].some(k => filterKeyword.includes(k));

        if (filterKeyword === 'all' || filterKeyword === 'clear' || filterKeyword === 'reset') {
          setCandidateSearchQuery('');
          setCandidateFilterStages(['all']);
          uiUpdatedMsg = " *(Cleared all candidate search filters)*";
          searchMatched = true;
        } else if (filterKeyword.includes('application') || filterKeyword.includes('review')) {
          setCandidateFilterStages(['application']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Application Review' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('recruiter screen') || filterKeyword.includes('screening')) {
          setCandidateFilterStages(['recruiter_screen']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Recruiter Screen' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('manager')) {
          setCandidateFilterStages(['manager_screen']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Manager Screen' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('technical') || filterKeyword.includes('tech') || filterKeyword.includes('panel')) {
          setCandidateFilterStages(['panel_interview']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Panel Interview' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('onsite') || filterKeyword.includes('final')) {
          setCandidateFilterStages(['final_interview']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Final Interview' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('offer')) {
          setCandidateFilterStages(['offer']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Offer Stage')*";
          searchMatched = true;
        } else if (filterKeyword.includes('archive')) {
          setCandidateFilterStages(['archived']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Archived' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('hired')) {
          setCandidateFilterStages(['hired']);
          setCandidateSearchQuery('');
          uiUpdatedMsg = " *(Filtered candidate list to 'Hired' stage)*";
          searchMatched = true;
        } else if (filterKeyword.length > 1) {
          const matchingCandExists = candidates.some(c => c.name.toLowerCase().includes(filterKeyword));
          const matchingEmpExists = employees.some(e => e.name.toLowerCase().includes(filterKeyword));

          if (!matchingCandExists && !matchingEmpExists && !isStageKeyword) {
            responseText = `Candidate or employee "${filterKeyword}" was not found in our database.`;
            searchMatched = true;
          } else if (matchingCandExists) {
            setCandidateSearchQuery(filterKeyword);
            setCandidateFilterStages(['all']);
            setIsCandidateSearchOpen(true);
            uiUpdatedMsg = ` *(Filtered candidate list by: "${filterKeyword}")*`;
            searchMatched = true;
          } else {
            searchMatched = true;
          }
        }
      }

      // Generate Agent Response
      if (!responseText) {
        if (selectedCand) {
          const isEmployee = employees.some(e => e.name === selectedCand.name);
          if (isEmployee) {
            const empRecord = employees.find(e => e.name === selectedCand.name);
            responseText = `${selectedCand.name} has been hired and is now an active Employee (**${empRecord?.title}**) in the organization, and is no longer a candidate in the active hiring pipeline.`;
          } else if (selectedCand.stage === 'hired') {
            responseText = `${selectedCand.name} is applying for **${selectedCand.target_job}**. Current Stage: *${selectedCand.stage.replace('_', ' ')}*.`;
          } else {
            responseText = `${selectedCand.name} is applying for **${selectedCand.target_job}**. Current Stage: *${selectedCand.stage.replace('_', ' ')}*. Let me know if you would like to review their resume or submit an interview scorecard.`;
          }
        } else if (selectedEmp && !candidates.some(c => c.name === selectedEmp.name)) {
          responseText = `${selectedEmp.name} is an active Employee (Title: **${selectedEmp.title}**) in the **${selectedEmp.department}** department, and is no longer a candidate in the hiring pipeline.`;
        } else if (isRecruitingQuery) {
          if (searchMatched) {
            const matches = candidates.filter(c => {
              const q = (lowerText.replace('filter ', '').replace('search ', '').trim()).toLowerCase();
              const matchesQuery = q === '' || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.target_job.toLowerCase().includes(q);
              if (q === 'hired' || q.includes('screen') || q === 'all' || q === 'clear' || q === 'reset' || q.includes('offer') || q.includes('onsite') || q.includes('technical') || q.includes('application')) {
                return candidateFilterStages.includes('all') || candidateFilterStages.includes(c.stage);
              }
              return matchesQuery;
            });
            if (matches.length > 0) {
              responseText = `I have updated the sidebar filter. Here are the candidates matching your query:\n\n` +
                matches.map(c => `• **${c.name}** (${c.target_job}) — Stage: *${c.stage.replace('_', ' ')}*`).join('\n');
            } else {
              responseText = `I have updated the search filter, but no candidates matched your query. Try searching for "John" or "Taylor".`;
            }
          } else {
            responseText = `Here are the candidates currently in your Greenhouse pipeline:\n\n` +
              candidates.map(c => `• **${c.name}** (${c.target_job}) — Stage: *${c.stage.replace('_', ' ')}*`).join('\n') +
              `\n\nYou can ask me to "filter hired", "search Staff", or "select John Miller" to update the dashboard.`;
          }
        } else if (isCalibrationQuery) {
          if (selectedEmp) {
            responseText = `${selectedEmp.name} is an active Employee (Title: **${selectedEmp.title}**) in the **${selectedEmp.department}** department. Their performance calibration profile is loaded.`;
          } else if (lowerText.includes('sarah') || lowerText.includes('jenkins')) {
            responseText = `Sarah Jenkins's promotion case is open for Director of Engineering. The Peer Feedback Auditor has highlighted a gender-coded term ("bossy"). I recommend accepting the AI rewrite to keep the review objective.`;
          } else if (lowerText.includes('bias') || lowerText.includes('rewrite') || lowerText.includes('accept')) {
            setFeedbackBiasAccepted("fb_1", true);
            responseText = `I have updated Sarah Jenkins's calibration record to accept the objective rewrite. The bias alert is now resolved.`;
            uiUpdatedMsg = " *(Accepted bias rewrite for Sarah Jenkins)*";
          } else {
            responseText = `You are currently viewing Sarah Jenkins's Level Alignment Matrix. Her metrics show strong Technical Impact (85%) and Execution (95%), but she needs development support for Leadership (70%).`;
          }
        } else if (isOnboardingQuery) {
          if (lowerText.includes('checklist') || lowerText.includes('task')) {
            const rawItems = (employees.find(e => e.id === selectedOnboardCandidateId)?.onboarding.items) || [];
            const compCount = rawItems.filter(i => i.status === 'completed').length;
            const completionPct = rawItems.length > 0 ? Math.round((compCount / rawItems.length) * 100) : 0;
            const pendingTask = rawItems.find(i => i.status === 'pending');
            responseText = `You have completed ${compCount} out of ${rawItems.length} tasks (${completionPct}% complete). ${pendingTask ? `The next pending task is: "${pendingTask.name}".` : "All onboarding tasks are completed!"}`;
          } else if (lowerText.includes('slack') || lowerText.includes('github') || lowerText.includes('rippling') || lowerText.includes('provision')) {
            responseText = `Rippling App Provisioning shows Slack and Google Workspace are **Active**. GitHub and Jira are currently **Pending**. You can trigger a sync re-invite in the Rippling panel.`;
          } else {
            responseText = `I can help you manage your onboarding ramping progress. You can complete tasks from the checklist or review your provisioned accounts.`;
          }
        } else {
          responseText = `I'm your site-wide buddy. I can:\n` +
            `1. **Search and select candidates** (e.g. "select John Miller", "filter hired")\n` +
            `2. **Check onboarding progress** (e.g. "show tasks", "slack access")\n` +
            `3. **Open team calibration** (e.g. "go to calibration", "bias rewrite")\n` +
            `4. **Navigate** (e.g. "go to onboarding")`;
        }
      }

      setChatMessages(prev => [...prev, { sender: 'coach' as const, text: `${agentPrefix} ${responseText}${uiUpdatedMsg}` }]);
    }, 800);
  };

  const defaultX = window.innerWidth - chatWidth - 24;
  const defaultY = window.innerHeight - chatHeight - 24;
  const computedPosition = chatPosition || { x: defaultX, y: defaultY };

  return (
    <div className="z-40">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          title="Open AI Assistant"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all cursor-pointer border border-white/10"
        >
          <Compass className="w-6 h-6 animate-spin-slow" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      ) : (
        <div
          style={isMobileView ? {
            width: 'calc(100% - 32px)',
            height: '400px'
          } : {
            width: `${chatWidth}px`,
            height: `${chatHeight}px`,
            position: 'fixed',
            left: `${computedPosition.x}px`,
            top: `${computedPosition.y}px`
          }}
          className={`flex flex-col rounded-2xl border backdrop-blur-2xl shadow-2xl z-40 transition-all duration-300 ${isDarkMode ? 'bg-[#0B0F19]/90 border-slate-700/80 shadow-black/40' : 'bg-white/95 border-slate-200/90 shadow-slate-300'} ${isMobileView ? 'fixed bottom-4 left-4 right-4' : ''}`}
        >
          {!isMobileView && (
            <ChatResizeEdges startResizingChat={startResizingChat} isDarkMode={isDarkMode} />
          )}

          {/* Header */}
          <div
            onMouseDown={isMobileView ? undefined : startDraggingChat}
            className={`p-4 border-b flex items-center justify-between transition-colors duration-500 ${isMobileView ? '' : 'cursor-grab active:cursor-grabbing'} ${isDarkMode ? 'border-slate-800/60 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-display font-bold text-primary">
                A
              </div>
              <div>
                <div className={`text-xs font-semibold leading-none ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>AI Assistant</div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-405 animate-pulse"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Chat"
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-slate-205' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm'}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Message display */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <ChatMessageItem key={idx} msg={msg} isDarkMode={isDarkMode} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input box */}
          <form onSubmit={handleSendMessage} className={`p-4 border-t flex items-center space-x-2 transition-colors duration-500 ${isDarkMode ? 'border-slate-800/40' : 'border-slate-205'}`}>
            <input
              type="text"
              placeholder="Ask AI Assistant a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className={`flex-1 border text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-primary ${isDarkMode ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-primary hover:bg-opacity-90 flex items-center justify-center text-white transition-all shadow-md shadow-primary/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
