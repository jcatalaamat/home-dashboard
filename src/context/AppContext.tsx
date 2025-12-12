'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Project,
  Task,
  DailyIntent,
  PipelineDeal,
  Note,
  ContentItem,
  Transaction,
  MealPlan,
  ShoppingItem,
  FamilyEvent,
  Routine,
  HabitLog,
  Goal,
  WeeklyReview,
  DailyCheckIn,
  GoalActivity,
  Area,
  InboxItem,
  AreaType,
  NewProject,
  NewTask,
  NewDeal,
  NewNote,
  NewContentItem,
  NewTransaction,
  NewMealPlan,
  NewShoppingItem,
  NewFamilyEvent,
  NewRoutine,
  NewGoal,
  NewWeeklyReview,
  NewDailyCheckIn,
  NewGoalActivity,
  NewArea,
  NewInboxItem,
  AppState,
  Quarter,
} from '@/types';

// Generate unique IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Get today's date as YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];

// Get Monday of current week
const getWeekStart = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(today.setDate(diff)).toISOString().split('T')[0];
};

// Default Areas (seeded on first load)
const defaultAreas: Area[] = [
  { id: 'area-health', name: 'Health', type: 'life', icon: '💪', color: '#22C55E', order: 1, createdAt: new Date().toISOString() },
  { id: 'area-family', name: 'Family', type: 'life', icon: '👨‍👩‍👧', color: '#EC4899', order: 2, createdAt: new Date().toISOString() },
  { id: 'area-business', name: 'Business', type: 'work', icon: '💼', color: '#3B82F6', order: 3, createdAt: new Date().toISOString() },
  { id: 'area-creativity', name: 'Creativity', type: 'mixed', icon: '🎨', color: '#8B5CF6', order: 4, createdAt: new Date().toISOString() },
  { id: 'area-spirituality', name: 'Spirituality', type: 'life', icon: '🧘', color: '#F59E0B', order: 5, createdAt: new Date().toISOString() },
  { id: 'area-money', name: 'Money', type: 'work', icon: '💰', color: '#10B981', order: 6, createdAt: new Date().toISOString() },
];

// Default initial state
const defaultState: AppState = {
  // Core organizational layer
  areas: defaultAreas,
  inboxItems: [],
  // Main entities
  projects: [],
  tasks: [],
  dailyIntents: [],
  deals: [],
  notes: [],
  contentItems: [],
  transactions: [],
  mealPlans: [],
  shoppingItems: [],
  familyEvents: [],
  routines: [],
  habitLogs: [],
  // Goal-driven system
  goals: [],
  weeklyReviews: [],
  dailyCheckIns: [],
  goalActivities: [],
};

interface AppContextType {
  // State
  areas: Area[];
  inboxItems: InboxItem[];
  projects: Project[];
  tasks: Task[];
  dailyIntents: DailyIntent[];
  deals: PipelineDeal[];
  notes: Note[];
  contentItems: ContentItem[];
  transactions: Transaction[];
  mealPlans: MealPlan[];
  shoppingItems: ShoppingItem[];
  familyEvents: FamilyEvent[];
  routines: Routine[];
  habitLogs: HabitLog[];

  // Area CRUD
  addArea: (area: NewArea) => Area;
  updateArea: (id: string, updates: Partial<Area>) => void;
  deleteArea: (id: string) => void;
  getArea: (id: string) => Area | undefined;
  getAreas: () => Area[];
  getAreasByType: (type: AreaType) => Area[];
  getGoalsByArea: (areaId: string) => Goal[];
  getProjectsByArea: (areaId: string) => Project[];
  getTasksByArea: (areaId: string) => Task[];
  getNotesByArea: (areaId: string) => Note[];

  // Inbox CRUD
  addInboxItem: (text: string) => InboxItem;
  deleteInboxItem: (id: string) => void;
  clearProcessedInbox: () => void;
  processInboxItem: (id: string, data: { type: 'task' | 'project' | 'note'; areaId?: string | null; projectId?: string | null; title?: string }) => void;
  getUnprocessedInbox: () => InboxItem[];
  getInboxCount: () => number;

  // Project CRUD
  addProject: (project: NewProject) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  getActiveProjects: () => Project[];

  // Task CRUD
  addTask: (task: NewTask) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskDone: (id: string) => void;
  scheduleTaskForToday: (id: string) => void;
  moveTaskToTomorrow: (id: string) => void;
  getTodayTasks: () => Task[];
  getInboxTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getProjectTasks: (projectId: string) => Task[];
  getSomedayTasks: () => Task[];

  // Daily Intent
  getTodayIntent: () => DailyIntent | undefined;
  setTodayIntent: (intention: string) => void;
  setTodayReflection: (reflection: string) => void;

  // Deal CRUD (Pipelines)
  addDeal: (deal: NewDeal) => PipelineDeal;
  updateDeal: (id: string, updates: Partial<PipelineDeal>) => void;
  deleteDeal: (id: string) => void;
  getDealsByPipeline: (pipelineType: 'salvaje' | 'ai-bots') => PipelineDeal[];
  moveDealToStage: (id: string, stage: string) => void;

  // Note CRUD (Vault)
  addNote: (note: NewNote) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNotesByCategory: (category: string) => Note[];
  searchNotes: (query: string) => Note[];

  // Content CRUD
  addContent: (content: NewContentItem) => ContentItem;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  getContentByStatus: (status: string) => ContentItem[];

  // Transaction CRUD (Money)
  addTransaction: (transaction: NewTransaction) => Transaction;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getTransactionsByCategory: (category: string) => Transaction[];

  // Family - Meal Plans
  addMealPlan: (meal: NewMealPlan) => MealPlan;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  getMealPlanByDate: (date: string) => MealPlan | undefined;
  getWeekMealPlans: () => MealPlan[];

  // Family - Shopping
  addShoppingItem: (item: NewShoppingItem) => ShoppingItem;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void;
  deleteShoppingItem: (id: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearCompletedShopping: () => void;

  // Family - Events
  addFamilyEvent: (event: NewFamilyEvent) => FamilyEvent;
  updateFamilyEvent: (id: string, updates: Partial<FamilyEvent>) => void;
  deleteFamilyEvent: (id: string) => void;
  getUpcomingEvents: () => FamilyEvent[];

  // Routines
  addRoutine: (routine: NewRoutine) => Routine;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  getRoutinesByType: (type: string) => Routine[];
  toggleHabitLog: (routineId: string, itemId: string, date: string) => void;
  getHabitLogsForDate: (date: string) => HabitLog[];

  // ============ GOAL-DRIVEN SYSTEM ============
  // Goals State
  goals: Goal[];
  weeklyReviews: WeeklyReview[];
  dailyCheckIns: DailyCheckIn[];
  goalActivities: GoalActivity[];

  // Goal CRUD
  addGoal: (goal: NewGoal) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  getGoal: (id: string) => Goal | undefined;
  getActiveGoals: () => Goal[];
  getGoalsByQuarter: (quarter: Quarter, year: number) => Goal[];
  updateGoalMetric: (id: string, newValue: number) => void;

  // Goal Progress (Computed)
  getGoalProgress: (id: string) => number;
  getGoalLinkedTasks: (id: string) => Task[];
  getGoalLinkedProjects: (id: string) => Project[];
  getGoalLinkedDeals: (id: string) => PipelineDeal[];
  getTaskGoal: (taskId: string) => Goal | undefined;
  hasGoalContext: (taskId: string) => boolean;

  // Coaching Functions
  getOrphanTasks: () => Task[];
  getIgnoredGoals: (days?: number) => Goal[];
  getGoalHeatmap: (goalId: string, days?: number) => Record<string, boolean>;

  // Weekly Planning
  addWeeklyReview: (review: NewWeeklyReview) => WeeklyReview;
  updateWeeklyReview: (id: string, updates: Partial<WeeklyReview>) => void;
  getCurrentWeekReview: () => WeeklyReview | undefined;
  getWeekReviewByDate: (weekStart: string) => WeeklyReview | undefined;

  // Daily Check-In
  getTodayCheckIn: () => DailyCheckIn | undefined;
  setMorningCheckIn: (data: Partial<DailyCheckIn>) => void;
  setEveningReflection: (data: Partial<DailyCheckIn>) => void;
  getMITs: () => Task[];
  setMITs: (taskIds: string[]) => void;

  // Goal Activity Logging
  logGoalActivity: (activity: NewGoalActivity) => void;
  getGoalActivities: (goalId: string, days?: number) => GoalActivity[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'astral-os-data';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, defaultState);

  // =====================
  // AREA OPERATIONS
  // =====================
  const addArea = useCallback((areaData: NewArea): Area => {
    const newArea: Area = {
      ...areaData,
      id: generateId('area'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      areas: [...(prev.areas || []), newArea],
    }));
    return newArea;
  }, [setState]);

  const updateArea = useCallback((id: string, updates: Partial<Area>) => {
    setState((prev) => ({
      ...prev,
      areas: (prev.areas || []).map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
  }, [setState]);

  const deleteArea = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      areas: (prev.areas || []).filter((a) => a.id !== id),
      // Unlink entities from this area
      goals: prev.goals.map((g) => g.areaId === id ? { ...g, areaId: null } : g),
      projects: prev.projects.map((p) => p.areaId === id ? { ...p, areaId: null } : p),
      tasks: prev.tasks.map((t) => t.areaId === id ? { ...t, areaId: null } : t),
      notes: prev.notes.map((n) => n.areaId === id ? { ...n, areaId: null } : n),
      routines: prev.routines.map((r) => r.areaId === id ? { ...r, areaId: null } : r),
    }));
  }, [setState]);

  const getArea = useCallback(
    (id: string) => (state.areas || []).find((a) => a.id === id),
    [state.areas]
  );

  const getAreas = useCallback(
    () => (state.areas || []).sort((a, b) => a.order - b.order),
    [state.areas]
  );

  const getAreasByType = useCallback(
    (type: AreaType) => (state.areas || []).filter((a) => a.type === type).sort((a, b) => a.order - b.order),
    [state.areas]
  );

  const getGoalsByArea = useCallback(
    (areaId: string) => state.goals.filter((g) => g.areaId === areaId),
    [state.goals]
  );

  const getProjectsByArea = useCallback(
    (areaId: string) => state.projects.filter((p) => p.areaId === areaId),
    [state.projects]
  );

  const getTasksByArea = useCallback(
    (areaId: string) => state.tasks.filter((t) => t.areaId === areaId),
    [state.tasks]
  );

  const getNotesByArea = useCallback(
    (areaId: string) => state.notes.filter((n) => n.areaId === areaId),
    [state.notes]
  );

  // =====================
  // INBOX OPERATIONS
  // =====================
  const addInboxItem = useCallback((text: string): InboxItem => {
    const newItem: InboxItem = {
      id: generateId('inbox'),
      rawText: text,
      suggestedType: 'unknown',
      suggestedAreaId: null,
      suggestedProjectId: null,
      processed: false,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      inboxItems: [...(prev.inboxItems || []), newItem],
    }));
    return newItem;
  }, [setState]);

  const deleteInboxItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      inboxItems: (prev.inboxItems || []).filter((i) => i.id !== id),
    }));
  }, [setState]);

  const clearProcessedInbox = useCallback(() => {
    setState((prev) => ({
      ...prev,
      inboxItems: (prev.inboxItems || []).filter((i) => !i.processed),
    }));
  }, [setState]);

  const processInboxItem = useCallback((
    id: string,
    data: { type: 'task' | 'project' | 'note'; areaId?: string | null; projectId?: string | null; title?: string }
  ) => {
    const item = (state.inboxItems || []).find((i) => i.id === id);
    if (!item) return;

    const title = data.title || item.rawText;
    const now = new Date().toISOString();

    setState((prev) => {
      let newState = { ...prev };

      // Create the entity based on type
      if (data.type === 'task') {
        const newTask: Task = {
          id: generateId('task'),
          title,
          projectId: data.projectId || null,
          goalId: null,
          areaId: data.areaId || null,
          area: 'work',
          category: 'personal',
          status: 'todo',
          priority: 'normal',
          dueDate: null,
          scheduledFor: null,
          timeBlock: 'unscheduled',
          mode: 'all',
          createdAt: now,
        };
        newState.tasks = [...prev.tasks, newTask];
      } else if (data.type === 'project') {
        const newProject: Project = {
          id: generateId('proj'),
          name: title,
          type: 'other',
          status: 'idea',
          priority: 3,
          vision: '',
          nextAction: '',
          notes: '',
          links: [],
          goalId: null,
          areaId: data.areaId || null,
          createdAt: now,
          updatedAt: now,
        };
        newState.projects = [...prev.projects, newProject];
      } else if (data.type === 'note') {
        const newNote: Note = {
          id: generateId('note'),
          title,
          content: '',
          category: 'ideas',
          tags: [],
          projectId: data.projectId || null,
          areaId: data.areaId || null,
          createdAt: now,
          updatedAt: now,
        };
        newState.notes = [...prev.notes, newNote];
      }

      // Mark inbox item as processed
      newState.inboxItems = (prev.inboxItems || []).map((i) =>
        i.id === id ? { ...i, processed: true } : i
      );

      return newState;
    });
  }, [state.inboxItems, setState]);

  const getUnprocessedInbox = useCallback(
    () => (state.inboxItems || []).filter((i) => !i.processed),
    [state.inboxItems]
  );

  const getInboxCount = useCallback(
    () => (state.inboxItems || []).filter((i) => !i.processed).length,
    [state.inboxItems]
  );

  // =====================
  // PROJECT OPERATIONS
  // =====================
  const addProject = useCallback((projectData: NewProject): Project => {
    const newProject: Project = {
      ...projectData,
      id: generateId('proj'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
    return newProject;
  }, [setState]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, [setState]);

  const deleteProject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      tasks: prev.tasks.map((t) => t.projectId === id ? { ...t, projectId: null } : t),
    }));
  }, [setState]);

  const getProject = useCallback(
    (id: string) => state.projects.find((p) => p.id === id),
    [state.projects]
  );

  const getActiveProjects = useCallback(() => {
    return state.projects
      .filter((p) => p.status !== 'paused' && p.status !== 'idea')
      .sort((a, b) => a.priority - b.priority);
  }, [state.projects]);

  // =====================
  // TASK OPERATIONS
  // =====================
  const addTask = useCallback((taskData: NewTask): Task => {
    const newTask: Task = {
      ...taskData,
      id: generateId('task'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
    return newTask;
  }, [setState]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, [setState]);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, [setState]);

  const toggleTaskDone = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      ),
    }));
  }, [setState]);

  const scheduleTaskForToday = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, scheduledFor: getToday(), status: 'todo' } : t
      ),
    }));
  }, [setState]);

  const moveTaskToTomorrow = useCallback((id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, scheduledFor: tomorrowStr } : t
      ),
    }));
  }, [setState]);

  const getTodayTasks = useCallback(() => {
    const today = getToday();
    return state.tasks.filter((t) => t.scheduledFor === today && t.status !== 'someday');
  }, [state.tasks]);

  const getInboxTasks = useCallback(() => {
    return state.tasks.filter(
      (t) => !t.scheduledFor && !t.projectId && t.status !== 'someday' && t.status !== 'done'
    );
  }, [state.tasks]);

  const getUpcomingTasks = useCallback(() => {
    const today = getToday();
    return state.tasks.filter((t) => t.scheduledFor && t.scheduledFor > today && t.status !== 'done');
  }, [state.tasks]);

  const getProjectTasks = useCallback(
    (projectId: string) => state.tasks.filter((t) => t.projectId === projectId),
    [state.tasks]
  );

  const getSomedayTasks = useCallback(() => {
    return state.tasks.filter((t) => t.status === 'someday');
  }, [state.tasks]);

  // =====================
  // DAILY INTENT
  // =====================
  const getTodayIntent = useCallback(() => {
    const today = getToday();
    return state.dailyIntents.find((d) => d.date === today);
  }, [state.dailyIntents]);

  const setTodayIntent = useCallback((intention: string) => {
    const today = getToday();
    setState((prev) => {
      const existingIndex = prev.dailyIntents.findIndex((d) => d.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev.dailyIntents];
        updated[existingIndex] = { ...updated[existingIndex], intention };
        return { ...prev, dailyIntents: updated };
      }
      return {
        ...prev,
        dailyIntents: [...prev.dailyIntents, { date: today, intention, reflection: '' }],
      };
    });
  }, [setState]);

  const setTodayReflection = useCallback((reflection: string) => {
    const today = getToday();
    setState((prev) => {
      const existingIndex = prev.dailyIntents.findIndex((d) => d.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev.dailyIntents];
        updated[existingIndex] = { ...updated[existingIndex], reflection };
        return { ...prev, dailyIntents: updated };
      }
      return {
        ...prev,
        dailyIntents: [...prev.dailyIntents, { date: today, intention: '', reflection }],
      };
    });
  }, [setState]);

  // =====================
  // DEAL (PIPELINE) OPERATIONS
  // =====================
  const addDeal = useCallback((dealData: NewDeal): PipelineDeal => {
    const newDeal: PipelineDeal = {
      ...dealData,
      id: generateId('deal'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      deals: [...prev.deals, newDeal],
    }));
    return newDeal;
  }, [setState]);

  const updateDeal = useCallback((id: string, updates: Partial<PipelineDeal>) => {
    setState((prev) => ({
      ...prev,
      deals: prev.deals.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));
  }, [setState]);

  const deleteDeal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      deals: prev.deals.filter((d) => d.id !== id),
    }));
  }, [setState]);

  const getDealsByPipeline = useCallback(
    (pipelineType: 'salvaje' | 'ai-bots') => state.deals.filter((d) => d.pipelineType === pipelineType),
    [state.deals]
  );

  const moveDealToStage = useCallback((id: string, stage: string) => {
    setState((prev) => ({
      ...prev,
      deals: prev.deals.map((d) =>
        d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d
      ),
    }));
  }, [setState]);

  // =====================
  // NOTE (VAULT) OPERATIONS
  // =====================
  const addNote = useCallback((noteData: NewNote): Note => {
    const newNote: Note = {
      ...noteData,
      id: generateId('note'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
    return newNote;
  }, [setState]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }, [setState]);

  const deleteNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  }, [setState]);

  const getNotesByCategory = useCallback(
    (category: string) => state.notes.filter((n) => n.category === category),
    [state.notes]
  );

  const searchNotes = useCallback(
    (query: string) => {
      const lower = query.toLowerCase();
      return state.notes.filter(
        (n) =>
          n.title.toLowerCase().includes(lower) ||
          n.content.toLowerCase().includes(lower) ||
          n.tags.some((t) => t.toLowerCase().includes(lower))
      );
    },
    [state.notes]
  );

  // =====================
  // CONTENT OPERATIONS
  // =====================
  const addContent = useCallback((contentData: NewContentItem): ContentItem => {
    const newContent: ContentItem = {
      ...contentData,
      id: generateId('content'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      contentItems: [...prev.contentItems, newContent],
    }));
    return newContent;
  }, [setState]);

  const updateContent = useCallback((id: string, updates: Partial<ContentItem>) => {
    setState((prev) => ({
      ...prev,
      contentItems: prev.contentItems.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }));
  }, [setState]);

  const deleteContent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      contentItems: prev.contentItems.filter((c) => c.id !== id),
    }));
  }, [setState]);

  const getContentByStatus = useCallback(
    (status: string) => state.contentItems.filter((c) => c.status === status),
    [state.contentItems]
  );

  // =====================
  // TRANSACTION (MONEY) OPERATIONS
  // =====================
  const addTransaction = useCallback((transactionData: NewTransaction): Transaction => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId('txn'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
    return newTransaction;
  }, [setState]);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  }, [setState]);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, [setState]);

  const getMonthlyIncome = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    return state.transactions
      .filter((t) => t.type === 'income' && t.date >= monthStart)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const getMonthlyExpenses = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    return state.transactions
      .filter((t) => t.type === 'expense' && t.date >= monthStart)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [state.transactions]);

  const getTransactionsByCategory = useCallback(
    (category: string) => state.transactions.filter((t) => t.category === category),
    [state.transactions]
  );

  // =====================
  // MEAL PLAN OPERATIONS
  // =====================
  const addMealPlan = useCallback((mealData: NewMealPlan): MealPlan => {
    const newMeal: MealPlan = {
      ...mealData,
      id: generateId('meal'),
    };
    setState((prev) => ({
      ...prev,
      mealPlans: [...prev.mealPlans.filter((m) => m.date !== mealData.date), newMeal],
    }));
    return newMeal;
  }, [setState]);

  const updateMealPlan = useCallback((id: string, updates: Partial<MealPlan>) => {
    setState((prev) => ({
      ...prev,
      mealPlans: prev.mealPlans.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, [setState]);

  const deleteMealPlan = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      mealPlans: prev.mealPlans.filter((m) => m.id !== id),
    }));
  }, [setState]);

  const getMealPlanByDate = useCallback(
    (date: string) => state.mealPlans.find((m) => m.date === date),
    [state.mealPlans]
  );

  const getWeekMealPlans = useCallback(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const startStr = weekStart.toISOString().split('T')[0];
    const endStr = weekEnd.toISOString().split('T')[0];

    return state.mealPlans.filter((m) => m.date >= startStr && m.date <= endStr);
  }, [state.mealPlans]);

  // =====================
  // SHOPPING ITEM OPERATIONS
  // =====================
  const addShoppingItem = useCallback((itemData: NewShoppingItem): ShoppingItem => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: generateId('shop'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      shoppingItems: [...prev.shoppingItems, newItem],
    }));
    return newItem;
  }, [setState]);

  const updateShoppingItem = useCallback((id: string, updates: Partial<ShoppingItem>) => {
    setState((prev) => ({
      ...prev,
      shoppingItems: prev.shoppingItems.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
  }, [setState]);

  const deleteShoppingItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      shoppingItems: prev.shoppingItems.filter((i) => i.id !== id),
    }));
  }, [setState]);

  const toggleShoppingItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      shoppingItems: prev.shoppingItems.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      ),
    }));
  }, [setState]);

  const clearCompletedShopping = useCallback(() => {
    setState((prev) => ({
      ...prev,
      shoppingItems: prev.shoppingItems.filter((i) => !i.completed),
    }));
  }, [setState]);

  // =====================
  // FAMILY EVENT OPERATIONS
  // =====================
  const addFamilyEvent = useCallback((eventData: NewFamilyEvent): FamilyEvent => {
    const newEvent: FamilyEvent = {
      ...eventData,
      id: generateId('event'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      familyEvents: [...prev.familyEvents, newEvent],
    }));
    return newEvent;
  }, [setState]);

  const updateFamilyEvent = useCallback((id: string, updates: Partial<FamilyEvent>) => {
    setState((prev) => ({
      ...prev,
      familyEvents: prev.familyEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, [setState]);

  const deleteFamilyEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      familyEvents: prev.familyEvents.filter((e) => e.id !== id),
    }));
  }, [setState]);

  const getUpcomingEvents = useCallback(() => {
    const today = getToday();
    return state.familyEvents
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [state.familyEvents]);

  // =====================
  // ROUTINE OPERATIONS
  // =====================
  const addRoutine = useCallback((routineData: NewRoutine): Routine => {
    const newRoutine: Routine = {
      ...routineData,
      id: generateId('routine'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      routines: [...prev.routines, newRoutine],
    }));
    return newRoutine;
  }, [setState]);

  const updateRoutine = useCallback((id: string, updates: Partial<Routine>) => {
    setState((prev) => ({
      ...prev,
      routines: prev.routines.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, [setState]);

  const deleteRoutine = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      routines: prev.routines.filter((r) => r.id !== id),
      habitLogs: prev.habitLogs.filter((h) => h.routineId !== id),
    }));
  }, [setState]);

  const getRoutinesByType = useCallback(
    (type: string) => state.routines.filter((r) => r.type === type),
    [state.routines]
  );

  const toggleHabitLog = useCallback((routineId: string, itemId: string, date: string) => {
    setState((prev) => {
      const existingIndex = prev.habitLogs.findIndex(
        (h) => h.routineId === routineId && h.itemId === itemId && h.date === date
      );
      if (existingIndex >= 0) {
        const updated = [...prev.habitLogs];
        updated[existingIndex] = { ...updated[existingIndex], completed: !updated[existingIndex].completed };
        return { ...prev, habitLogs: updated };
      }
      return {
        ...prev,
        habitLogs: [...prev.habitLogs, { routineId, itemId, date, completed: true }],
      };
    });
  }, [setState]);

  const getHabitLogsForDate = useCallback(
    (date: string) => state.habitLogs.filter((h) => h.date === date),
    [state.habitLogs]
  );

  // =====================
  // GOAL OPERATIONS
  // =====================
  const addGoal = useCallback((goalData: NewGoal): Goal => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId('goal'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
    return newGoal;
  }, [setState]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    }));
  }, [setState]);

  const deleteGoal = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
      // Unlink entities from this goal
      tasks: prev.tasks.map((t) => t.goalId === id ? { ...t, goalId: null } : t),
      projects: prev.projects.map((p) => p.goalId === id ? { ...p, goalId: null } : p),
      deals: prev.deals.map((d) => d.goalId === id ? { ...d, goalId: null } : d),
      contentItems: prev.contentItems.map((c) => c.goalId === id ? { ...c, goalId: null } : c),
      goalActivities: prev.goalActivities.filter((a) => a.goalId !== id),
    }));
  }, [setState]);

  const getGoal = useCallback(
    (id: string) => state.goals.find((g) => g.id === id),
    [state.goals]
  );

  const getActiveGoals = useCallback(() => {
    return state.goals.filter((g) => g.status === 'active');
  }, [state.goals]);

  const getGoalsByQuarter = useCallback(
    (quarter: Quarter, year: number) => state.goals.filter((g) => g.quarter === quarter && g.year === year),
    [state.goals]
  );

  const updateGoalMetric = useCallback((id: string, newValue: number) => {
    const goal = state.goals.find((g) => g.id === id);
    if (!goal) return;

    const oldValue = goal.currentMetric || 0;
    const change = newValue - oldValue;

    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === id ? { ...g, currentMetric: newValue, updatedAt: new Date().toISOString() } : g
      ),
      goalActivities: [
        ...prev.goalActivities,
        {
          id: generateId('activity'),
          goalId: id,
          date: getToday(),
          type: 'metric_updated' as const,
          description: `Updated from ${oldValue} to ${newValue} ${goal.metricUnit || ''}`,
          metricChange: change,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, [state.goals, setState]);

  // =====================
  // GOAL PROGRESS (COMPUTED)
  // =====================
  const getGoalProgress = useCallback((goalId: string): number => {
    const goal = state.goals.find((g) => g.id === goalId);
    if (!goal) return 0;

    switch (goal.type) {
      case 'numeric':
        if (!goal.targetMetric) return 0;
        return Math.min(100, ((goal.currentMetric || 0) / goal.targetMetric) * 100);

      case 'project': {
        // Get tasks linked to this goal or to projects linked to this goal
        const linkedTasks = state.tasks.filter((t) =>
          t.goalId === goalId || goal.projectIds.includes(t.projectId || '')
        );
        if (linkedTasks.length === 0) return 0;
        const completedTasks = linkedTasks.filter((t) => t.status === 'done').length;
        return (completedTasks / linkedTasks.length) * 100;
      }

      case 'pipeline': {
        const linkedDeals = state.deals.filter((d) => d.goalId === goalId);
        if (linkedDeals.length === 0) return 0;
        const wonDeals = linkedDeals.filter((d) =>
          d.stage === 'sold' || d.stage === 'won'
        ).length;
        return (wonDeals / linkedDeals.length) * 100;
      }

      case 'habit': {
        // For habit goals, calculate based on routine completion
        const last30Days = 30;
        const today = new Date();
        let completedDays = 0;

        for (let i = 0; i < last30Days; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const hasActivity = state.goalActivities.some(
            (a) => a.goalId === goalId && a.date === dateStr
          );
          if (hasActivity) completedDays++;
        }
        return (completedDays / last30Days) * 100;
      }

      default:
        return 0;
    }
  }, [state.goals, state.tasks, state.deals, state.goalActivities]);

  const getGoalLinkedTasks = useCallback(
    (goalId: string) => {
      const goal = state.goals.find((g) => g.id === goalId);
      if (!goal) return [];
      return state.tasks.filter((t) =>
        t.goalId === goalId || goal.projectIds.includes(t.projectId || '')
      );
    },
    [state.goals, state.tasks]
  );

  const getGoalLinkedProjects = useCallback(
    (goalId: string) => {
      const goal = state.goals.find((g) => g.id === goalId);
      if (!goal) return [];
      return state.projects.filter((p) => p.goalId === goalId || goal.projectIds.includes(p.id));
    },
    [state.goals, state.projects]
  );

  const getGoalLinkedDeals = useCallback(
    (goalId: string) => state.deals.filter((d) => d.goalId === goalId),
    [state.deals]
  );

  const getTaskGoal = useCallback(
    (taskId: string): Goal | undefined => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return undefined;

      // Direct goal link
      if (task.goalId) {
        return state.goals.find((g) => g.id === task.goalId);
      }

      // Check if project is linked to a goal
      if (task.projectId) {
        const project = state.projects.find((p) => p.id === task.projectId);
        if (project?.goalId) {
          return state.goals.find((g) => g.id === project.goalId);
        }
        // Check if any goal has this project in its projectIds
        return state.goals.find((g) => g.projectIds.includes(task.projectId || ''));
      }

      return undefined;
    },
    [state.tasks, state.projects, state.goals]
  );

  const hasGoalContext = useCallback(
    (taskId: string) => getTaskGoal(taskId) !== undefined,
    [getTaskGoal]
  );

  // =====================
  // COACHING FUNCTIONS
  // =====================
  const getOrphanTasks = useCallback((): Task[] => {
    return state.tasks.filter((t) => {
      if (t.status === 'done' || t.status === 'someday') return false;
      return !hasGoalContext(t.id);
    });
  }, [state.tasks, hasGoalContext]);

  const getIgnoredGoals = useCallback((days: number = 7): Goal[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    return state.goals.filter((g) => {
      if (g.status !== 'active') return false;
      const recentActivity = state.goalActivities.find(
        (a) => a.goalId === g.id && a.date >= cutoffStr
      );
      return !recentActivity;
    });
  }, [state.goals, state.goalActivities]);

  const getGoalHeatmap = useCallback((goalId: string, days: number = 30): Record<string, boolean> => {
    const heatmap: Record<string, boolean> = {};
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      heatmap[dateStr] = state.goalActivities.some(
        (a) => a.goalId === goalId && a.date === dateStr
      );
    }

    return heatmap;
  }, [state.goalActivities]);

  // =====================
  // WEEKLY PLANNING
  // =====================
  const addWeeklyReview = useCallback((reviewData: NewWeeklyReview): WeeklyReview => {
    const newReview: WeeklyReview = {
      ...reviewData,
      id: generateId('weekly'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      weeklyReviews: [...prev.weeklyReviews, newReview],
    }));
    return newReview;
  }, [setState]);

  const updateWeeklyReview = useCallback((id: string, updates: Partial<WeeklyReview>) => {
    setState((prev) => ({
      ...prev,
      weeklyReviews: prev.weeklyReviews.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    }));
  }, [setState]);

  const getCurrentWeekReview = useCallback(() => {
    const weekStart = getWeekStart();
    return state.weeklyReviews.find((r) => r.weekStart === weekStart);
  }, [state.weeklyReviews]);

  const getWeekReviewByDate = useCallback(
    (weekStart: string) => state.weeklyReviews.find((r) => r.weekStart === weekStart),
    [state.weeklyReviews]
  );

  // =====================
  // DAILY CHECK-IN
  // =====================
  const getTodayCheckIn = useCallback(() => {
    const today = getToday();
    return state.dailyCheckIns.find((c) => c.date === today);
  }, [state.dailyCheckIns]);

  const setMorningCheckIn = useCallback((data: Partial<DailyCheckIn>) => {
    const today = getToday();
    setState((prev) => {
      const existingIndex = prev.dailyCheckIns.findIndex((c) => c.date === today);
      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        const updated = [...prev.dailyCheckIns];
        updated[existingIndex] = { ...updated[existingIndex], ...data, updatedAt: now };
        return { ...prev, dailyCheckIns: updated };
      }

      const newCheckIn: DailyCheckIn = {
        date: today,
        morningIntention: '',
        singleAction: '',
        goalFocus: null,
        mitIds: [],
        didMoveGoalForward: false,
        insight: '',
        whatLetGo: '',
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      return { ...prev, dailyCheckIns: [...prev.dailyCheckIns, newCheckIn] };
    });
  }, [setState]);

  const setEveningReflection = useCallback((data: Partial<DailyCheckIn>) => {
    const today = getToday();
    setState((prev) => {
      const existingIndex = prev.dailyCheckIns.findIndex((c) => c.date === today);
      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        const updated = [...prev.dailyCheckIns];
        updated[existingIndex] = { ...updated[existingIndex], ...data, updatedAt: now };
        return { ...prev, dailyCheckIns: updated };
      }

      const newCheckIn: DailyCheckIn = {
        date: today,
        morningIntention: '',
        singleAction: '',
        goalFocus: null,
        mitIds: [],
        didMoveGoalForward: false,
        insight: '',
        whatLetGo: '',
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      return { ...prev, dailyCheckIns: [...prev.dailyCheckIns, newCheckIn] };
    });
  }, [setState]);

  const getMITs = useCallback(() => {
    const checkIn = getTodayCheckIn();
    if (!checkIn || !checkIn.mitIds.length) return [];
    return state.tasks.filter((t) => checkIn.mitIds.includes(t.id));
  }, [getTodayCheckIn, state.tasks]);

  const setMITs = useCallback((taskIds: string[]) => {
    setMorningCheckIn({ mitIds: taskIds.slice(0, 3) }); // Limit to 3 MITs
  }, [setMorningCheckIn]);

  // =====================
  // GOAL ACTIVITY LOGGING
  // =====================
  const logGoalActivity = useCallback((activityData: NewGoalActivity) => {
    const newActivity: GoalActivity = {
      ...activityData,
      id: generateId('activity'),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      goalActivities: [...prev.goalActivities, newActivity],
    }));
  }, [setState]);

  const getGoalActivities = useCallback(
    (goalId: string, days?: number) => {
      let activities = state.goalActivities.filter((a) => a.goalId === goalId);

      if (days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = cutoffDate.toISOString().split('T')[0];
        activities = activities.filter((a) => a.date >= cutoffStr);
      }

      return activities.sort((a, b) => b.date.localeCompare(a.date));
    },
    [state.goalActivities]
  );

  // =====================
  // CONTEXT VALUE
  // =====================
  const value = useMemo<AppContextType>(
    () => ({
      // State
      areas: state.areas || [],
      inboxItems: state.inboxItems || [],
      projects: state.projects,
      tasks: state.tasks,
      dailyIntents: state.dailyIntents,
      deals: state.deals,
      notes: state.notes,
      contentItems: state.contentItems,
      transactions: state.transactions,
      mealPlans: state.mealPlans,
      shoppingItems: state.shoppingItems,
      familyEvents: state.familyEvents,
      routines: state.routines,
      habitLogs: state.habitLogs,

      // Areas
      addArea, updateArea, deleteArea, getArea, getAreas, getAreasByType,
      getGoalsByArea, getProjectsByArea, getTasksByArea, getNotesByArea,

      // Inbox
      addInboxItem, deleteInboxItem, clearProcessedInbox, processInboxItem,
      getUnprocessedInbox, getInboxCount,

      // Projects
      addProject, updateProject, deleteProject, getProject, getActiveProjects,

      // Tasks
      addTask, updateTask, deleteTask, toggleTaskDone,
      scheduleTaskForToday, moveTaskToTomorrow,
      getTodayTasks, getInboxTasks, getUpcomingTasks, getProjectTasks, getSomedayTasks,

      // Daily Intent
      getTodayIntent, setTodayIntent, setTodayReflection,

      // Deals
      addDeal, updateDeal, deleteDeal, getDealsByPipeline, moveDealToStage,

      // Notes
      addNote, updateNote, deleteNote, getNotesByCategory, searchNotes,

      // Content
      addContent, updateContent, deleteContent, getContentByStatus,

      // Transactions
      addTransaction, updateTransaction, deleteTransaction,
      getMonthlyIncome, getMonthlyExpenses, getTransactionsByCategory,

      // Meal Plans
      addMealPlan, updateMealPlan, deleteMealPlan, getMealPlanByDate, getWeekMealPlans,

      // Shopping
      addShoppingItem, updateShoppingItem, deleteShoppingItem,
      toggleShoppingItem, clearCompletedShopping,

      // Family Events
      addFamilyEvent, updateFamilyEvent, deleteFamilyEvent, getUpcomingEvents,

      // Routines
      addRoutine, updateRoutine, deleteRoutine, getRoutinesByType,
      toggleHabitLog, getHabitLogsForDate,

      // Goal-driven system state
      goals: state.goals,
      weeklyReviews: state.weeklyReviews,
      dailyCheckIns: state.dailyCheckIns,
      goalActivities: state.goalActivities,

      // Goals CRUD
      addGoal, updateGoal, deleteGoal, getGoal, getActiveGoals, getGoalsByQuarter, updateGoalMetric,

      // Goal Progress
      getGoalProgress, getGoalLinkedTasks, getGoalLinkedProjects, getGoalLinkedDeals,
      getTaskGoal, hasGoalContext,

      // Coaching Functions
      getOrphanTasks, getIgnoredGoals, getGoalHeatmap,

      // Weekly Planning
      addWeeklyReview, updateWeeklyReview, getCurrentWeekReview, getWeekReviewByDate,

      // Daily Check-In
      getTodayCheckIn, setMorningCheckIn, setEveningReflection, getMITs, setMITs,

      // Goal Activity Logging
      logGoalActivity, getGoalActivities,
    }),
    [state,
     // Areas & Inbox
     addArea, updateArea, deleteArea, getArea, getAreas, getAreasByType,
     getGoalsByArea, getProjectsByArea, getTasksByArea, getNotesByArea,
     addInboxItem, deleteInboxItem, clearProcessedInbox, processInboxItem, getUnprocessedInbox, getInboxCount,
     // Projects & Tasks
     addProject, updateProject, deleteProject, getProject, getActiveProjects,
     addTask, updateTask, deleteTask, toggleTaskDone, scheduleTaskForToday, moveTaskToTomorrow,
     getTodayTasks, getInboxTasks, getUpcomingTasks, getProjectTasks, getSomedayTasks,
     getTodayIntent, setTodayIntent, setTodayReflection,
     addDeal, updateDeal, deleteDeal, getDealsByPipeline, moveDealToStage,
     addNote, updateNote, deleteNote, getNotesByCategory, searchNotes,
     addContent, updateContent, deleteContent, getContentByStatus,
     addTransaction, updateTransaction, deleteTransaction, getMonthlyIncome, getMonthlyExpenses, getTransactionsByCategory,
     addMealPlan, updateMealPlan, deleteMealPlan, getMealPlanByDate, getWeekMealPlans,
     addShoppingItem, updateShoppingItem, deleteShoppingItem, toggleShoppingItem, clearCompletedShopping,
     addFamilyEvent, updateFamilyEvent, deleteFamilyEvent, getUpcomingEvents,
     addRoutine, updateRoutine, deleteRoutine, getRoutinesByType, toggleHabitLog, getHabitLogsForDate,
     // Goal system
     addGoal, updateGoal, deleteGoal, getGoal, getActiveGoals, getGoalsByQuarter, updateGoalMetric,
     getGoalProgress, getGoalLinkedTasks, getGoalLinkedProjects, getGoalLinkedDeals, getTaskGoal, hasGoalContext,
     getOrphanTasks, getIgnoredGoals, getGoalHeatmap,
     addWeeklyReview, updateWeeklyReview, getCurrentWeekReview, getWeekReviewByDate,
     getTodayCheckIn, setMorningCheckIn, setEveningReflection, getMITs, setMITs,
     logGoalActivity, getGoalActivities]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
