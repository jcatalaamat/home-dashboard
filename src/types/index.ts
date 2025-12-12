// Astral Navigator - Core Data Types

// ============ AREAS (Life Domains) ============
export type AreaType = 'life' | 'work' | 'mixed';

export interface Area {
  id: string;
  name: string;              // e.g., "Health", "Business", "Family"
  type: AreaType;
  icon?: string;             // emoji or icon name
  color?: string;
  order: number;             // for sorting
  createdAt: string;
}

// ============ CAPTURE INBOX ============
export type InboxItemType = 'unknown' | 'task' | 'project' | 'note' | 'idea';

export interface InboxItem {
  id: string;
  rawText: string;
  suggestedType: InboxItemType;
  suggestedAreaId: string | null;
  suggestedProjectId: string | null;
  processed: boolean;
  createdAt: string;
}

// ============ PROJECTS ============
export type ProjectType = 'land' | 'coaching' | 'ai-product' | 'personal' | 'other';
export type ProjectStatus = 'idea' | 'planning' | 'building' | 'launching' | 'active' | 'paused';
export type Priority = 1 | 2 | 3 | 4 | 5;

export interface ProjectLink {
  id: string;
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: Priority;
  vision: string;
  nextAction: string;
  notes: string;
  links: ProjectLink[];
  goalId: string | null;          // Link to supporting goal
  areaId: string | null;          // Link to Area
  createdAt: string;
  updatedAt: string;
}

// ============ TASKS ============
export type TaskArea = 'work' | 'family' | 'admin' | 'health' | 'spiritual';
export type TaskStatus = 'todo' | 'doing' | 'done' | 'someday';
export type TaskPriority = 'low' | 'normal' | 'high';
export type TaskTimeBlock = 'morning' | 'afternoon' | 'evening' | 'unscheduled';
export type TaskMode = 'deep-work' | 'logistics' | 'family' | 'sales' | 'all';
export type TaskCategory = 'cashflow' | 'land-sales' | 'incubator' | 'mini-projects' | 'personal';

export interface Task {
  id: string;
  title: string;
  projectId: string | null;
  goalId: string | null;          // Direct link to goal (optional)
  areaId: string | null;          // Link to Area (replaces legacy 'area' field)
  area: TaskArea;                 // Legacy field - kept for compatibility
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  scheduledFor: string | null;
  timeBlock: TaskTimeBlock;
  mode: TaskMode;
  createdAt: string;
}

export interface DailyIntent {
  date: string;
  intention: string;
  reflection: string;
}

// ============ PIPELINES ============
export type PipelineType = 'salvaje' | 'ai-bots';

export type SalvajeStage = 'lead' | 'contacted' | 'visit-scheduled' | 'visited' | 'negotiating' | 'sold' | 'lost';
export type AIBotsStage = 'prospect' | 'demo-scheduled' | 'demo-done' | 'proposal-sent' | 'won' | 'lost';

export interface PipelineDeal {
  id: string;
  pipelineType: PipelineType;
  name: string;
  value: number;
  stage: string;
  nextAction: string;
  contactInfo: string;
  phone: string;
  email: string;
  notes: string;
  goalId: string | null;          // Link to goal (e.g., "Sell 3 plots")
  createdAt: string;
  updatedAt: string;
}

// ============ NOTES / VAULT ============
export type NoteCategory = 'ideas' | 'scripts' | 'meetings' | 'clients' | 'branding' | 'spiritual' | 'other';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  projectId: string | null;
  areaId: string | null;          // Link to Area
  createdAt: string;
  updatedAt: string;
}

// ============ CONTENT ENGINE ============
export type ContentType = 'post' | 'reel' | 'carousel' | 'copy' | 'template';
export type ContentPlatform = 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'other';
export type ContentStatus = 'idea' | 'draft' | 'ready' | 'scheduled' | 'posted';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  platform: ContentPlatform;
  status: ContentStatus;
  content: string;
  assetUrls: string[];
  scheduledFor: string | null;
  postedAt: string | null;
  goalId: string | null;          // Link to goal (e.g., "Grow Instagram")
  createdAt: string;
  updatedAt: string;
}

// ============ MONEY / FINANCE ============
export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'ai-bots' | 'land-sales' | 'consulting' | 'personal' | 'business' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  recurring: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
}

// ============ FAMILY ============
export interface MealPlan {
  id: string;
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  notes: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: 'groceries' | 'baby' | 'household' | 'other';
  completed: boolean;
  createdAt: string;
}

export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  type: 'appointment' | 'baby' | 'couple' | 'health' | 'other';
  notes: string;
  createdAt: string;
}

// ============ ROUTINES ============
export type RoutineType = 'morning' | 'evening' | 'weekly' | 'monthly';

export interface RoutineItem {
  id: string;
  text: string;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  type: RoutineType;
  items: RoutineItem[];
  areaId: string | null;          // Link to Area
  createdAt: string;
}

export interface HabitLog {
  routineId: string;
  itemId: string;
  date: string;
  completed: boolean;
}

// ============ GOALS (North Stars) ============
export type GoalStatus = 'active' | 'paused' | 'achieved' | 'abandoned';
export type GoalType = 'numeric' | 'project' | 'pipeline' | 'habit';
export type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';

export interface Goal {
  id: string;
  title: string;
  why: string;                    // Emotional driver - "Why does this matter?"
  type: GoalType;
  quarter: Quarter;
  year: number;
  status: GoalStatus;
  areaId: string | null;          // Link to Area

  // For numeric goals (e.g., "Sell 3 plots")
  targetMetric?: number;
  currentMetric?: number;
  metricUnit?: string;

  // For pipeline goals
  pipelineType?: PipelineType;
  targetStage?: string;

  // Links
  projectIds: string[];

  color?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ WEEKLY PLANNING ============
export interface WeeklyOutcome {
  id: string;
  description: string;
  goalId: string | null;
  isCompleted: boolean;
  linkedTaskIds: string[];
}

export interface WeeklyReview {
  id: string;
  weekStart: string;              // Monday ISO date
  whatMovedNeedle: string;
  whatDidntWork: string;
  whatFeltAligned: string;
  weeklyOutcomes: WeeklyOutcome[];
  completedAt?: string;
  createdAt: string;
}

// ============ DAILY CHECK-IN ============
export interface DailyCheckIn {
  date: string;
  // Morning
  morningIntention: string;
  singleAction: string;           // "One thing that would make today a win"
  goalFocus: string | null;       // Which goal needs attention today (goalId)
  mitIds: string[];               // 3 Most Important Tasks IDs
  // Evening
  didMoveGoalForward: boolean;
  goalMovedId?: string | null;    // Which goal was moved forward
  insight: string;
  whatLetGo: string;
  createdAt: string;
  updatedAt: string;
}

// ============ GOAL ACTIVITY LOG ============
export type GoalActivityType = 'task_completed' | 'metric_updated' | 'project_progress' | 'pipeline_moved' | 'manual_log';

export interface GoalActivity {
  id: string;
  goalId: string;
  date: string;
  type: GoalActivityType;
  description: string;
  linkedEntityId?: string;        // task/project/deal ID
  metricChange?: number;
  createdAt: string;
}

// ============ APP STATE ============
export interface AppState {
  // Core organizational layer
  areas: Area[];
  inboxItems: InboxItem[];
  // Main entities
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
  // Goal-driven system
  goals: Goal[];
  weeklyReviews: WeeklyReview[];
  dailyCheckIns: DailyCheckIn[];
  goalActivities: GoalActivity[];
}

// ============ HELPER TYPES ============
export type TaskFilter = 'inbox' | 'today' | 'upcoming' | 'by-project' | 'someday' | 'all';

export type NewProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type NewTask = Omit<Task, 'id' | 'createdAt'>;
export type NewDeal = Omit<PipelineDeal, 'id' | 'createdAt' | 'updatedAt'>;
export type NewNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type NewContentItem = Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>;
export type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>;
export type NewMealPlan = Omit<MealPlan, 'id'>;
export type NewShoppingItem = Omit<ShoppingItem, 'id' | 'createdAt'>;
export type NewFamilyEvent = Omit<FamilyEvent, 'id' | 'createdAt'>;
export type NewRoutine = Omit<Routine, 'id' | 'createdAt'>;

// Goal-driven system helper types
export type NewGoal = Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>;
export type NewWeeklyReview = Omit<WeeklyReview, 'id' | 'createdAt'>;
export type NewDailyCheckIn = Omit<DailyCheckIn, 'createdAt' | 'updatedAt'>;
export type NewGoalActivity = Omit<GoalActivity, 'id' | 'createdAt'>;

// Areas and Inbox helper types
export type NewArea = Omit<Area, 'id' | 'createdAt'>;
export type NewInboxItem = Omit<InboxItem, 'id' | 'createdAt'>;
