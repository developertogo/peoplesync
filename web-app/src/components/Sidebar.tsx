import React from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  Compass, 
  Activity, 
  Moon, 
  Sun, 
  Sliders, 
  ChevronDown 
} from 'lucide-react';
import { usePeopleStore } from '../store/peopleStore';
import { Theme } from '../App';

interface SidebarProps {
  isMobileView: boolean;
  isExtraSmall: boolean;
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileView, 
  isExtraSmall, 
  theme, 
  setTheme, 
  cycleTheme 
}) => {
  const activeTab = usePeopleStore(state => state.activeTab);
  const setActiveTab = usePeopleStore(state => state.setActiveTab);
  const isDarkMode = usePeopleStore(state => state.isDarkMode);
  const setDarkMode = usePeopleStore(state => state.setDarkMode);
  const isSidebarCollapsed = usePeopleStore(state => state.isSidebarCollapsed);
  const setSidebarCollapsed = usePeopleStore(state => state.setSidebarCollapsed);
  const isThemeMenuOpen = usePeopleStore(state => state.isThemeMenuOpen);
  const setThemeMenuOpen = usePeopleStore(state => state.setThemeMenuOpen);

  return (
    <aside className={`${isMobileView ? `w-full h-auto ${isExtraSmall ? 'px-2.5 py-2' : 'px-4 py-3'} flex-row items-center border-b justify-between` : (isSidebarCollapsed ? 'w-20 px-3' : 'w-[300px] p-6') + ' border-r flex flex-col justify-between py-6 h-screen'} backdrop-blur-md z-30 transition-all duration-300 ease-in-out ${isDarkMode ? 'bg-slate-955/70 border-slate-700/50' : 'bg-slate-100/90 border-slate-200/80 shadow-sm'}`}>
      <div className={isMobileView ? `flex items-center justify-between flex-1 ${isExtraSmall ? 'mr-2' : 'mr-4'}` : ''}>
        {/* Logo & Collapse Toggle */}
        <div className={`flex items-center ${isMobileView ? (isExtraSmall ? 'space-x-1.5 mb-0' : 'space-x-3 mb-0') : (isSidebarCollapsed ? 'flex-col space-y-4 mb-8' : 'justify-between space-x-3 mb-8')}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {(!isSidebarCollapsed || (isMobileView && !isExtraSmall)) && (
              <div>
                <h1 className={`font-display font-bold text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>PeopleSync</h1>
                {!isMobileView && (
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[11px] text-slate-505 font-semibold tracking-wider uppercase">Agent OS Portal</span>
                    <span className="text-[9px] scale-[0.9] origin-left px-1.5 py-0.5 rounded font-bold bg-primary/15 text-primary border border-primary/20 shrink-0 uppercase tracking-wide">alpha v0.1</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {!isMobileView && (
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-205' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-705 shadow-sm'}`}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* System Monitor Status */}
        {!isMobileView && (
          isSidebarCollapsed ? (
            <div className="flex flex-col items-center mb-6">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-555"></span>
              </span>
            </div>
          ) : (
            <div className={`border rounded-xl p-4 mb-6 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200/80 shadow-sm'}`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-505'}`}>
                System Core
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-505"></span>
                </span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>iii Engine:</span>
                  <span className="text-emerald-500 font-semibold">Connected</span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>ZeroClaw runtime:</span>
                  <span className="text-primary font-semibold">Idle</span>
                </div>
                <div className={`flex justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Claude emulator:</span>
                  <span className="text-accent font-semibold">Active</span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Navigation Links */}
        <nav className={`flex ${isMobileView ? (isExtraSmall ? 'flex-row space-x-1 space-y-0' : 'flex-row space-x-1.5 space-y-0') : 'flex-col space-y-2'}`}>
          <button
            onClick={() => setActiveTab('recruit')}
            title={isSidebarCollapsed && !isMobileView ? undefined : "Recruiter Hub"}
            className={`group relative flex items-center transition-all duration-300 font-medium text-sm ${isMobileView && isExtraSmall ? 'px-2 py-1.5' : 'px-3 py-2'} space-x-1.5 ${activeTab === 'recruit'
              ? `bg-primary/10 text-primary font-semibold ${isMobileView ? 'border-b-2 border-primary rounded-t-xl rounded-b-none' : 'border-l-4 border-primary rounded-xl'}`
              : `${isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'} rounded-xl`
              }`}
          >
            <UserPlus className="w-4.5 h-4.5 shrink-0" />
            <span className={isSidebarCollapsed ? "hidden" : "ml-1 hidden md:inline group-hover:inline"}>Recruiter Hub</span>
            {isSidebarCollapsed && !isMobileView && (
              <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                Recruiter Hub
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-955' : 'border-r-white'} -mr-[1px]`} />
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('onboard')}
            title={isSidebarCollapsed && !isMobileView ? undefined : "Onboarding Buddy"}
            className={`group relative flex items-center transition-all duration-300 font-medium text-sm ${isMobileView && isExtraSmall ? 'px-2 py-1.5' : 'px-3 py-2'} space-x-1.5 ${activeTab === 'onboard'
              ? `bg-primary/10 text-primary font-semibold ${isMobileView ? 'border-b-2 border-primary rounded-t-xl rounded-b-none' : 'border-l-4 border-primary rounded-xl'}`
              : `${isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'} rounded-xl`
              }`}
          >
            <Compass className="w-4.5 h-4.5 shrink-0" />
            <span className={isSidebarCollapsed ? "hidden" : "ml-1 hidden md:inline group-hover:inline"}>Onboarding Buddy</span>
            {isSidebarCollapsed && !isMobileView && (
              <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                Onboarding Buddy
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-955' : 'border-r-white'} -mr-[1px]`} />
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('calibrate')}
            title={isSidebarCollapsed && !isMobileView ? undefined : "Calibration Coach"}
            className={`group relative flex items-center transition-all duration-300 font-medium text-sm ${isMobileView && isExtraSmall ? 'px-2 py-1.5' : 'px-3 py-2'} space-x-1.5 ${activeTab === 'calibrate'
              ? `bg-primary/10 text-primary font-semibold ${isMobileView ? 'border-b-2 border-primary rounded-t-xl rounded-b-none' : 'border-l-4 border-primary rounded-xl'}`
              : `${isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'} rounded-xl`
              }`}
          >
            <Activity className="w-4.5 h-4.5 shrink-0" />
            <span className={isSidebarCollapsed ? "hidden" : "ml-1 hidden md:inline group-hover:inline"}>Calibration Coach</span>
            {isSidebarCollapsed && !isMobileView && (
              <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                Calibration Coach
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-955' : 'border-r-white'} -mr-[1px]`} />
                <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
              </div>
            )}
          </button>
        </nav>
      </div>

      {/* Footer Actions / Theme Selector */}
      <div className={`border-t transition-colors duration-500 ${isMobileView ? `flex flex-row items-center ${isExtraSmall ? 'space-x-1' : 'space-x-2'} pt-0 border-t-0` : 'pt-4 ' + (isSidebarCollapsed ? 'flex flex-col items-center space-y-4' : '')} ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
        {isMobileView ? (
          <div className={`flex items-center ${isExtraSmall ? 'space-x-1' : 'space-x-2'}`}>
            <button
              onClick={() => setDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
              className={`${isExtraSmall ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 rounded-xl'} border flex items-center justify-center transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-slate-905 border-slate-800 text-accent hover:text-white' : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 shadow-sm'}`}
            >
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={cycleTheme}
              title={`Cycle Theme (Current: ${theme})`}
              className={`${isExtraSmall ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 rounded-xl'} border flex items-center justify-center transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}
            >
              <Sliders className="w-4 h-4 text-primary" />
            </button>
          </div>
        ) : (
          <>
            {/* Light / Night Mode Toggle */}
            {isSidebarCollapsed ? (
              <button
                onClick={() => setDarkMode(!isDarkMode)}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                className={`group relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-slate-905 border-slate-800 text-accent hover:text-white' : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 shadow-sm'}`}
              >
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {isSidebarCollapsed && (
                  <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-955 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                    <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-955' : 'border-r-white'} -mr-[1px]`} />
                    <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
                  </div>
                )}
              </button>
            ) : (
              <div className={`flex items-center justify-between mb-4 border rounded-xl p-2.5 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-800/40' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className="text-[11px] font-semibold text-slate-505 uppercase tracking-wider flex items-center space-x-1.5">
                  {isDarkMode ? <Moon className="w-3.5 h-3.5 text-accent animate-pulse" /> : <Sun className="w-3.5 h-3.5 text-amber-505" />}
                  <span>{isDarkMode ? 'Night Mode' : 'Light Mode'}</span>
                </span>
                <button
                  onClick={() => setDarkMode(!isDarkMode)}
                  className={`w-11 h-6 rounded-full p-0.5 relative transition-all duration-300 focus:outline-none cursor-pointer flex items-center ${isDarkMode ? 'bg-slate-955 border border-slate-800' : 'bg-slate-200 border border-slate-350'}`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full bg-primary flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`}
                  >
                    {isDarkMode ? <Moon className="w-2.5 h-2.5 text-white" /> : <Sun className="w-2.5 h-2.5 text-white" />}
                  </div>
                </button>
              </div>
            )}

            {isSidebarCollapsed ? (
              <button
                onClick={cycleTheme}
                title={`Cycle Theme Schema (Current: ${theme})`}
                className={`group relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-505 hover:text-slate-800 shadow-sm'}`}
              >
                <Sliders className="w-4 h-4 text-primary" />
                {isSidebarCollapsed && (
                  <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                    {`Theme: ${theme === 'default' ? 'Anthropic Purple' :
                      theme === 'greenhouse' ? 'Greenhouse Emerald' :
                        theme === 'rippling' ? 'Rippling Blue' :
                          theme === 'sunset' ? 'Sunset Gold' :
                            'Frontier'
                      }`}
                    <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-955' : 'border-r-white'} -mr-[1px]`} />
                    <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
                  </div>
                )}
              </button>
            ) : (
              <div className={`rounded-xl p-3 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-800/40' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                <label className="text-[11px] font-semibold text-slate-505 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <Sliders className="w-3 h-3" />
                  <span>Active Theme Schema</span>
                </label>
                <div className="relative theme-dropdown-container">
                  <button
                    onClick={() => setThemeMenuOpen(!isThemeMenuOpen)}
                    className={`w-full flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                  >
                    <span className="truncate">
                      {theme === 'default' && "Anthropic Purple"}
                      {theme === 'greenhouse' && "Greenhouse Emerald"}
                      {theme === 'rippling' && "Rippling Electric Blue"}
                      {theme === 'sunset' && "Sunset Gold"}
                      {theme === 'frontier' && "Frontier (Claude)"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {isThemeMenuOpen && (
                    <div className={`absolute bottom-full left-0 right-0 mb-1 z-50 border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                      {[
                        { id: 'default', name: 'Anthropic Purple', color: 'bg-[#8A2BE2]' },
                        { id: 'greenhouse', name: 'Greenhouse Emerald', color: 'bg-[#10B981]' },
                        { id: 'rippling', name: 'Rippling Electric Blue', color: 'bg-[#2563EB]' },
                        { id: 'sunset', name: 'Sunset Gold', color: 'bg-[#F97316]' },
                        { id: 'frontier', name: 'Frontier (Claude)', color: 'bg-[#CC5A49]' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id as Theme);
                            setThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-left text-xs font-medium hover:bg-primary/10 transition-colors ${theme === t.id ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${t.color}`} />
                          <span className="truncate">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
