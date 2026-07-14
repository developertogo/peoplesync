import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: 'application' | 'recruiter_screen' | 'manager_screen' | 'panel_interview' | 'final_interview' | 'offer' | 'archived' | 'hired';
  target_job: string;
  department: string;
  pronouns: string;
  resume: string;
}

export interface Employee {
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

export const INITIAL_CANDIDATES: Candidate[] = [
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
    id: "cnd_004",
    name: "Mary Smith",
    email: "mary.smith@gmail.com",
    phone: "+1-808-555-0155",
    stage: "hired",
    target_job: "Frontend Engineer, Design Systems",
    department: "Product Design",
    pronouns: "she/her",
    resume: "MARY SMITH\nEmail: mary.smith@gmail.com | Phone: +1-808-555-0155 | Austin, TX\n\nEXPERIENCE\nFrontend Engineer at Design Systems Corp (2023 - Present)\n- Developed reusable component library using React, TypeScript, and TailwindCSS.\n- Syncing UI tokens and design variables between Figma and React codebases.\n\nEDUCATION\nB.S. in Computer Science - University of Texas at Austin"
  },
  {
    id: "cnd_003",
    name: "Lisa Vance",
    email: "lisa.vance@gmail.com",
    phone: "+1-808-555-0133",
    stage: "panel_interview",
    target_job: "Senior Product Designer",
    department: "Product Design",
    pronouns: "she/her",
    resume: "LISA VANCE\nEmail: lisa.vance@gmail.com | Phone: +1-808-555-0133 | Seattle, WA\n\nEXPERIENCE\nSenior Product Designer at DesignStudio (2020 - Present)\n- Led UX redesign of flagship enterprise platform, increasing user activation by 25%.\n- Designed complex workflow visualization systems and interactive components.\n- Expert in Figma, React prototyping, and responsive design frameworks.\n\nEDUCATION\nB.F.A. in Interaction Design - Carnegie Mellon University"
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp_001",
    name: "Sarah Jenkins",
    personal_email: "sarah.jenkins@gmail.com",
    work_email: "sarah.jenkins@example.com",
    title: "Director of Engineering, People Products",
    target_job: "Director of Engineering, People Products",
    department: "Applied AI / People Products",
    pronouns: "she/her",
    onboarding: {
      items: []
    }
  },
  {
    id: "emp_002",
    name: "Alex Rivera",
    personal_email: "alex.rivera@gmail.com",
    work_email: "alex.rivera@example.com",
    title: "Software Engineer, Onboarding Experience",
    target_job: "Software Engineer, Onboarding Experience",
    department: "Applied AI",
    pronouns: "he/his",
    onboarding: {
      items: [
        { id: "task_01", name: "Review Codebase Setup", status: "completed" as const },
        { id: "task_02", name: "Read Security Guidelines", status: "completed" as const },
        { id: "task_03", name: "Set up Local Dev Environment", status: "completed" as const },
        { id: "task_04", name: "Submit Onboarding Feedback", status: "completed" as const },
        { id: "task_05", name: "First 1:1 with Sarah", status: "completed" as const }
      ]
    }
  },
  {
    id: "emp_003",
    name: "Morgan Brown",
    personal_email: "morgan.brown@gmail.com",
    work_email: "morgan.brown@example.com",
    title: "Senior Product Engineer, Feedback Tools",
    target_job: "Senior Product Engineer, Feedback Tools",
    department: "Product Management",
    pronouns: "she/her",
    onboarding: {
      items: [
        { id: "task_01", name: "Review Codebase Setup", status: "pending" as const }
      ]
    }
  },
  {
    id: "emp_004",
    name: "Taylor Chen",
    personal_email: "taylor.chen@gmail.com",
    work_email: "taylor.chen@example.com",
    title: "AI Product Engineer",
    target_job: "AI Product Engineer",
    department: "Applied AI",
    pronouns: "she/her",
    onboarding: {
      items: [
        { id: "task_01", name: "Accepted Offer", status: "completed" as const },
        { id: "task_02", name: "Request Computer and Other Equipment", status: "completed" as const },
        { id: "task_03", name: "Review Codebase Setup", status: "completed" as const },
        { id: "task_04", name: "Read Security Guidelines", status: "completed" as const },
        { id: "task_05", name: "Set up Local Dev Environment", status: "completed" as const },
        { id: "task_06", name: "Health Benefits Enrollment", status: "pending" as const },
        { id: "task_07", name: "Submit Onboarding Feedback", status: "pending" as const },
        { id: "task_08", name: "First 1:1 with Sarah", status: "pending" as const }
      ]
    }
  },
  {
    id: "emp_005",
    name: "Mary Smith",
    personal_email: "mary.smith@gmail.com",
    work_email: "mary.smith@example.com",
    title: "Frontend Engineer, Design Systems",
    target_job: "Frontend Engineer, Design Systems",
    department: "Product Design",
    pronouns: "she/her",
    onboarding: {
      items: [
        { id: "task_01", name: "Accepted Offer", status: "completed" as const },
        { id: "task_02", name: "Request Computer and Other Equipment", status: "completed" as const },
        { id: "task_03", name: "Review Codebase Setup", status: "completed" as const },
        { id: "task_04", name: "Read Security Guidelines", status: "pending" as const },
        { id: "task_05", name: "Set up Local Dev Environment", status: "pending" as const },
        { id: "task_06", name: "Health Benefits Enrollment", status: "pending" as const },
        { id: "task_07", name: "Submit Onboarding Feedback", status: "pending" as const },
        { id: "task_08", name: "First 1:1 with Sarah", status: "pending" as const }
      ]
    }
  }
];

export const INITIAL_PROVISIONED_ACCOUNTS = [
  { app_name: "Slack", account_email: "alex.rivera@example.com", status: "active" as const },
  { app_name: "GitHub", account_email: "alex.rivera@example.com", status: "pending" as const },
  { app_name: "Google Workspace", account_email: "alex.rivera@example.com", status: "active" as const },
  { app_name: "Jira", account_email: "alex.rivera@example.com", status: "pending" as const }
];


const BACKEND_API_URL = "http://localhost:49134/api/db";
const USE_LOCAL_DB_JSON = (import.meta as any).env.VITE_USE_LOCAL_DB_JSON === 'true';

export interface Feedback {
  id: string;
  reviewer: string;
  originalText: string;
  originalHighlight: string;
  rewrittenText: string;
  rewrittenHighlight: string;
  biasExplanation: string;
  flaggedTerm: string;
  biasAccepted: boolean;
  biasDismissed: boolean;
  isExpanded: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'coach';
  text: string;
}

export interface ProvisionedAccount {
  app_name: string;
  account_email: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface PeopleState {
  // Navigation
  activeTab: 'recruit' | 'onboard' | 'calibrate';
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  isThemeMenuOpen: boolean;

  // Candidates
  candidates: Candidate[];
  selectedCandidate: Candidate;
  draggedCandidateIndex: number | null;
  candidateSearchQuery: string;
  candidateFilterStage: 'all' | 'application' | 'recruiter_screen' | 'manager_screen' | 'panel_interview' | 'final_interview' | 'offer' | 'archived' | 'hired';
  isCandidateSearchOpen: boolean;
  isStageMenuOpen: boolean;
  isResumeExpanded: boolean;
  isScorecardExpanded: boolean;
  evaluationNotes: string;
  isEvalNotesExpanded: boolean;
  evalNotesLogged: boolean;
  evalError: string;

  // Onboarding & Rippling
  employees: Employee[];
  selectedOnboardCandidateId: string;
  newOnboardingItemName: string;
  isEditingChecklist: boolean;
  onboardSearchText: string;
  hideCompletedTasks: boolean;
  expandedTaskNoteId: string | null;
  editingNotes: Record<string, string>;
  provisionedAccounts: ProvisionedAccount[];
  isRipplingSearchOpen: boolean;
  isRipplingFilterOpen: boolean;
  isFilterDropdownOpen: boolean;
  isSortDropdownOpen: boolean;
  ripplingSearchQuery: string;
  ripplingFilterStatus: 'all' | 'active' | 'pending' | 'inactive';
  ripplingSortOrder: 'default' | 'active-first' | 'pending-first' | 'inactive-first';
  isOnboardCandDropdownOpen: boolean;

  // Calibration & Bias
  selectedCalibrateCandidateId: string;
  isCalibrateCandDropdownOpen: boolean;
  calibrateSearchText: string;
  feedbacksMap: Record<string, Feedback[]>;

  // AI Chat Messages
  chatMessages: ChatMessage[];
  inputMessage: string;
  promptHistory: string[];
  historyIndex: number;
  currentDraft: string;
  chatWidth: number;
  chatHeight: number;
  isMinimized: boolean;
  isResizingChat: boolean;
  chatPosition: { x: number; y: number } | null;
  isDraggingChat: boolean;
}

export interface PeopleActions {
  // Navigation setter
  setActiveTab: (tab: 'recruit' | 'onboard' | 'calibrate') => void;
  setDarkMode: (darkMode: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setThemeMenuOpen: (open: boolean) => void;

  // Candidates setter
  setCandidates: (cands: Candidate[]) => void;
  setSelectedCandidate: (cand: Candidate) => void;
  setDraggedCandidateIndex: (idx: number | null) => void;
  setCandidateSearchQuery: (query: string) => void;
  setCandidateFilterStage: (stage: PeopleState['candidateFilterStage']) => void;
  setIsCandidateSearchOpen: (open: boolean) => void;
  setIsStageMenuOpen: (open: boolean) => void;
  setIsResumeExpanded: (expanded: boolean) => void;
  setIsScorecardExpanded: (expanded: boolean) => void;
  setEvaluationNotes: (notes: string) => void;
  setIsEvalNotesExpanded: (expanded: boolean) => void;
  setEvalNotesLogged: (logged: boolean) => void;
  setEvalError: (err: string) => void;

  // Onboarding & Rippling setter
  setEmployees: (emps: Employee[]) => void;
  setSelectedOnboardCandidateId: (id: string) => void;
  setNewOnboardingItemName: (name: string) => void;
  setIsEditingChecklist: (editing: boolean) => void;
  setOnboardSearchText: (text: string) => void;
  setHideCompletedTasks: (hide: boolean) => void;
  setExpandedTaskNoteId: (id: string | null) => void;
  setEditingNotes: (notes: Record<string, string>) => void;
  setProvisionedAccounts: (accs: ProvisionedAccount[]) => void;
  setIsRipplingSearchOpen: (open: boolean) => void;
  setIsRipplingFilterOpen: (open: boolean) => void;
  setIsFilterDropdownOpen: (open: boolean) => void;
  setIsSortDropdownOpen: (open: boolean) => void;
  setRipplingSearchQuery: (query: string) => void;
  setRipplingFilterStatus: (status: PeopleState['ripplingFilterStatus']) => void;
  setRipplingSortOrder: (order: PeopleState['ripplingSortOrder']) => void;
  setIsOnboardCandDropdownOpen: (open: boolean) => void;

  // Calibration setter
  setSelectedCalibrateCandidateId: (id: string) => void;
  setIsCalibrateCandDropdownOpen: (open: boolean) => void;
  setCalibrateSearchText: (text: string) => void;
  toggleFeedbackExpanded: (fbId: string) => void;
  toggleAllFeedbacksExpanded: () => void;
  setFeedbackBiasAccepted: (fbId: string, accepted: boolean) => void;
  setFeedbackBiasDismissed: (fbId: string, dismissed: boolean) => void;

  // Chat Widget setter
  setChatMessages: (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  setInputMessage: (msg: string) => void;
  setPromptHistory: (history: string[]) => void;
  setHistoryIndex: (idx: number) => void;
  setCurrentDraft: (draft: string) => void;
  setChatWidth: (w: number) => void;
  setChatHeight: (h: number) => void;
  setIsMinimized: (min: boolean) => void;
  setIsResizingChat: (res: boolean) => void;
  setChatPosition: (pos: { x: number; y: number } | null) => void;
  setIsDraggingChat: (drag: boolean) => void;

  // Fetch / Sync Actions
  fetchDb: () => Promise<void>;
  syncWithBackend: (newEmployees?: Employee[]) => Promise<void>;
}

export type PeopleStore = PeopleState & PeopleActions;

export const usePeopleStore = create<PeopleStore>()(
  subscribeWithSelector((set, get) => ({
    // Navigation default state
    activeTab: (() => {
      const saved = localStorage.getItem('peoplesync_active_tab');
      if (saved === 'recruit' || saved === 'onboard' || saved === 'calibrate') return saved;
      return 'recruit';
    })(),
    isDarkMode: (() => {
      const saved = localStorage.getItem('peoplesync_theme');
      return saved !== null ? saved === 'dark' : true;
    })(),
    isSidebarCollapsed: false,
    isThemeMenuOpen: false,

    // Candidates default state
    candidates: INITIAL_CANDIDATES,
    selectedCandidate: (() => {
      const savedId = localStorage.getItem('peoplesync_selected_candidate_id');
      if (savedId) {
        const match = INITIAL_CANDIDATES.find(c => c.id === savedId);
        if (match) return match;
      }
      return INITIAL_CANDIDATES[0];
    })(),
    draggedCandidateIndex: null,
    candidateSearchQuery: '',
    candidateFilterStage: 'all',
    isCandidateSearchOpen: false,
    isStageMenuOpen: false,
    isResumeExpanded: false,
    isScorecardExpanded: false,
    evaluationNotes: '',
    isEvalNotesExpanded: false,
    evalNotesLogged: false,
    evalError: '',

    // Onboarding & Rippling default state
    employees: INITIAL_EMPLOYEES,
    selectedOnboardCandidateId: 'emp_005',
    newOnboardingItemName: '',
    isEditingChecklist: false,
    onboardSearchText: '',
    hideCompletedTasks: false,
    expandedTaskNoteId: null,
    editingNotes: {},
    provisionedAccounts: INITIAL_PROVISIONED_ACCOUNTS,
    isRipplingSearchOpen: false,
    isRipplingFilterOpen: false,
    isFilterDropdownOpen: false,
    isSortDropdownOpen: false,
    ripplingSearchQuery: '',
    ripplingFilterStatus: 'all',
    ripplingSortOrder: 'default',
    isOnboardCandDropdownOpen: false,

    // Calibration default state
    selectedCalibrateCandidateId: 'emp_005',
    isCalibrateCandDropdownOpen: false,
    calibrateSearchText: '',
    feedbacksMap: {
      "emp_001": [
        {
          id: "fb_1",
          reviewer: "Peer Reviewer 1 (Tech Lead)",
          originalText: "Sarah's leadership is assertive, though some colleagues feel she could collaborate more effectively. A specific concern was noted: 'She is too bossy during team meetings.'",
          originalHighlight: "'She is too bossy during team meetings.'",
          rewrittenText: "Sarah's leadership is assertive, though some colleagues feel she could collaborate more effectively. A specific concern was noted: Sarah is direct and successfully drives decisions, ensuring clarity in meetings, though she could enhance this by proactively seeking diverse input.",
          rewrittenHighlight: "Sarah is direct and successfully drives decisions, ensuring clarity in meetings, though she could enhance this by proactively seeking diverse input.",
          biasExplanation: "The term \"bossy\" is commonly identified as a gender-coded critique that reduces objective performance description. Propose rewriting for constructive calibrating.",
          flaggedTerm: "bossy",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        },
        {
          id: "fb_2",
          reviewer: "Peer Reviewer 2 (Senior Engineer)",
          originalText: "She has outstanding technical delivery, but at times she gets too emotional when architectural proposals are challenged.",
          originalHighlight: "gets too emotional",
          rewrittenText: "She has outstanding technical delivery, but at times she is highly passionate and invested when architectural proposals are challenged.",
          rewrittenHighlight: "is highly passionate and invested",
          biasExplanation: "The term \"emotional\" is disproportionately applied to women in professional reviews, often undermining their arguments. Propose focusing on passion or professional style.",
          flaggedTerm: "emotional",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        },
        {
          id: "fb_3",
          reviewer: "Peer Reviewer 3 (Tech Lead)",
          originalText: "Sarah is brilliant but some team members feel she is abrasive when reviews point out minor mistakes.",
          originalHighlight: "abrasive when reviews point out minor mistakes",
          rewrittenText: "Sarah is brilliant but some team members feel she is extremely direct and detail-focused when reviews point out minor mistakes.",
          rewrittenHighlight: "extremely direct and detail-focused",
          biasExplanation: "The term \"abrasive\" is heavily gender-coded to describe women who communicate directly. Propose characterizing it constructively as directness and high focus.",
          flaggedTerm: "abrasive",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        }
      ],
      "emp_004": [
        {
          id: "fb_1",
          reviewer: "Peer Reviewer 1 (Product Manager)",
          originalText: "Taylor is highly detail-oriented, but she is sometimes perceived as aggressive when explaining design choices.",
          originalHighlight: "perceived as aggressive",
          rewrittenText: "Taylor is highly detail-oriented, but she is sometimes perceived as firm and direct when explaining design choices.",
          rewrittenHighlight: "perceived as firm and direct",
          biasExplanation: "The term \"aggressive\" is often gender-coded when applied to women asserting expertise. Propose renaming to 'firm' or 'direct'.",
          flaggedTerm: "aggressive",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        }
      ],
      "emp_005": [
        {
          id: "fb_1",
          reviewer: "Peer Reviewer 1 (Designer)",
          originalText: "Mary works well within constraints but she tends to be overly quiet and lacks the aggressive drive expected at next levels.",
          originalHighlight: "lacks the aggressive drive",
          rewrittenText: "Mary works well within constraints but she tends to be reserved and could benefit from proactive communication to showcase her drive.",
          rewrittenHighlight: "tends to be reserved and could benefit from proactive communication to showcase her drive",
          biasExplanation: "Critiques like \"lacks aggressive drive\" place emphasis on aggressive traits that may not align with collaborative engineering styles. Propose coaching constructive actions instead.",
          flaggedTerm: "aggressive drive",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        }
      ],
      "emp_003": [
        {
          id: "fb_1",
          reviewer: "Peer Reviewer 1 (Technical Writer)",
          originalText: "Morgan writes very precise specifications, but he is frequently stubborn during refinement sessions when scope changes are proposed.",
          originalHighlight: "stubborn during refinement",
          rewrittenText: "Morgan writes very precise specifications, but he is highly committed to project constraints during refinement sessions when scope changes are proposed.",
          rewrittenHighlight: "highly committed to project constraints",
          biasExplanation: "The term \"stubborn\" can be rewritten to constructively describe Morgan's adherence to project constraints and scope rules.",
          flaggedTerm: "stubborn",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        }
      ],
      "emp_002": [
        {
          id: "fb_1",
          reviewer: "Peer Reviewer 1 (VP of Engineering)",
          originalText: "Alex handles incident resolution exceptionally well, but he behaves like an old-school commander under pressure.",
          originalHighlight: "behaves like an old-school commander",
          rewrittenText: "Alex handles incident resolution exceptionally well, but he adopts a highly structured and directive style under pressure.",
          rewrittenHighlight: "adopts a highly structured and directive style",
          biasExplanation: "Describing leadership as an \"old-school commander\" uses archaic hierarchical framing. Propose focusing on structured leadership style.",
          flaggedTerm: "old-school commander",
          biasAccepted: false,
          biasDismissed: false,
          isExpanded: true
        }
      ]
    },

    // Chat defaults
    chatMessages: [
      { sender: 'coach', text: 'Welcome! I am your AI Assistant for the PeopleSync portal. I can help you search/filter candidates in the Recruiter Hub, check onboarding tasks, manage IT accounts, or navigate the calibration system. Try asking me "go to calibration" or "filter John"!' }
    ],
    inputMessage: '',
    promptHistory: [],
    historyIndex: -1,
    currentDraft: '',
    chatWidth: 400,
    chatHeight: 500,
    isMinimized: (() => {
      const saved = localStorage.getItem('peoplesync_chat_minimized');
      return saved !== null ? saved === 'true' : true;
    })(),
    isResizingChat: false,
    chatPosition: null,
    isDraggingChat: false,

    // Navigation actions
    setActiveTab: (activeTab) => {
      set({ activeTab });
      localStorage.setItem('peoplesync_active_tab', activeTab);
    },
    setDarkMode: (isDarkMode) => {
      set({ isDarkMode });
      localStorage.setItem('peoplesync_theme', isDarkMode ? 'dark' : 'light');
    },
    setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
    setThemeMenuOpen: (isThemeMenuOpen) => set({ isThemeMenuOpen }),

    // Candidate actions
    setCandidates: (candidates) => set({ candidates }),
    setSelectedCandidate: (selectedCandidate) => {
      set({ selectedCandidate });
      localStorage.setItem('peoplesync_selected_candidate_id', selectedCandidate.id);
    },
    setDraggedCandidateIndex: (draggedCandidateIndex) => set({ draggedCandidateIndex }),
    setCandidateSearchQuery: (candidateSearchQuery) => set({ candidateSearchQuery }),
    setCandidateFilterStage: (candidateFilterStage) => set({ candidateFilterStage }),
    setIsCandidateSearchOpen: (isCandidateSearchOpen) => set({ isCandidateSearchOpen }),
    setIsStageMenuOpen: (isStageMenuOpen) => set({ isStageMenuOpen }),
    setIsResumeExpanded: (isResumeExpanded) => set({ isResumeExpanded }),
    setIsScorecardExpanded: (isScorecardExpanded) => set({ isScorecardExpanded }),
    setEvaluationNotes: (evaluationNotes) => set({ evaluationNotes }),
    setIsEvalNotesExpanded: (isEvalNotesExpanded) => set({ isEvalNotesExpanded }),
    setEvalNotesLogged: (evalNotesLogged) => set({ evalNotesLogged }),
    setEvalError: (evalError) => set({ evalError }),

    // Onboarding actions
    setEmployees: (employees) => set({ employees }),
    setSelectedOnboardCandidateId: (selectedOnboardCandidateId) => set({ selectedOnboardCandidateId }),
    setNewOnboardingItemName: (newOnboardingItemName) => set({ newOnboardingItemName }),
    setIsEditingChecklist: (isEditingChecklist) => set({ isEditingChecklist }),
    setOnboardSearchText: (onboardSearchText) => set({ onboardSearchText }),
    setHideCompletedTasks: (hideCompletedTasks) => set({ hideCompletedTasks }),
    setExpandedTaskNoteId: (expandedTaskNoteId) => set({ expandedTaskNoteId }),
    setEditingNotes: (editingNotes) => set({ editingNotes }),
    setProvisionedAccounts: (provisionedAccounts) => set({ provisionedAccounts }),
    setIsRipplingSearchOpen: (isRipplingSearchOpen) => set({ isRipplingSearchOpen }),
    setIsRipplingFilterOpen: (isRipplingFilterOpen) => set({ isRipplingFilterOpen }),
    setIsFilterDropdownOpen: (isFilterDropdownOpen) => set({ isFilterDropdownOpen }),
    setIsSortDropdownOpen: (isSortDropdownOpen) => set({ isSortDropdownOpen }),
    setRipplingSearchQuery: (ripplingSearchQuery) => set({ ripplingSearchQuery }),
    setRipplingFilterStatus: (ripplingFilterStatus) => set({ ripplingFilterStatus }),
    setRipplingSortOrder: (ripplingSortOrder) => set({ ripplingSortOrder }),
    setIsOnboardCandDropdownOpen: (isOnboardCandDropdownOpen) => set({ isOnboardCandDropdownOpen }),

    // Calibration actions
    setSelectedCalibrateCandidateId: (selectedCalibrateCandidateId) => set({ selectedCalibrateCandidateId }),
    setIsCalibrateCandDropdownOpen: (isCalibrateCandDropdownOpen) => set({ isCalibrateCandDropdownOpen }),
    setCalibrateSearchText: (calibrateSearchText) => set({ calibrateSearchText }),
    toggleFeedbackExpanded: (fbId) => {
      const { feedbacksMap, selectedCalibrateCandidateId } = get();
      const list = feedbacksMap[selectedCalibrateCandidateId] || [];
      const updatedList = list.map(fb => fb.id === fbId ? { ...fb, isExpanded: !fb.isExpanded } : fb);
      set({ feedbacksMap: { ...feedbacksMap, [selectedCalibrateCandidateId]: updatedList } });
    },
    toggleAllFeedbacksExpanded: () => {
      const { feedbacksMap, selectedCalibrateCandidateId } = get();
      const list = feedbacksMap[selectedCalibrateCandidateId] || [];
      const anyExpanded = list.some(fb => fb.isExpanded);
      const updatedList = list.map(fb => ({ ...fb, isExpanded: !anyExpanded }));
      set({ feedbacksMap: { ...feedbacksMap, [selectedCalibrateCandidateId]: updatedList } });
    },
    setFeedbackBiasAccepted: (fbId, accepted) => {
      const { feedbacksMap, selectedCalibrateCandidateId } = get();
      const list = feedbacksMap[selectedCalibrateCandidateId] || [];
      const updatedList = list.map(fb => fb.id === fbId ? { ...fb, biasAccepted: accepted } : fb);
      set({ feedbacksMap: { ...feedbacksMap, [selectedCalibrateCandidateId]: updatedList } });
    },
    setFeedbackBiasDismissed: (fbId, dismissed) => {
      const { feedbacksMap, selectedCalibrateCandidateId } = get();
      const list = feedbacksMap[selectedCalibrateCandidateId] || [];
      const updatedList = list.map(fb => fb.id === fbId ? { ...fb, biasDismissed: dismissed } : fb);
      set({ feedbacksMap: { ...feedbacksMap, [selectedCalibrateCandidateId]: updatedList } });
    },

    // Chat actions
    setChatMessages: (chatMessages) => {
      if (typeof chatMessages === 'function') {
        set({ chatMessages: chatMessages(get().chatMessages) });
      } else {
        set({ chatMessages });
      }
    },
    setInputMessage: (inputMessage) => set({ inputMessage }),
    setPromptHistory: (promptHistory) => set({ promptHistory }),
    setHistoryIndex: (historyIndex) => set({ historyIndex }),
    setCurrentDraft: (currentDraft) => set({ currentDraft }),
    setChatWidth: (chatWidth) => set({ chatWidth }),
    setChatHeight: (chatHeight) => set({ chatHeight }),
    setIsMinimized: (isMinimized) => {
      set({ isMinimized });
      localStorage.setItem('peoplesync_chat_minimized', String(isMinimized));
    },
    setIsResizingChat: (isResizingChat) => set({ isResizingChat }),
    setChatPosition: (chatPosition) => set({ chatPosition }),
    setIsDraggingChat: (isDraggingChat) => set({ isDraggingChat }),

    // Fetch API
    fetchDb: async () => {
      try {
        const resp = await fetch(BACKEND_API_URL);
        if (!resp.ok) throw new Error('Network error');
        const db = await resp.json();
        
        const mappedCandidates = db.candidates.map((c: any) => ({
          ...INITIAL_CANDIDATES.find(ic => ic.id === c.id),
          ...c
        }));
        
        const mappedEmployees = db.employees.map((e: any) => ({
          ...INITIAL_EMPLOYEES.find(ie => ie.id === e.id),
          ...e,
          onboarding: {
            ...e.onboarding,
            items: e.onboarding.items.map((item: any) => ({
              ...item,
              id: item.id,
              name: item.name,
              status: item.status
            }))
          }
        }));
        
        set({
          candidates: mappedCandidates,
          employees: mappedEmployees
        });
        
        const currentSelectedCandidate = get().selectedCandidate;
        if (currentSelectedCandidate) {
          const freshCand = mappedCandidates.find((c: any) => c.id === currentSelectedCandidate.id);
          if (freshCand) {
            set({ selectedCandidate: freshCand });
          }
        }
      } catch (e) {
        if (typeof (globalThis as any).process === 'undefined' || (globalThis as any).process.env.NODE_ENV !== 'test') {
          console.warn('Backend server not responding, using static local constants:', e);
        }
      }
    },

    // Sync API
    syncWithBackend: async (newEmployees) => {
      if (USE_LOCAL_DB_JSON) return;
      try {
        const resp = await fetch(BACKEND_API_URL);
        if (!resp.ok) throw new Error('HTTP request failed');
        const db = await resp.json();

        const activeEmployees = newEmployees || get().employees;

        db.employees = db.employees.map((e: any) => {
          const match = activeEmployees.find(ne => ne.id === e.id);
          if (match) {
            return {
              ...e,
              onboarding: {
                ...e.onboarding,
                items: match.onboarding.items.map((item: any) => ({
                  id: item.id,
                  name: item.name,
                  status: item.status
                }))
              }
            };
          }
          return e;
        });

        await fetch(BACKEND_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(db)
        });
      } catch (e) {
        if (typeof (globalThis as any).process === 'undefined' || (globalThis as any).process.env.NODE_ENV !== 'test') {
          console.error('Failed to save to backend DB:', e);
        }
      }
    }
  }))
);
