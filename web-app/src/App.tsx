import React, { useState } from 'react';
import {
  UserPlus,
  Sparkles,
  Terminal,
  Compass,
  Send,
  Check,
  Activity,
  RefreshCw,
  Sliders,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  GripVertical,
  TrendingUp,
  AlertTriangle,
  Sun,
  Moon,
  Minus,
  Search,
  Filter,
  X,
  Plus,
  Trash2
} from 'lucide-react';

// Define Theme Types
type Theme = 'default' | 'greenhouse' | 'rippling' | 'sunset' | 'frontier';

// Mock Data matching db.json shapes
const INITIAL_CANDIDATES = [
  {
    id: "cnd_001",
    name: "John Miller",
    email: "john.miller@gmail.com",
    phone: "+1-808-555-0199",
    stage: "recruiter_screen",
    target_job: "Staff Software Engineer, People Products",
    department: "Applied AI / People Products",
    pronouns: "he/his",
    resume: "JOHN MILLER\nEmail: john.miller@gmail.com | Phone: +1-808-555-0199 | San Francisco, CA\n\nEXPERIENCE\nLead Fullstack Engineer at HRflow AI (2022 - Present)\n- Built dynamic workflows integrating Greenhouse and Workday APIs for resume screening.\n- Led team of 4 engineers to design 0->1 products powered by LLMs, reducing screening latency by 40%.\n- Designed a custom internal tool protocol similar to Model Context Protocol (MCP) to load database tools into agent pipelines.\n- Proficient in TypeScript, React, Node.js, and Python.\n\nEDUCATION\nB.S. in Computer Science - Stanford University"
  },
  {
    id: "cnd_002",
    name: "Taylor Chen",
    email: "taylor.chen@gmail.com",
    phone: "+1-808-555-0122",
    stage: "hired",
    target_job: "AI Product Engineer",
    department: "Applied AI",
    pronouns: "she/her",
    resume: "TAYLOR CHEN\nEmail: taylor.chen@gmail.com | Phone: +1-808-555-0122 | New York, NY\n\nEXPERIENCE\nLead AI Product Engineer at TechGenius (2021 - Present)\n- Built production-grade LLM integrations utilizing LangChain and LlamaIndex for enterprise search platforms.\n- Optimized token throughput and context window management, reducing API costs by 35%.\n- Designed responsive agent interfaces using React, TypeScript, TailwindCSS, and Next.js.\n- Engineered real-time WebSocket messaging systems to support interactive AI companion bots.\n\nEDUCATION\nM.S. in Software Engineering - MIT"
  },
  {
    id: "cnd_003",
    name: "Morgan Vance",
    email: "morgan.vance@gmail.com",
    phone: "+1-808-555-0133",
    stage: "panel_interview",
    target_job: "Senior Product Designer",
    department: "Product Design",
    pronouns: "she/her",
    resume: "MORGAN VANCE\nEmail: morgan.vance@gmail.com | Phone: +1-808-555-0133 | Seattle, WA\n\nEXPERIENCE\nSenior Product Designer at DesignStudio (2020 - Present)\n- Led UX redesign of flagship enterprise platform, increasing user activation by 25%.\n- Designed complex workflow visualization systems and interactive components.\n- Expert in Figma, React prototyping, and responsive design frameworks.\n\nEDUCATION\nB.F.A. in Interaction Design - Carnegie Mellon University"
  },
  {
    id: "cnd_004",
    name: "Mary Smith",
    email: "mary.smith@gmail.com",
    phone: "+1-808-555-0155",
    stage: "hired",
    target_job: "Frontend Engineer, Design Systems",
    department: "Product Design",
    pronouns: "she/her",
    resume: "MARY SMITH\nEmail: mary.smith@gmail.com | Phone: +1-808-555-0155 | Austin, TX\n\nEXPERIENCE\nFrontend Engineer at Design Systems Corp (2023 - Present)\n- Developed reusable component library using React, TypeScript, and TailwindCSS.\n- Syncing UI tokens and design variables between Figma and React codebases.\n\nEDUCATION\nB.S. in Computer Science - University of Texas at Austin"
  }
];

const INITIAL_ONBOARDING_ITEMS = [
  { id: "task_01", name: "Accepted Offer", status: "completed" as const },
  { id: "task_02", name: "Request Computer and Other Equipment", status: "completed" as const },
  { id: "task_03", name: "Review Codebase Setup", status: "completed" as const },
  { id: "task_04", name: "Read Security Guidelines", status: "completed" as const },
  { id: "task_05", name: "Set up Local Dev Environment", status: "completed" as const },
  { id: "task_06", name: "Health Benefits Enrollment", status: "pending" as const },
  { id: "task_07", name: "Submit Onboarding Feedback", status: "pending" as const },
  { id: "task_08", name: "First 1:1 with Sarah", status: "pending" as const }
];

const INITIAL_PROVISIONED_ACCOUNTS = [
  { app_name: "Slack", account_email: "alex.rivera@example.com", status: "active" as const },
  { app_name: "GitHub", account_email: "alex.rivera@example.com", status: "pending" as const },
  { app_name: "Google Workspace", account_email: "alex.rivera@example.com", status: "active" as const },
  { app_name: "Jira", account_email: "alex.rivera@example.com", status: "pending" as const }
];

interface Employee {
  id: string;
  name: string;
  personal_email: string;
  work_email: string;
  title: string;
  target_job: string;
  department: string;
  pronouns: string;
  onboarding: {
    items: Array<{ id: string; name: string; status: 'completed' | 'pending'; note?: string }>;
  };
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp_002",
    name: "Taylor Chen",
    personal_email: "taylor.chen@gmail.com",
    work_email: "taylor.chen@example.com",
    title: "AI Product Engineer",
    target_job: "AI Product Engineer",
    department: "Applied AI",
    pronouns: "she/her",
    onboarding: {
      items: INITIAL_ONBOARDING_ITEMS.map(item => ({ ...item, status: 'pending' as const }))
    }
  },
  {
    id: "emp_003",
    name: "Mary Smith",
    personal_email: "mary.smith@gmail.com",
    work_email: "mary.smith@example.com",
    title: "Frontend Engineer, Design Systems",
    target_job: "Frontend Engineer, Design Systems",
    department: "Product Design",
    pronouns: "she/her",
    onboarding: {
      items: INITIAL_ONBOARDING_ITEMS.map(item => ({ ...item, status: 'pending' as const }))
    }
  },
  {
    id: "sarah_smith",
    name: "Sarah Smith",
    personal_email: "sarah.smith@gmail.com",
    work_email: "sarah.smith@example.com",
    title: "Staff Software Engineer, People Products",
    target_job: "Staff Software Engineer, People Products",
    department: "Applied AI / People Products",
    pronouns: "she/her",
    onboarding: {
      items: INITIAL_ONBOARDING_ITEMS.map(item => ({ ...item, status: 'completed' as const }))
    }
  }
];


const renderAppIcon = (appName: string, isDarkMode: boolean) => {
  const name = appName.toLowerCase();
  if (name.includes('slack')) {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className={`w-4 h-4 ${isDarkMode ? 'text-[#36C5F0]' : 'text-[#4A154B]'}`}>
        <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111.756 8.43 1.68 8.43h1.682zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682zm6.749 1.682c0-.926.755-1.682 1.68-1.682S16 4.964 16 5.889s-.756 1.681-1.68 1.681h-1.681zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68s.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681z"/>
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
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('peoplesync_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  React.useEffect(() => {
    localStorage.setItem('peoplesync_theme', theme);
  }, [theme]);

  React.useEffect(() => {
    localStorage.setItem('peoplesync_dark_mode', String(isDarkMode));
  }, [isDarkMode]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Responsive Layout States
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileView = windowWidth < 768;
  const isResponsiveMode = windowWidth < 1024;
  const isExtraSmall = windowWidth < 550; // New breakpoint: hide labels when <550px

  React.useEffect(() => {
    if (isResponsiveMode) {
      setIsSidebarCollapsed(true);
    }
  }, [isResponsiveMode]);

  // Cycle Themes for Collapsed view
  const cycleTheme = () => {
    const themes: Theme[] = ['default', 'greenhouse', 'rippling', 'sunset', 'frontier'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Horizontal Resizing States
  const [recruitLeftWidth, setRecruitLeftWidth] = useState(340); // in pixels
  const [preferredRecruitLeftWidth, setPreferredRecruitLeftWidth] = useState(340);
  const [isResizingRecruit, setIsResizingRecruit] = useState(false);

  const startResizingRecruit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRecruit(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const availableWidth = window.innerWidth - sidebarWidth - 84;
      // Enforce that AI screening and scoring panel is never smaller than 360px
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

  const [onboardLeftWidth, setOnboardLeftWidth] = useState(450); // in pixels
  const [preferredOnboardLeftWidth, setPreferredOnboardLeftWidth] = useState(450);
  const [isResizingOnboard, setIsResizingOnboard] = useState(false);

  const startResizingOnboard = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingOnboard(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const availableWidth = window.innerWidth - sidebarWidth - 84;
      // Enforce that Rippling App Provisioning is never smaller than 360px
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

  const [calibrateLeftWidth, setCalibrateLeftWidth] = useState(450); // in pixels
  const [preferredCalibrateLeftWidth, setPreferredCalibrateLeftWidth] = useState(450);
  const [isResizingCalibrate, setIsResizingCalibrate] = useState(false);

  const startResizingCalibrate = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingCalibrate(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const sidebarWidth = isSidebarCollapsed ? 80 : 320;
      const availableWidth = window.innerWidth - sidebarWidth - 84;
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

  // Adjust widths dynamically when sidebar state or window size changes
  React.useEffect(() => {
    if (isResponsiveMode) return;
    const sidebarWidth = isSidebarCollapsed ? 80 : 320;
    const availableWidth = windowWidth - sidebarWidth - 84;

    // Recruit Tab
    const maxRecruitLeftWidth = Math.max(220, availableWidth - 360);
    const targetRecruitWidth = Math.max(220, Math.min(preferredRecruitLeftWidth, maxRecruitLeftWidth));
    if (recruitLeftWidth !== targetRecruitWidth) {
      setRecruitLeftWidth(targetRecruitWidth);
    }

    // Onboard Tab
    const maxOnboardLeftWidth = Math.max(220, availableWidth - 360);
    const targetOnboardWidth = Math.max(220, Math.min(preferredOnboardLeftWidth, maxOnboardLeftWidth));
    if (onboardLeftWidth !== targetOnboardWidth) {
      setOnboardLeftWidth(targetOnboardWidth);
    }

    // Calibrate Tab
    const maxCalibrateLeftWidth = Math.max(220, availableWidth - 320);
    const targetCalibrateWidth = Math.max(220, Math.min(preferredCalibrateLeftWidth, maxCalibrateLeftWidth));
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

  // Dynamic Theme Class Variables
  const cardClass = `border backdrop-blur-xl rounded-2xl p-6 transition-all duration-500 ${isDarkMode ? 'bg-slate-955/40 border-slate-700/50' : 'bg-white border-slate-200/80 shadow-sm'}`;
  const textTitleClass = `font-display font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`;

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'recruit' | 'onboard' | 'calibrate'>(() => {
    const saved = localStorage.getItem('peoplesync_active_tab');
    if (saved === 'recruit' || saved === 'onboard' || saved === 'calibrate') {
      return saved;
    }
    return 'onboard'; // default tab
  });

  React.useEffect(() => {
    localStorage.setItem('peoplesync_active_tab', activeTab);
  }, [activeTab]);

// Candidate Data State
const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
const [draggedCandidateIndex, setDraggedCandidateIndex] = useState<number | null>(null);
const [selectedCandidate, setSelectedCandidate] = useState(INITIAL_CANDIDATES[0]);

  // Onboarding candidate selection — must be declared before the useEffect below that calls setSelectedOnboardCandidateId
  const [selectedOnboardCandidateId, setSelectedOnboardCandidateId] = useState<string>('');

  React.useEffect(() => {
    if (selectedCandidate && selectedCandidate.stage === 'hired') {
      setSelectedOnboardCandidateId(selectedCandidate.id);
    }
  }, [selectedCandidate]);
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [candidateFilterStage, setCandidateFilterStage] = useState<'all' | 'application' | 'recruiter_screen' | 'manager_screen' | 'panel_interview' | 'final_interview' | 'offer' | 'archived' | 'hired'>('all');
  const [isCandidateSearchOpen, setIsCandidateSearchOpen] = useState(false);
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const [isResumeExpanded, setIsResumeExpanded] = useState(false);
  const [isScorecardExpanded, setIsScorecardExpanded] = useState(false);

  const isScorecardEnabled = ['recruiter_screen', 'manager_screen', 'panel_interview', 'final_interview'].includes(selectedCandidate?.stage || '');

  React.useEffect(() => {
    if (!isScorecardEnabled) {
      setIsScorecardExpanded(false);
    }
  }, [selectedCandidate, isScorecardEnabled]);

  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [isEvalNotesExpanded, setIsEvalNotesExpanded] = useState(false);
  const [evalNotesLogged, setEvalNotesLogged] = useState(false);
  const [evalError, setEvalError] = useState('');

  React.useEffect(() => {
    setEvaluationNotes('');
    setEvalNotesLogged(false);
    setEvalError('');
  }, [selectedCandidate]);

  const filteredCandidates = React.useMemo(() => {
    let result = [...candidates];
    if (candidateSearchQuery.trim() !== '') {
      const q = candidateSearchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.target_job.toLowerCase().includes(q)
      );
    }
    if (candidateFilterStage !== 'all') {
      result = result.filter(c => c.stage === candidateFilterStage);
    }
    return result;
  }, [candidates, candidateSearchQuery, candidateFilterStage]);

  const [interviewScore, setInterviewScore] = useState<number>(5);
  const [interviewNotes, setInterviewNotes] = useState<string>('Stellar systems thinking. Already familiar with custom tool loading models similar to MCP.');
  const [interviewLogged, setInterviewLogged] = useState<boolean>(false);

  // Onboarding Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isOnboardCandDropdownOpen, setIsOnboardCandDropdownOpen] = useState(false);

  // Fetch employee records — replace with real API calls when endpoints are available
  const fetchEmployees = async () => {
    try {
      // TODO: replace with real endpoints, e.g.:
      // const workdayResp = await fetch('https://api.workday.com/v1/employees', { headers: { Authorization: `Bearer ${token}` } });
      // const ripplingResp = await fetch('https://api.rippling.com/v1/employees', { headers: { Authorization: `Bearer ${token}` } });
      const unique: Employee[] = INITIAL_EMPLOYEES;
      setEmployees(unique);
      if (unique.length > 0) {
        setSelectedOnboardCandidateId(unique[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch employees:', e);
    }
  };

  // Fetch candidate records — replace with real Greenhouse API call when available
  const fetchCandidates = async () => {
    try {
      // TODO: replace with real endpoint, e.g.:
      // const resp = await fetch('https://api.greenhouse.io/v1/candidates', { headers: { Authorization: `Basic ${btoa(apiKey + ':')}` } });
      const data = INITIAL_CANDIDATES;
      setCandidates(data);
      if (data.length > 0) {
        setSelectedCandidate(data[0]);
      }
    } catch (e) {
      console.error('Failed to fetch candidates:', e);
    }
  };

  // Load data on component mount
  React.useEffect(() => {
    fetchEmployees();
    fetchCandidates();
  }, []);

  const rawOnboardingItems = (employees.find(e => e.id === selectedOnboardCandidateId)?.onboarding.items) || [];
  const [newOnboardingItemName, setNewOnboardingItemName] = useState('');
  const [isEditingChecklist, setIsEditingChecklist] = useState(false);
  const [onboardSearchText, setOnboardSearchText] = useState('');
  const [hideCompletedTasks, setHideCompletedTasks] = useState(false);

  const onboardingItems = React.useMemo(() => {
    if (hideCompletedTasks) {
      return rawOnboardingItems.filter(item => item.status !== 'completed');
    }
    return rawOnboardingItems;
  }, [rawOnboardingItems, hideCompletedTasks]);

  const [expandedTaskNoteId, setExpandedTaskNoteId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [taskId: string]: string }>({});

  const selectedOnboardCandObj = employees.find(e => e.id === selectedOnboardCandidateId);

  React.useEffect(() => {
    const hasPending = employees.some(e => e.id === selectedOnboardCandidateId && e.onboarding.items.some(item => item.status === 'pending'));
    if (!hasPending) {
      const firstPending = employees.find(e => e.onboarding.items.some(item => item.status === 'pending'));
      setSelectedOnboardCandidateId(firstPending ? firstPending.id : '');
    }
  }, [employees, selectedOnboardCandidateId]);

  const onboardingStageCandidates = React.useMemo(() => {
    let list = employees.filter(emp => emp.onboarding.items.some(item => item.status === 'pending'));
    if (onboardSearchText.trim() !== '') {
      const q = onboardSearchText.toLowerCase();
      list = list.filter(emp => emp.name.toLowerCase().includes(q));
    }
    return list;
  }, [employees, onboardSearchText]);
  const [provisionedAccounts, setProvisionedAccounts] = useState<Array<{ app_name: string; account_email: string; status: 'active' | 'pending' | 'inactive' }>>(INITIAL_PROVISIONED_ACCOUNTS);
  const [draggedAccountIndex, setDraggedAccountIndex] = useState<number | null>(null);

  // Rippling Search, Filter, Sort States
  const [isRipplingSearchOpen, setIsRipplingSearchOpen] = useState(false);
  const [isRipplingFilterOpen, setIsRipplingFilterOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [ripplingSearchQuery, setRipplingSearchQuery] = useState('');
  const [ripplingFilterStatus, setRipplingFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [ripplingSortOrder, setRipplingSortOrder] = useState<'default' | 'active-first' | 'pending-first' | 'inactive-first'>('default');

  const ripplingSearchInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isRipplingSearchOpen) {
      setTimeout(() => {
        ripplingSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isRipplingSearchOpen]);

  const onboardCandSearchInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (isOnboardCandDropdownOpen) {
      setTimeout(() => {
        onboardCandSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isOnboardCandDropdownOpen]);

  const [selectedCalibrateCandidateId, setSelectedCalibrateCandidateId] = useState<string>("sarah_smith");
  const [isCalibrateCandDropdownOpen, setIsCalibrateCandDropdownOpen] = useState(false);
  const [calibrateSearchText, setCalibrateSearchText] = useState('');
  const calibrateCandSearchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isCalibrateCandDropdownOpen) {
      setTimeout(() => {
        calibrateCandSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isCalibrateCandDropdownOpen]);

  const calibrationStageCandidates = React.useMemo(() => {
    let list = employees;
    if (calibrateSearchText.trim() !== '') {
      const q = calibrateSearchText.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q));
    }
    return list;
  }, [employees, calibrateSearchText]);

  const selectedCalibrateCandObj = React.useMemo(() => {
    return employees.find(e => e.id === selectedCalibrateCandidateId) || employees[0];
  }, [employees, selectedCalibrateCandidateId]);

  const calPronouns = React.useMemo(() => {
    const isHe = selectedCalibrateCandObj?.pronouns === "he/his";
    return {
      subj: isHe ? "he" : "she",
      subjCap: isHe ? "He" : "She",
      poss: isHe ? "his" : "her",
      obj: isHe ? "him" : "her"
    };
  }, [selectedCalibrateCandObj]);

  const processedAccounts = React.useMemo(() => {
    let result = provisionedAccounts.map(acc => ({
      ...acc,
      account_email: selectedOnboardCandObj ? (selectedOnboardCandObj.work_email ?? selectedOnboardCandObj.personal_email ?? acc.account_email).replace(/@[^@]+$/, '@example.com') : acc.account_email
    }));

    // 1. Filter by Search Query
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

    // 2. Filter by Status
    if (ripplingFilterStatus !== 'all') {
      result = result.filter(acc => acc.status === ripplingFilterStatus);
    }

    // 3. Sort
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

  const isDragEnabled = ripplingSearchQuery === '' && ripplingFilterStatus === 'all' && ripplingSortOrder === 'default';

  // Calibration/Bias State
  const [biasAccepted, setBiasAccepted] = useState(false);
  const [biasDismissed, setBiasDismissed] = useState(false);

  // Onboarding Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'coach', text: 'Welcome! I am your AI Assistant for the PeopleSync portal. I can help you search/filter candidates in the Recruiter Hub, check onboarding tasks, manage IT accounts, or navigate the calibration system. Try asking me "go to calibration" or "filter John"!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Onboarding Chat History States
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentDraft, setCurrentDraft] = useState<string>('');

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

  // Floating Chat Widget States
  const [chatWidth, setChatWidth] = useState(400); // in px
  const [chatHeight, setChatHeight] = useState(500); // in px
  const [isMinimized, setIsMinimized] = useState(() => {
    const saved = localStorage.getItem('peoplesync_chat_minimized');
    return saved !== null ? saved === 'true' : true; // default to true (iconized)
  });
  const [isResizingChat, setIsResizingChat] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('peoplesync_chat_minimized', String(isMinimized));
  }, [isMinimized]);
  const [chatPosition, setChatPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingChat, setIsDraggingChat] = useState(false);

  // Automatically push the chat box to the right if sidebar expands/collapses and causes an overlap
  React.useEffect(() => {
    if (!chatPosition) return;
    const sidebarWidth = isSidebarCollapsed ? 80 : 288;
    const leftLimit = sidebarWidth + 10;
    if (chatPosition.x < leftLimit) {
      setChatPosition(prev => prev ? { ...prev, x: leftLimit } : null);
    }
  }, [isSidebarCollapsed, chatPosition]);

  // Click outside listener for all dropdowns/popovers
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== 'function') return;

      if (isThemeMenuOpen && !target.closest('.theme-dropdown-container')) {
        setIsThemeMenuOpen(false);
      }
      if (isStageMenuOpen && !target.closest('.stage-dropdown-container')) {
        setIsStageMenuOpen(false);
      }
      if (isOnboardCandDropdownOpen && !target.closest('.onboard-dropdown-container')) {
        setIsOnboardCandDropdownOpen(false);
      }
      if (isFilterDropdownOpen && !target.closest('.rippling-filter-status-container')) {
        setIsFilterDropdownOpen(false);
      }
      if (isSortDropdownOpen && !target.closest('.rippling-sort-container')) {
        setIsSortDropdownOpen(false);
      }
      if (isRipplingFilterOpen && !target.closest('.rippling-filter-popover-container')) {
        setIsRipplingFilterOpen(false);
        setIsFilterDropdownOpen(false);
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick, true);
    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [
    isThemeMenuOpen,
    isStageMenuOpen,
    isOnboardCandDropdownOpen,
    isFilterDropdownOpen,
    isSortDropdownOpen,
    isRipplingFilterOpen
  ]);

  const startResizingChat = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    setIsResizingChat(true);

    // Resolve position before starting
    const initialX = chatPosition?.x ?? (window.innerWidth - chatWidth - 24);
    const initialY = chatPosition?.y ?? (window.innerHeight - chatHeight - 24);

    // Force set the resolved position to state immediately to prevent jumps
    setChatPosition({ x: initialX, y: initialY });

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = chatWidth;
    const startH = chatHeight;
    const startLeft = initialX;
    const startTop = initialY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newW = startW;
      let newH = startH;
      let newLeft = startLeft;
      let newTop = startTop;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const sidebarWidth = isSidebarCollapsed ? 80 : 288;
      const leftLimit = sidebarWidth + 10;

      // Handle horizontal resize
      if (direction.includes('w')) {
        const potentialLeft = startLeft + deltaX;
        // left edge cannot go to the left of the sidebar
        const resolvedLeft = Math.max(leftLimit, potentialLeft);
        const resolvedW = startLeft + startW - resolvedLeft;

        if (resolvedW >= 320) {
          newW = resolvedW;
          newLeft = resolvedLeft;
        }
      } else if (direction.includes('e')) {
        newW = Math.max(320, startW + deltaX);
      }

      // Handle vertical resize
      if (direction.includes('n')) {
        const potentialTop = startTop + deltaY;
        // top edge cannot go beyond the app title height (80px upper bound)
        const resolvedTop = Math.max(80, potentialTop);
        const resolvedH = startTop + startH - resolvedTop;

        if (resolvedH >= 300) {
          newH = resolvedH;
          newTop = resolvedTop;
        }
      } else if (direction.includes('s')) {
        newH = Math.max(300, startH + deltaY);
      }

      // Enforce viewport boundaries
      newW = Math.min(newW, window.innerWidth - leftLimit - 10);
      newH = Math.min(newH, window.innerHeight - 120);

      setChatWidth(newW);
      setChatHeight(newH);
      setChatPosition({ x: newLeft, y: newTop });
    };

    const handleMouseUp = () => {
      setIsResizingChat(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const startDraggingChat = (e: React.MouseEvent) => {
    // Prevent dragging when clicking control buttons in the header
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    e.preventDefault();
    setIsDraggingChat(true);

    const currentX = chatPosition?.x ?? (window.innerWidth - chatWidth - 24);
    const currentY = chatPosition?.y ?? (window.innerHeight - chatHeight - 24);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      const sidebarWidth = isSidebarCollapsed ? 80 : 288;
      const leftLimit = sidebarWidth + 10;

      // Restrict chat boundaries to stay fully inside the browser viewport
      // Left edge must not go left of the sidebar (leftLimit)
      // Top edge must not go higher than 80px (the app title upper bound)
      const newX = Math.max(leftLimit, Math.min(window.innerWidth - chatWidth - 10, currentX + deltaX));
      const newY = Math.max(80, Math.min(window.innerHeight - chatHeight - 10, currentY + deltaY));

      setChatPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDraggingChat(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Calculations
  const completedCount = rawOnboardingItems.filter(item => item.status === 'completed').length;
  const completionPercentage = rawOnboardingItems.length ? Math.round((completedCount / rawOnboardingItems.length) * 100) : 0;

  // Theme Config Class Map
  const themeClassMap = {
    default: '',
    greenhouse: 'theme-greenhouse',
    rippling: 'theme-rippling',
    sunset: 'theme-sunset',
    frontier: 'theme-frontier'
  };

  // Chat Submission Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    if (userText.toLowerCase() === 'clear') {
      setChatMessages([]);
      setInputMessage('');
      return;
    }
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);

    // Save prompt to history
    const updatedHistory = [...promptHistory, userText];
    setPromptHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length);
    setCurrentDraft('');

    setInputMessage('');

    // Simulate Agent Thinking & Response
    setTimeout(() => {
      const lowerText = userText.toLowerCase();
      let responseText = "";
      let agentPrefix = "[AI Assistant]";

      // 1. Determine Agent Sub-Identity (Multi-Agent Assistant)
      const isRecruitingQuery = lowerText.includes('recruit') || lowerText.includes('candidate') || lowerText.includes('greenhouse') || lowerText.includes('john') || lowerText.includes('taylor') || lowerText.includes('stage') || lowerText.includes('pipeline') || lowerText.includes('applied') || lowerText.includes('job');
      const isCalibrationQuery = lowerText.includes('calibrate') || lowerText.includes('calibration') || lowerText.includes('coach') || lowerText.includes('sarah') || lowerText.includes('matrix') || lowerText.includes('performance') || lowerText.includes('bias') || lowerText.includes('rewriting');
      const isOnboardingQuery = lowerText.includes('onboard') || lowerText.includes('checklist') || lowerText.includes('task') || lowerText.includes('slack') || lowerText.includes('github') || lowerText.includes('workspace') || lowerText.includes('jira') || lowerText.includes('rippling') || lowerText.includes('provision');

      if (isRecruitingQuery) {
        agentPrefix = "[Recruiting Specialist]";
      } else if (isCalibrationQuery) {
        agentPrefix = "[Calibration Coach]";
      } else if (isOnboardingQuery) {
        agentPrefix = "[IT Provisioning Buddy]";
      } else {
        agentPrefix = "[AI Assistant]";
      }

      // 2. Process Interactive Navigation & UI Updates
      let uiUpdatedMsg = "";

      // Navigation tabs
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

      // Candidate Selection
      let selectedCand = null;
      if (lowerText.includes('john') || lowerText.includes('john miller')) {
        selectedCand = candidates.find(c => c.name.toLowerCase().includes('john'));
      } else if (lowerText.includes('taylor') || lowerText.includes('taylor chen')) {
        selectedCand = candidates.find(c => c.name.toLowerCase().includes('taylor'));
      }

      if (selectedCand) {
        setSelectedCandidate(selectedCand);
        setInterviewLogged(false);
        setActiveTab('recruit');
        uiUpdatedMsg = ` *(Switched to Recruiter Hub and selected ${selectedCand.name}'s profile)*`;
      }

      // Candidate Searching & Filtering
      let searchMatched = false;
      if (lowerText.includes('filter ') || lowerText.includes('search ') || lowerText.includes('find ') || lowerText.includes('select ') || lowerText.includes('locate ')) {
        const filterKeyword = lowerText
          .replace('filter ', '')
          .replace('search ', '')
          .replace('find ', '')
          .replace('select ', '')
          .replace('locate ', '')
          .trim();
        if (filterKeyword === 'all' || filterKeyword === 'clear' || filterKeyword === 'reset') {
          setCandidateSearchQuery('');
          setCandidateFilterStage('all');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Cleared all candidate search filters)*";
          searchMatched = true;
        } else if (filterKeyword.includes('application') || filterKeyword.includes('review')) {
          setCandidateFilterStage('application');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Application Review' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('recruiter screen') || filterKeyword.includes('screening')) {
          setCandidateFilterStage('recruiter_screen');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Recruiter Screen' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('manager')) {
          setCandidateFilterStage('manager_screen');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Manager Screen' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('technical') || filterKeyword.includes('tech') || filterKeyword.includes('panel')) {
          setCandidateFilterStage('panel_interview');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Panel Interview' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('onsite') || filterKeyword.includes('final')) {
          setCandidateFilterStage('final_interview');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Final Interview' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('offer')) {
          setCandidateFilterStage('offer');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Offer Stage')*";
          searchMatched = true;
        } else if (filterKeyword.includes('archive')) {
          setCandidateFilterStage('archived');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Archived' stage)*";
          searchMatched = true;
        } else if (filterKeyword.includes('hired')) {
          setCandidateFilterStage('hired');
          setCandidateSearchQuery('');
          setActiveTab('recruit');
          uiUpdatedMsg = " *(Filtered candidate list to 'Hired' stage)*";
          searchMatched = true;
        } else if (filterKeyword.length > 1) {
          setCandidateSearchQuery(filterKeyword);
          setCandidateFilterStage('all');
          setIsCandidateSearchOpen(true);
          setActiveTab('recruit');
          uiUpdatedMsg = ` *(Filtered candidate list by: "${filterKeyword}")*`;
          searchMatched = true;
        }
      }

      // 3. Compose response based on context
      if (isRecruitingQuery) {
        if (selectedCand) {
          responseText = `${selectedCand.name} is applying for **${selectedCand.target_job}**. Current Stage: *${selectedCand.stage.replace('_', ' ')}*. Let me know if you would like to review their resume or submit an interview scorecard.`;
        } else if (searchMatched) {
          const matches = candidates.filter(c => {
            const q = (lowerText.replace('filter ', '').replace('search ', '').trim()).toLowerCase();
            const matchesQuery = q === '' || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.target_job.toLowerCase().includes(q);
            // Special checks for commands
            if (q === 'hired' || q.includes('screen') || q === 'all' || q === 'clear' || q === 'reset' || q.includes('offer') || q.includes('onsite') || q.includes('technical') || q.includes('application')) {
              return candidateFilterStage === 'all' || c.stage === candidateFilterStage;
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
        if (lowerText.includes('sarah') || lowerText.includes('smith')) {
          responseText = `Sarah Smith's promotion case is open for Staff Software Engineer. The Peer Feedback Auditor has highlighted a gender-coded term ("bossy"). I recommend accepting the AI rewrite to keep the review objective.`;
        } else if (lowerText.includes('bias') || lowerText.includes('rewrite') || lowerText.includes('accept')) {
          setBiasAccepted(true);
          responseText = `I have updated Sarah Smith's calibration record to accept the objective rewrite. The bias alert is now resolved.`;
          uiUpdatedMsg = " *(Accepted bias rewrite for Sarah Smith)*";
        } else {
          responseText = `You are currently viewing Sarah Smith's Level Alignment Matrix. Her metrics show strong Technical Impact (85%) and Execution (95%), but she needs development support for Leadership (70%).`;
        }
      } else if (isOnboardingQuery) {
        if (lowerText.includes('checklist') || lowerText.includes('task')) {
          const pendingTask = onboardingItems.find(i => i.status === 'pending');
          responseText = `You have completed ${completedCount} out of ${onboardingItems.length} tasks (${completionPercentage}% complete). ${pendingTask ? `The next pending task is: "${pendingTask.name}".` : "All onboarding tasks are completed!"}`;
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

      setChatMessages(prev => [...prev, { sender: 'coach', text: `${agentPrefix} ${responseText}${uiUpdatedMsg}` }]);
    }, 1000);
  };

  // Toggle Onboarding Items
  const toggleOnboardingItem = (id: string) => {
    setEmployees(prev => prev.map(emp => {
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
    }));
  };

  // Delete Onboarding Item
  const deleteOnboardingItem = (id: string) => {
    setEmployees(prev => prev.map(emp => {
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
    }));
  };

  // Save Task Note
  const saveTaskNote = (taskId: string, noteValue: string) => {
    setEmployees(prev => prev.map(emp => {
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
    }));
  };

  // Toggle Rippling Accounts
  const toggleAccountStatus = (appName: string) => {
    setProvisionedAccounts(prev => prev.map(acc => {
      if (acc.app_name === appName) {
        const nextStatus = acc.status === 'active' ? 'pending' : (acc.status === 'pending' ? 'inactive' : 'active');
        return { ...acc, status: nextStatus as 'active' | 'pending' | 'inactive' };
      }
      return acc;
    }));
  };

  return (
    <div className={`min-h-screen font-sans flex transition-all duration-500 ${isMobileView ? 'flex-col' : 'flex-row'} ${isDarkMode ? 'bg-[#0B0F19] text-slate-200' : 'bg-slate-50 text-slate-800 mode-light'} ${themeClassMap[theme]}`}>

      {/* Decorative Glow Elements */}
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full glow-blur animate-pulse-glow z-0"></div>

      {/* 1. Sidebar Container */}
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
                  {!isMobileView && <span className="text-[11px] text-slate-505 font-semibold tracking-wider uppercase">Agent OS Portal</span>}
                </div>
              )}
            </div>
            {!isMobileView && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
              className={`group relative flex items-center transition-all duration-300 font-medium text-sm ${isMobileView && isExtraSmall ? 'px-2 py-1.5' : 'px-3 py-2'} space-x-1.5 ${
                activeTab === 'recruit'
                  ? `bg-primary/10 text-primary font-semibold ${isMobileView ? 'border-b-2 border-primary rounded-t-xl rounded-b-none' : 'border-l-4 border-primary rounded-xl'}`
                  : `${isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'} rounded-xl`
              }`}
            >
              <UserPlus className="w-4.5 h-4.5 shrink-0" />
              <span className={isSidebarCollapsed ? "hidden" : "ml-1 hidden md:inline group-hover:inline"}>Recruiter Hub</span>
              {isSidebarCollapsed && !isMobileView && (
                <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                  Recruiter Hub
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-950' : 'border-r-white'} -mr-[1px]`} />
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
                </div>
              )}
            </button>
 
            <button
              onClick={() => setActiveTab('onboard')}
              title={isSidebarCollapsed && !isMobileView ? undefined : "Onboarding Buddy"}
              className={`group relative flex items-center transition-all duration-300 font-medium text-sm ${isMobileView && isExtraSmall ? 'px-2 py-1.5' : 'px-3 py-2'} space-x-1.5 ${
                activeTab === 'onboard'
                  ? `bg-primary/10 text-primary font-semibold ${isMobileView ? 'border-b-2 border-primary rounded-t-xl rounded-b-none' : 'border-l-4 border-primary rounded-xl'}`
                  : `${isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'} rounded-xl`
              }`}
            >
              <Compass className="w-4.5 h-4.5 shrink-0" />
              <span className={isSidebarCollapsed ? "hidden" : "ml-1 hidden md:inline group-hover:inline"}>Onboarding Buddy</span>
              {isSidebarCollapsed && !isMobileView && (
                <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                  Onboarding Buddy
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-950' : 'border-r-white'} -mr-[1px]`} />
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
                </div>
              )}
            </button>
 
            <button
              onClick={() => setActiveTab('calibrate')}
              title={isSidebarCollapsed && !isMobileView ? undefined : "Calibration Coach"}
              className={`group relative flex items-center transition-all duration-300 font-medium text-sm ${isMobileView && isExtraSmall ? 'px-2 py-1.5' : 'px-3 py-2'} space-x-1.5 ${
                activeTab === 'calibrate'
                  ? `bg-primary/10 text-primary font-semibold ${isMobileView ? 'border-b-2 border-primary rounded-t-xl rounded-b-none' : 'border-l-4 border-primary rounded-xl'}`
                  : `${isDarkMode ? 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'} rounded-xl`
              }`}
            >
              <Activity className="w-4.5 h-4.5 shrink-0" />
              <span className={isSidebarCollapsed ? "hidden" : "ml-1 hidden md:inline group-hover:inline"}>Calibration Coach</span>
              {isSidebarCollapsed && !isMobileView && (
                <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                  Calibration Coach
                  <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-950' : 'border-r-white'} -mr-[1px]`} />
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
                onClick={() => setIsDarkMode(!isDarkMode)}
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
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  title={isSidebarCollapsed && !isMobileView ? undefined : (isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode')}
                  className={`group relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-slate-905 border-slate-800 text-accent hover:text-white' : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 shadow-sm'}`}
                >
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {isSidebarCollapsed && !isMobileView && (
                    <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-955 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                      {isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
                      <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-950' : 'border-r-white'} -mr-[1px]`} />
                      <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
                    </div>
                  )}
                </button>
              ) : (
                <div className={`flex items-center justify-between mb-4 border rounded-xl p-2.5 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-800/40' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                    {isDarkMode ? <Moon className="w-3.5 h-3.5 text-accent animate-pulse" /> : <Sun className="w-3.5 h-3.5 text-amber-505" />}
                    <span>{isDarkMode ? 'Night Mode' : 'Light Mode'}</span>
                  </span>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
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
                  title={isSidebarCollapsed && !isMobileView ? undefined : `Cycle Theme Schema (Current: ${theme})`}
                  className={`group relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}
                >
                  <Sliders className="w-4 h-4 text-primary" />
                  {isSidebarCollapsed && !isMobileView && (
                    <div className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border shadow-lg z-50 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white shadow-black/40' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'}`}>
                      {`Theme: ${
                        theme === 'default' ? 'Anthropic Purple' :
                        theme === 'greenhouse' ? 'Greenhouse Emerald' :
                        theme === 'rippling' ? 'Rippling Blue' :
                        theme === 'sunset' ? 'Sunset Gold' :
                        'Frontier'
                      }`}
                      <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-950' : 'border-r-white'} -mr-[1px]`} />
                      <div className={`absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent ${isDarkMode ? 'border-r-slate-800' : 'border-r-slate-200'} -mr-[2px] -z-10`} />
                    </div>
                  )}
                </button>
              ) : (
                <div className={`rounded-xl p-3 border transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-800/40' : 'bg-white border-slate-200/80 shadow-sm'}`}>
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                    <Sliders className="w-3 h-3" />
                    <span>Active Theme Schema</span>
                  </label>
                  <div className="relative theme-dropdown-container">
                    <button
                      onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
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
                      <>
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
                                setIsThemeMenuOpen(false);
                              }}
                              className={`w-full flex items-center space-x-2 px-3 py-2 text-left text-xs font-medium hover:bg-primary/10 transition-colors ${theme === t.id ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${t.color}`} />
                              <span className="truncate">{t.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
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
            <span className={`text-xs border font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700/50 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}>
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>Local Host Mode</span>
            </span>
          </div>
        </header>

        {/* Dashboards Panels */}
        <div className={`flex-1 p-4 md:p-8 flex flex-col min-h-0 relative ${isResponsiveMode ? 'overflow-y-auto' : ''}`}>

          {/* TAB 1: RECRUITER HUB */}
          {activeTab === 'recruit' && (
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
                        type="text"
                        placeholder="Search name, job..."
                        value={candidateSearchQuery}
                        onChange={(e) => setCandidateSearchQuery(e.target.value)}
                        className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                      />
                      {candidateSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCandidateSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
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
                      <>
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
                      </>
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
                      <div className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-300 shrink-0">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCandidate(cand);
                          setInterviewLogged(false);
                        }}
                        className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 ${selectedCandidate.id === cand.id ? 'bg-primary/10 border-primary/50 text-primary font-semibold shadow-sm' : `${isDarkMode ? 'bg-slate-900/30 border-slate-700/40 text-slate-400 hover:border-slate-600/60' : 'bg-slate-55 border-slate-200 text-slate-655 hover:bg-slate-100/50'}`}`}
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

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isResumeExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                      <div className={`p-4 border-t overflow-auto max-h-80 ${isDarkMode ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                        <pre className={`text-xs font-mono whitespace-pre-wrap ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {selectedCandidate.resume}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Interview feedback submission (Collapsible Accordion) */}
                  <div className={`border rounded-xl mt-6 overflow-hidden transition-all duration-500 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-205 shadow-sm'} ${!isScorecardEnabled ? 'opacity-40 bg-slate-100/5 dark:bg-slate-900/5' : ''}`}>
                    <button
                      disabled={!isScorecardEnabled}
                      onClick={() => setIsScorecardExpanded(!isScorecardExpanded)}
                      className={`w-full flex items-center justify-between p-4 text-left transition-colors ${!isScorecardEnabled ? 'cursor-not-allowed text-slate-400 dark:text-slate-500' : 'cursor-pointer'} ${isDarkMode ? 'bg-slate-900/40 hover:bg-slate-900/60' : 'bg-slate-50 hover:bg-slate-100/70'}`}
                    >
                      <span className={`text-sm font-semibold flex items-center space-x-2 ${!isScorecardEnabled ? 'text-slate-400 dark:text-slate-500' : (isDarkMode ? 'text-slate-200' : 'text-slate-750')}`}>
                        <span>Submit Interview Scorecard</span>
                        {interviewLogged && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Logged
                          </span>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isScorecardExpanded ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
                    </button>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScorecardExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
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
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Logged
                          </span>
                        )}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isEvalNotesExpanded ? 'rotate-180 text-primary' : 'text-slate-400'}`} />
                    </button>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isEvalNotesExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ONBOARDING BUDDY */}
          {activeTab === 'onboard' && (
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
                    <span className={`text-xs font-semibold whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{completionPercentage}% Complete</span>
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
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Select Onboarding Candidate</label>
                    <label className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-primary transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={hideCompletedTasks}
                        onChange={(e) => setHideCompletedTasks(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary w-3 h-3 cursor-pointer"
                      />
                      <span>Hide Completed</span>
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      setIsOnboardCandDropdownOpen(!isOnboardCandDropdownOpen);
                      setOnboardSearchText('');
                    }}
                    className={`w-full flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-primary transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800/50' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-55 shadow-sm'}`}
                  >
                    <span className="flex items-center space-x-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-semibold text-xs">{selectedOnboardCandObj ? selectedOnboardCandObj.name : "Select Candidate"}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {selectedOnboardCandObj?.target_job || 'Hired'}
                      </span>
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {isOnboardCandDropdownOpen && (
                    <>
                      <div className={`absolute top-full left-0 right-0 mt-1 z-50 border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                        {/* Search input inside dropdown */}
                        <div className="p-2 border-b border-slate-700/50 relative">
                          <input
                            ref={onboardCandSearchInputRef}
                            type="text"
                            placeholder="Type candidate name..."
                            value={onboardSearchText}
                            onChange={(e) => setOnboardSearchText(e.target.value)}
                            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on click
                            className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                          />
                          {onboardSearchText && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOnboardSearchText('');
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {/* Onboarding Candidate List */}
                        <div className="max-h-60 overflow-y-auto">
                          {onboardingStageCandidates.length > 0 ? (
                            onboardingStageCandidates.map(cand => (
                              <button
                                key={cand.id}
                                onClick={() => {
                                  setSelectedOnboardCandidateId(cand.id);
                                  setIsOnboardCandDropdownOpen(false);
                                  setOnboardSearchText('');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-medium hover:bg-primary/10 transition-colors border-b last:border-0 ${isDarkMode ? 'border-slate-800/65' : 'border-slate-100'} ${selectedOnboardCandidateId === cand.id ? 'bg-primary/5 font-semibold text-primary' : ''}`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold text-xs">{cand.name}</span>
                                  <span className="text-[10px] opacity-60 mt-0.5">{cand.target_job}</span>
                                </div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                  Onboarding
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-center text-xs text-slate-500">
                              No onboarding candidates found
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress bar */}
                <div className={`w-full h-2.5 rounded-full overflow-hidden mb-6 border ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-200 border-slate-300'}`}>
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>

                {/* Add New Task Inline Form - Only visible in Edit Mode */}
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
                      setCandidateOnboardChecklists(prev => {
                        const currentList = prev[selectedOnboardCandidateId] || [];
                        return {
                          ...prev,
                          [selectedOnboardCandidateId]: [...currentList, newItem]
                        };
                      });
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
                                  setEditingNotes(prev => ({ ...prev, [item.id]: item.note || '' }));
                                  setExpandedTaskNoteId(item.id);
                                }
                              }}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm'}`}
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
                                setEditingNotes(prev => ({ ...prev, [item.id]: val }));
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
                    {/* Collapsible Search Trigger */}
                    <button
                      onClick={() => {
                        setIsRipplingSearchOpen(!isRipplingSearchOpen);
                        if (isRipplingSearchOpen) setRipplingSearchQuery('');
                      }}
                      className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 ${isRipplingSearchOpen ? 'bg-primary/10 border-primary/40 text-primary' : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700')}`}
                      title="Toggle Search"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>

                    {/* Collapsible Search Input */}
                    <div className={`overflow-hidden transition-all duration-300 flex-1 relative ${isRipplingSearchOpen ? 'max-w-md opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}`}>
                      <input
                        ref={ripplingSearchInputRef}
                        type="text"
                        placeholder="Search apps..."
                        value={ripplingSearchQuery}
                        onChange={(e) => setRipplingSearchQuery(e.target.value)}
                        className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
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

                  {/* Collapsible Filter/Sort Popover */}
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
                      <>
                        {/* Popover Card */}
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
                                <>
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
                                </>
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
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-slate-800/40' : 'divide-slate-205'}`}>
                  {processedAccounts.map((acc, index) => (
                    <div
                      key={acc.app_name}
                      draggable={isDragEnabled}
                      onDragStart={(e) => {
                        if (!isDragEnabled) return;
                        setDraggedAccountIndex(index);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        if (!isDragEnabled) return;
                        e.preventDefault();
                      }}
                      onDrop={() => {
                        if (!isDragEnabled || draggedAccountIndex === null || draggedAccountIndex === index) return;
                        const updated = [...provisionedAccounts];
                        const [removed] = updated.splice(draggedAccountIndex, 1);
                        updated.splice(index, 0, removed);
                        setProvisionedAccounts(updated);
                        setDraggedAccountIndex(null);
                      }}
                      onDragEnd={() => setDraggedAccountIndex(null)}
                      className={`grid grid-cols-[auto_2fr_1.2fr_auto] items-center gap-4 py-3.5 border-b last:border-b-0 transition-all duration-300 ${isDarkMode ? 'border-slate-700/40' : 'border-slate-200'} ${draggedAccountIndex === index ? 'opacity-40 scale-[0.98]' : ''}`}
                    >
                      {/* Column 0: Drag Handle */}
                      <div className={`${isDragEnabled ? 'cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300' : 'cursor-not-allowed text-slate-500/20 opacity-30'} p-1 shrink-0`}>
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>

                      {/* Column 1: App Info */}
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

                      {/* Column 2: Status Badge */}
                      <div className="flex justify-start">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center space-x-1.5 ${
                          acc.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : acc.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            acc.status === 'active' 
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

                      {/* Column 3: Refresh Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => toggleAccountStatus(acc.app_name)}
                          className={`p-1.5 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-505 hover:text-slate-707 shadow-sm'}`}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CALIBRATION COACH */}
          {activeTab === 'calibrate' && (
            !selectedCalibrateCandObj ? (
              <div className="flex-1 flex items-center justify-center">
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Loading calibration data…</span>
              </div>
            ) : (
            <div className={`flex-1 flex min-h-0 relative ${isResponsiveMode ? 'flex-col space-y-6' : 'flex-row space-x-2'}`}>

              {/* Feedback Editor Card */}
              <div
                style={isResponsiveMode ? {} : { width: `${calibrateLeftWidth}px` }}
                className={`shrink-0 space-y-6 ${cardClass} ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto h-full pr-3'}`}
              >
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className={`font-display font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>Peer Feedback Auditor</h3>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Calibration analysis for employee: <strong>{selectedCalibrateCandObj.name}</strong></span>
                  </div>

                  {/* Calibration Candidate Search Selector */}
                  <div className="relative shrink-0 calibrate-dropdown-container">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Select Calibration Candidate</label>
                    <button
                      onClick={() => {
                        setIsCalibrateCandDropdownOpen(!isCalibrateCandDropdownOpen);
                        setCalibrateSearchText('');
                      }}
                      className={`w-full flex items-center justify-between border text-xs font-semibold rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-primary transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800/50' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-55 shadow-sm'}`}
                    >
                      <span className="flex items-center space-x-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="font-semibold text-xs">{selectedCalibrateCandObj.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded border ml-2 bg-amber-500/10 text-amber-400 border-amber-500/20">
                          {selectedCalibrateCandObj.target_job}
                        </span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    {isCalibrateCandDropdownOpen && (
                      <>
                        <div className={`absolute top-full left-0 right-0 mt-1 z-50 border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                          {/* Search input inside dropdown */}
                          <div className="p-2 border-b border-slate-700/50 relative">
                            <input
                              ref={calibrateCandSearchInputRef}
                              type="text"
                              placeholder="Type candidate name..."
                              value={calibrateSearchText}
                              onChange={(e) => setCalibrateSearchText(e.target.value)}
                              onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on click
                              className={`w-full text-xs border rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-primary ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                            />
                            {calibrateSearchText && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCalibrateSearchText('');
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-0.5 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Candidate List */}
                          <div className="max-h-48 overflow-y-auto">
                            {calibrationStageCandidates.length === 0 ? (
                              <div className="p-3 text-xs text-slate-500 text-center">No candidates found</div>
                            ) : (
                              calibrationStageCandidates.map(c => (
                                <button
                                  key={c.id}
                                  onClick={() => {
                                    setSelectedCalibrateCandidateId(c.id);
                                    setIsCalibrateCandDropdownOpen(false);
                                  }}
                                  className={`w-full flex flex-col items-start px-3 py-2 text-left hover:bg-primary/10 transition-colors ${selectedCalibrateCandidateId === c.id ? 'bg-primary/5' : ''}`}
                                >
                                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{c.name}</span>
                                  <span className="text-[10px] text-slate-500 truncate w-full">{c.target_job} • {c.department}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                        {/* Transparent overlay to close dropdown when clicking outside */}
                        <div
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => setIsCalibrateCandDropdownOpen(false)}
                        ></div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={`text-xs font-semibold block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-505'}`}>Raw Feedback</label>

                  {/* Feedback text area with active warning */}
                  <div className={`relative border rounded-xl p-5 font-sans leading-relaxed text-sm transition-all duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-slate-350' : 'bg-slate-50 border-slate-200 text-slate-707'}`}>
                    {biasAccepted ? (
                      <p>
                        {selectedCalibrateCandObj.name}'s leadership is assertive, though some colleagues feel {calPronouns.subj} could collaborate more effectively. A specific concern was noted: <span className="bg-emerald-500/10 text-emerald-600 px-1 border border-emerald-500/20 rounded font-medium">{selectedCalibrateCandObj.name} is direct and successfully drives decisions, ensuring clarity in meetings, though {calPronouns.subj} could enhance this by proactively seeking diverse input.</span>
                      </p>
                    ) : (
                      <p>
                        {selectedCalibrateCandObj.name}'s leadership is assertive, though some colleagues feel {calPronouns.subj} could collaborate more effectively. A specific concern was noted: <span className="bg-amber-500/15 text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium inline-flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 inline" />
                          <span>'{calPronouns.subjCap} is too bossy during team meetings.'</span>
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Suggestion Card */}
                  {!biasAccepted && !biasDismissed && (
                    <div className={`border rounded-xl p-5 flex items-start space-x-4 shadow-lg transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-amber-500/20 shadow-amber-500/5' : 'bg-amber-500/5 border border-amber-500/20 shadow-amber-500/2'}`}>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>Unconscious Bias Flagged (Gender Coded Phrasing)</div>
                        <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          The term **"bossy"** is commonly identified as a gender-coded critique that reduces objective performance description. Propose rewriting for constructive calibrating.
                        </p>
                        <div className={`rounded-lg p-3 text-xs border transition-all duration-500 ${isDarkMode ? 'bg-slate-950/60 border-slate-700/50 text-slate-300' : 'bg-white border-slate-200 text-slate-707'}`}>
                          <span className={`font-semibold block mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>AI Recommendation:</span>
                          "{selectedCalibrateCandObj.name} is direct and successfully drives decisions, ensuring clarity in meetings, though {calPronouns.subj} could enhance this by proactively seeking diverse input."
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setBiasAccepted(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            Accept Rewrite
                          </button>
                          <button
                            onClick={() => setBiasDismissed(true)}
                            className={`border font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-600'}`}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {biasDismissed && !biasAccepted && (
                    <div className="flex justify-end pr-2">
                      <button
                        onClick={() => setBiasDismissed(false)}
                        className={`text-xs font-semibold underline transition-colors cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-505'}`}
                      >
                        Show AI recommendation
                      </button>
                    </div>
                  )}

                  {biasAccepted && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs flex items-center space-x-2">
                      <Check className="w-4.5 h-4.5" />
                      <span>Bias correction applied successfully. Calibration record updated in directory.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Drag Handle */}
              <div
                onMouseDown={startResizingCalibrate}
                className={`cursor-col-resize self-stretch flex items-center justify-center group relative z-30 transition-all duration-150 select-none ${isResponsiveMode ? 'hidden' : 'w-2.5 hover:w-3.5'}`}
              >
                <div className={`w-1 group-hover:w-1.5 h-20 rounded bg-slate-550/20 group-hover:bg-primary transition-all ${isResizingCalibrate ? 'bg-primary w-1.5' : ''}`}></div>
              </div>

              {/* Level Alignment matrix card */}
              <div className={`flex-1 space-y-6 ${cardClass} ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto h-full pr-3'}`}>
                <div>
                  <h3 className={`font-display font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>Level Alignment Matrix</h3>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{selectedCalibrateCandObj.name} vs <strong>{selectedCalibrateCandObj.target_job.split(',')[0]}</strong> expectations</span>
                </div>

                <div className="space-y-4">

                  {/* Metric 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Technical Impact</span>
                      <span className="text-primary font-semibold">85% / 90%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-150 border-slate-250'}`}>
                      <div className="bg-gradient-to-r from-primary to-accent h-full w-[85%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Leadership</span>
                      <span className="text-primary font-semibold">70% / 80%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-150 border-slate-250'}`}>
                      <div className="bg-gradient-to-r from-primary to-accent h-full w-[70%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Strategy</span>
                      <span className="text-primary font-semibold">80% / 80%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-150 border-slate-250'}`}>
                      <div className="bg-gradient-to-r from-primary to-accent h-full w-[80%] rounded-full"></div>
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Execution</span>
                      <span className="text-primary font-semibold">95% / 85%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-150 border-slate-250'}`}>
                      <div className="bg-gradient-to-r from-primary to-accent h-full w-[95%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-4 border text-xs leading-relaxed space-y-2 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-slate-50 border-slate-200 text-slate-606'}`}>
                  <div className={`font-semibold flex items-center space-x-1.5 ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span>Promotion Recommendation</span>
                  </div>
                  <p>
                    Strong alignment across Strategy and Execution, meeting the baseline for Staff Engineer II. Recommended for promotion path with development support for Leadership behaviors.
                  </p>
                </div>
              </div>

            </div>
            )
          )}


        </div>
      </main>

      {/* Floating Scalable AI Chat Widget */}
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
            ...(chatPosition ? { left: `${chatPosition.x}px`, top: `${chatPosition.y}px`, bottom: 'auto', right: 'auto' } : {})
          }}
          className={`fixed bottom-6 right-6 md:right-8 z-40 border backdrop-blur-xl rounded-2xl flex flex-col shadow-2xl transition-colors duration-500 overflow-hidden ${isResizingChat ? 'border-primary ring-2 ring-primary/20' : ''} ${isDraggingChat ? 'border-accent ring-2 ring-accent/20' : ''} ${isDarkMode ? 'bg-slate-955/90 border-slate-800/80' : 'bg-white/95 border-slate-202 shadow-sm'}`}
        >
          {/* Resizers */}
          {!isMobileView && (
            <>
              {/* Edges */}
              <div
                onMouseDown={(e) => startResizingChat(e, 'n')}
                className="absolute -top-1 left-3 right-3 h-3 cursor-ns-resize z-50 hover:bg-primary/30 transition-colors"
              />
              <div
                onMouseDown={(e) => startResizingChat(e, 's')}
                className="absolute -bottom-1.5 left-0 right-0 h-4 cursor-ns-resize z-50 hover:bg-primary/30 transition-colors"
              />
              <div
                onMouseDown={(e) => startResizingChat(e, 'e')}
                className="absolute top-3 bottom-3 -right-1 w-3 cursor-ew-resize z-50 hover:bg-primary/30 transition-colors"
              />
              <div
                onMouseDown={(e) => startResizingChat(e, 'w')}
                className="absolute top-3 bottom-3 -left-1 w-3 cursor-ew-resize z-50 hover:bg-primary/30 transition-colors"
              />
              {/* Corners */}
              <div
                onMouseDown={(e) => startResizingChat(e, 'nw')}
                className="absolute top-0 left-0 w-3.5 h-3.5 cursor-nwse-resize z-50 hover:bg-primary/30 transition-colors"
              />
              <div
                onMouseDown={(e) => startResizingChat(e, 'ne')}
                className="absolute top-0 right-0 w-3.5 h-3.5 cursor-nesw-resize z-50 hover:bg-primary/30 transition-colors"
              />
              <div
                onMouseDown={(e) => startResizingChat(e, 'sw')}
                className="absolute bottom-0 left-0 w-3.5 h-3.5 cursor-nesw-resize z-50 hover:bg-primary/30 transition-colors"
              />
              <div
                onMouseDown={(e) => startResizingChat(e, 'se')}
                className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-nwse-resize z-50 hover:bg-primary/30 transition-colors"
              />

              {/* Bottom Right Resize Grip Visual Indicator */}
              <div className="absolute bottom-1 right-1 pointer-events-none z-30">
                <svg width="10" height="10" viewBox="0 0 10 10" className={`w-2.5 h-2.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <line x1="8" y1="10" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="5" y1="10" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="2" y1="10" x2="10" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </>
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
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-r from-primary to-accent text-white rounded-tr-none font-medium' : `rounded-tl-none border ${isDarkMode ? 'bg-slate-900 border-slate-800/60 text-slate-205' : 'bg-slate-100 border-slate-205 text-slate-800'}`}`}>
                  {msg.text}
                </div>
              </div>
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
}
