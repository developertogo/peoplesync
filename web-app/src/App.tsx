import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { usePeopleStore } from './store/peopleStore';
import { Sidebar } from './components/Sidebar';
import { RecruiterHub } from './components/RecruiterHub';
import { OnboardingBuddy } from './components/OnboardingBuddy';
import { TalentCalibration } from './components/TalentCalibration';
import { AIChatbox } from './components/AIChatbox';

// Export types and maps for store and components
export type Theme = 'default' | 'greenhouse' | 'rippling' | 'sunset' | 'frontier';

export const ALIGNMENT_DATA_MAP: Record<string, { targetRole: string; metrics: Array<{ name: string; actual: number; expected: number }>; recommendation: string }> = {
  emp_001: {
    targetRole: "VP of Engineering",
    metrics: [
      { name: "Technical Impact", actual: 95, expected: 90 },
      { name: "Leadership", actual: 90, expected: 90 },
      { name: "Strategy", actual: 85, expected: 85 },
      { name: "Execution", actual: 90, expected: 85 }
    ],
    recommendation: "Strong executive alignment across organizational strategy and leadership. Sarah is fully aligned with the requirements for the VP role. Recommended for immediate path progression."
  },
  emp_002: {
    targetRole: "Senior Software Engineer",
    metrics: [
      { name: "Technical Impact", actual: 80, expected: 75 },
      { name: "Leadership", actual: 65, expected: 70 },
      { name: "Strategy", actual: 70, expected: 70 },
      { name: "Execution", actual: 85, expected: 75 }
    ],
    recommendation: "Alex shows outstanding Execution and meets Senior expectations for Technical Impact. Provide growth opportunities to lead complex feature designs to close the Leadership behavior gap."
  },
  emp_003: {
    targetRole: "Staff Product Engineer",
    metrics: [
      { name: "Technical Impact", actual: 85, expected: 80 },
      { name: "Leadership", actual: 80, expected: 80 },
      { name: "Strategy", actual: 75, expected: 80 },
      { name: "Execution", actual: 90, expected: 80 }
    ],
    recommendation: "Morgan demonstrates strong product Execution and deep Technical Impact. Focus development support on long-term Strategy alignment and roadmapping to support the promotion path."
  },
  emp_004: {
    targetRole: "Senior AI Product Engineer",
    metrics: [
      { name: "Technical Impact", actual: 90, expected: 85 },
      { name: "Leadership", actual: 70, expected: 75 },
      { name: "Strategy", actual: 80, expected: 75 },
      { name: "Execution", actual: 85, expected: 80 }
    ],
    recommendation: "Taylor has made superb Technical Impact with AI integrations. Focus next steps on onboarding new team members and mentoring peers to satisfy the Senior Leadership requirements."
  },
  emp_005: {
    targetRole: "Senior Frontend Engineer",
    metrics: [
      { name: "Technical Impact", actual: 85, expected: 80 },
      { name: "Leadership", actual: 75, expected: 75 },
      { name: "Strategy", actual: 70, expected: 75 },
      { name: "Execution", actual: 90, expected: 80 }
    ],
    recommendation: "Mary leads design system execution with high quality. Support progression towards Senior role by offering opportunities to define long-term styling architecture strategies."
  }
};

export const themeClassMap = {
  default: 'theme-default',
  greenhouse: 'theme-greenhouse',
  rippling: 'theme-rippling',
  sunset: 'theme-sunset',
  frontier: 'theme-frontier'
};

export const renderAppIcon = (appName: string, isDarkMode: boolean) => {
  const name = appName.toLowerCase();
  if (name.includes('slack')) {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className={`w-4 h-4 ${isDarkMode ? 'text-[#36C5F0]' : 'text-[#4A154B]'}`}>
        <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111.756 8.43 1.68 8.43h1.682zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682zm6.749 1.682c0-.926.755-1.682 1.68-1.682S16 4.964 16 5.889s-.756 1.681-1.68 1.681h-1.681zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68s.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681z" />
      </svg>
    );
  }
  if (name.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`w-4.5 h-4.5 ${isDarkMode ? 'text-white' : 'text-[#181717]'}`}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    );
  }
  if (name.includes('google')) {
    return (
      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    );
  }
  if (name.includes('jira')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-[#0052CC] dark:text-[#2684FF]">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.214h2.13v2.058a5.218 5.218 0 0 0 5.215 5.214V1.001A1.001 1.001 0 0 0 23.013 0z" />
      </svg>
    );
  }
  return <span className="text-primary font-bold text-xs">{appName[0]}</span>;
};

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('peoplesync_theme');
    if (saved === 'default' || saved === 'greenhouse' || saved === 'rippling' || saved === 'sunset' || saved === 'frontier') {
      return saved as Theme;
    }
    return 'default';
  });

  const activeTab = usePeopleStore(state => state.activeTab);
  const isDarkMode = usePeopleStore(state => state.isDarkMode);
  const isSidebarCollapsed = usePeopleStore(state => state.isSidebarCollapsed);
  const setIsSidebarCollapsed = usePeopleStore(state => state.setSidebarCollapsed);
  const employees = usePeopleStore(state => state.employees);
  const candidates = usePeopleStore(state => state.candidates);
  const selectedCandidate = usePeopleStore(state => state.selectedCandidate);
  const selectedOnboardCandidateId = usePeopleStore(state => state.selectedOnboardCandidateId);
  const selectedCalibrateCandidateId = usePeopleStore(state => state.selectedCalibrateCandidateId);
  const fetchDb = usePeopleStore(state => state.fetchDb);
  const setSelectedCalibrateCandidateId = usePeopleStore(state => state.setSelectedCalibrateCandidateId);
  const setSelectedOnboardCandidateId = usePeopleStore(state => state.setSelectedOnboardCandidateId);
  const setSelectedCandidate = usePeopleStore(state => state.setSelectedCandidate);

  // Dynamic Theme Class Variables
  const cardClass = `border backdrop-blur-xl rounded-2xl p-6 transition-all duration-500 ${isDarkMode ? 'bg-slate-955/40 border-slate-700/50' : 'bg-white border-slate-200/80 shadow-sm'}`;
  const textTitleClass = `font-display font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`;

  React.useEffect(() => {
    localStorage.setItem('peoplesync_theme', theme);
  }, [theme]);

  // Responsive Layout States
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 768;
  const isResponsiveMode = windowWidth < 1024;
  const isExtraSmall = windowWidth < 550;

  React.useEffect(() => {
    if (isResponsiveMode) {
      setIsSidebarCollapsed(true);
    }
  }, [isResponsiveMode, setIsSidebarCollapsed]);

  // Cycle Themes for Collapsed view
  const cycleTheme = () => {
    const themes: Theme[] = ['default', 'greenhouse', 'rippling', 'sunset', 'frontier'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Horizontal Resizing States
  const [recruitLeftWidth, setRecruitLeftWidth] = useState(340);
  const [preferredRecruitLeftWidth, setPreferredRecruitLeftWidth] = useState<number | null>(null);
  const [isResizingRecruit, setIsResizingRecruit] = useState(false);

  React.useEffect(() => {
    if (preferredRecruitLeftWidth !== null) {
      setRecruitLeftWidth(preferredRecruitLeftWidth);
    } else {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const canvasWidth = windowWidth - sidebarWidth - 64;
      const targetWidth = Math.floor(canvasWidth * 0.60);
      setRecruitLeftWidth(Math.max(220, targetWidth));
    }
  }, [windowWidth, isSidebarCollapsed, preferredRecruitLeftWidth]);

  const startResizingRecruit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRecruit(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const availableWidth = windowWidth - sidebarWidth - 84;
      const maxLeftWidth = Math.max(220, availableWidth - 360);
      const newWidth = Math.max(220, Math.min(maxLeftWidth, moveEvent.clientX - sidebarWidth - 32));
      setRecruitLeftWidth(newWidth);
      setPreferredRecruitLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingRecruit(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const [onboardLeftWidth, setOnboardLeftWidth] = useState(450);
  const [preferredOnboardLeftWidth, setPreferredOnboardLeftWidth] = useState(450);
  const [isResizingOnboard, setIsResizingOnboard] = useState(false);

  const startResizingOnboard = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingOnboard(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const availableWidth = windowWidth - sidebarWidth - 84;
      const maxLeftWidth = Math.max(220, availableWidth - 360);
      const newWidth = Math.max(220, Math.min(maxLeftWidth, moveEvent.clientX - sidebarWidth - 32));
      setOnboardLeftWidth(newWidth);
      setPreferredOnboardLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingOnboard(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const [calibrateLeftWidth, setCalibrateLeftWidth] = useState(450);
  const [preferredCalibrateLeftWidth, setPreferredCalibrateLeftWidth] = useState(450);
  const [isResizingCalibrate, setIsResizingCalibrate] = useState(false);

  const startResizingCalibrate = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingCalibrate(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const availableWidth = windowWidth - sidebarWidth - 84;
      const maxLeftWidth = Math.max(220, availableWidth - 320);
      const newWidth = Math.max(220, Math.min(maxLeftWidth, moveEvent.clientX - sidebarWidth - 32));
      setCalibrateLeftWidth(newWidth);
      setPreferredCalibrateLeftWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingCalibrate(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Adjust widths dynamically
  React.useEffect(() => {
    if (isResponsiveMode) return;
    const sidebarWidth = isSidebarCollapsed ? 80 : 320;
    const availableWidth = windowWidth - sidebarWidth - 84;

    // Recruit Tab
    const maxRecruitLeftWidth = Math.max(220, availableWidth - 360);
    const targetRecruitWidth = Math.max(220, Math.min(preferredRecruitLeftWidth || recruitLeftWidth, maxRecruitLeftWidth));
    if (recruitLeftWidth !== targetRecruitWidth) {
      setRecruitLeftWidth(targetRecruitWidth);
    }

    // Onboard Tab
    const maxOnboardLeftWidth = Math.max(220, availableWidth - 360);
    const targetOnboardWidth = isSidebarCollapsed
      ? Math.floor(availableWidth * 0.6)
      : Math.max(220, Math.min(preferredOnboardLeftWidth, maxOnboardLeftWidth));
    if (onboardLeftWidth !== targetOnboardWidth) {
      setOnboardLeftWidth(targetOnboardWidth);
    }

    // Calibrate Tab
    const maxCalibrateLeftWidth = Math.max(220, availableWidth - 320);
    const targetCalibrateWidth = isSidebarCollapsed
      ? Math.floor(availableWidth * 0.6)
      : Math.max(220, Math.min(preferredCalibrateLeftWidth, maxCalibrateLeftWidth));
    if (calibrateLeftWidth !== targetCalibrateWidth) {
      setCalibrateLeftWidth(targetCalibrateWidth);
    }
  }, [
    isSidebarCollapsed,
    windowWidth,
    isResponsiveMode,
    preferredRecruitLeftWidth,
    preferredOnboardLeftWidth,
    preferredCalibrateLeftWidth,
    recruitLeftWidth,
    onboardLeftWidth,
    calibrateLeftWidth
  ]);

  // Load data on mount
  React.useEffect(() => {
    fetchDb();
  }, [fetchDb]);

  const candidateSearchQuery = usePeopleStore(state => state.candidateSearchQuery);

  // Cross-tab Synchronization Hooks
  // 1. Sync from Greenhouse selectedCandidate to Onboarding & Calibration
  React.useEffect(() => {
    if (activeTab === 'recruit' && selectedCandidate) {
      if (candidateSearchQuery.trim() !== '') {
        const q = candidateSearchQuery.toLowerCase();
        const matchCand = candidates.some(c => c.name.toLowerCase().includes(q));
        const matchEmp = employees.some(e => e.name.toLowerCase().includes(q));
        if (!matchCand && matchEmp) {
          // Prevent overriding selection back to active candidate if search is for non-candidate employee
          return;
        }
      }

      const match = employees.find(e => e.name === selectedCandidate.name);
      if (match) {
        if (selectedCalibrateCandidateId !== match.id) {
          setSelectedCalibrateCandidateId(match.id);
        }
        const hasPending = match.onboarding.items.some(item => item.status === 'pending');
        if (hasPending && selectedOnboardCandidateId !== match.id) {
          setSelectedOnboardCandidateId(match.id);
        }
      }
    }
  }, [selectedCandidate, employees, candidates, activeTab, selectedCalibrateCandidateId, selectedOnboardCandidateId, setSelectedCalibrateCandidateId, setSelectedOnboardCandidateId, candidateSearchQuery]);

  // 2. Sync from Onboarding selectedOnboardCandidateId to Greenhouse & Calibration
  React.useEffect(() => {
    if (activeTab === 'onboard' && selectedOnboardCandidateId) {
      const matchEmp = employees.find(e => e.id === selectedOnboardCandidateId);
      if (matchEmp) {
        if (selectedCalibrateCandidateId !== selectedOnboardCandidateId) {
          setSelectedCalibrateCandidateId(selectedOnboardCandidateId);
        }
        const matchCand = candidates.find(c => c.name === matchEmp.name);
        if (matchCand && selectedCandidate?.id !== matchCand.id) {
          setSelectedCandidate(matchCand);
        }
      }
    }
  }, [selectedOnboardCandidateId, employees, candidates, activeTab, selectedCalibrateCandidateId, selectedCandidate, setSelectedCalibrateCandidateId, setSelectedCandidate]);

  // 3. Sync from Calibration selectedCalibrateCandidateId to Greenhouse & Onboarding
  React.useEffect(() => {
    if (activeTab === 'calibrate' && selectedCalibrateCandidateId) {
      const matchEmp = employees.find(e => e.id === selectedCalibrateCandidateId);
      if (matchEmp) {
        const hasPending = matchEmp.onboarding.items.some(item => item.status === 'pending');
        if (hasPending && selectedOnboardCandidateId !== selectedCalibrateCandidateId) {
          setSelectedOnboardCandidateId(selectedCalibrateCandidateId);
        }
        const matchCand = candidates.find(c => c.name === matchEmp.name);
        if (matchCand && selectedCandidate?.id !== matchCand.id) {
          setSelectedCandidate(matchCand);
        }
      }
    }
  }, [selectedCalibrateCandidateId, employees, candidates, activeTab, selectedOnboardCandidateId, selectedCandidate, setSelectedOnboardCandidateId, setSelectedCandidate]);

  return (
    <div className={`min-h-screen font-sans flex transition-all duration-500 ${isMobileView ? 'flex-col' : 'flex-row'} ${isDarkMode ? 'bg-[#0B0F19] text-slate-200' : 'bg-slate-50 text-slate-800 mode-light'} ${themeClassMap[theme]}`}>

      {/* Decorative Glow Elements */}
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full glow-blur animate-pulse-glow z-0"></div>

      {/* Sidebar Component */}
      <Sidebar
        isMobileView={isMobileView}
        isExtraSmall={isExtraSmall}
        theme={theme}
        setTheme={setTheme}
        cycleTheme={cycleTheme}
      />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col z-10 min-w-0">
        {/* Header */}
        <header className={`${isMobileView ? 'h-auto py-4 px-4 flex-col space-y-2' : 'h-20 px-8'} border-b flex items-center justify-between backdrop-blur-md transition-colors duration-500 ${isDarkMode ? 'border-slate-700/50 bg-slate-955/10' : 'border-slate-200 bg-white/40'}`}>
          <div>
            <h2 className={`font-display font-bold ${isMobileView ? 'text-lg text-center' : 'text-xl'} ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>
              {activeTab === 'recruit' && 'Recruiter Hub (Greenhouse API)'}
              {activeTab === 'onboard' && 'Onboarding Buddy (Workday & Rippling API)'}
              {activeTab === 'calibrate' && 'Talent Calibration & Performance Coach'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-xs border font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700/50 text-slate-400' : 'bg-white border-slate-200 text-slate-655 shadow-sm'}`}>
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>Local Host Mode</span>
            </span>
          </div>
        </header>

        {/* Dashboards Panels */}
        <div className={`flex-1 p-4 md:p-8 flex flex-col min-h-0 relative ${isResponsiveMode ? 'overflow-y-auto' : ''}`}>
          {activeTab === 'recruit' && (
            <RecruiterHub
              isDarkMode={isDarkMode}
              isMobileView={isMobileView}
              isResponsiveMode={isResponsiveMode}
              recruitLeftWidth={recruitLeftWidth}
              startResizingRecruit={startResizingRecruit}
              isResizingRecruit={isResizingRecruit}
              cardClass={cardClass}
              textTitleClass={textTitleClass}
            />
          )}

          {activeTab === 'onboard' && (
            <OnboardingBuddy
              isDarkMode={isDarkMode}
              isResponsiveMode={isResponsiveMode}
              onboardLeftWidth={onboardLeftWidth}
              startResizingOnboard={startResizingOnboard}
              isResizingOnboard={isResizingOnboard}
              cardClass={cardClass}
            />
          )}

          {activeTab === 'calibrate' && (
            <TalentCalibration
              isDarkMode={isDarkMode}
              isResponsiveMode={isResponsiveMode}
              calibrateLeftWidth={calibrateLeftWidth}
              startResizingCalibrate={startResizingCalibrate}
              isResizingCalibrate={isResizingCalibrate}
              cardClass={cardClass}
            />
          )}
        </div>
      </main>

      {/* Floating AI Chatbox */}
      <AIChatbox
        isDarkMode={isDarkMode}
        isMobileView={isMobileView}
      />
    </div>
  );
}
