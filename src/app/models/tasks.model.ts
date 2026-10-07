export interface TaskCountStats {
    open: number;
    in_progress: number;
    review: number;
    testing: number;
    closed: number;
    on_hold: number;
    total: number;
}

export interface TeamTaskCountStats extends TaskCountStats {
  team_id: string;
  team_name: string;
  team_short_name: string;
  overdue: number;
}

export interface TeamOverviewRow extends TeamTaskCountStats {
  completion: number;
}

export interface TaskHistoryEntry {
  visible: string;
  timestamp: number;
}

export interface TaskInfo {
  id: string;
  team_id: string;
  team_name?: string;
  title: string;
  description: string;
  acpt_criteria: string | null;
  category: string;
  status: string;
  reporter_id: string;
  reporter_username: string;
  assignee_id: string | null;
  assignee_username: string | null;
  assignee_first_name?: string | null;
  assignee_last_name?: string | null;
  priority: number;
  proj_name: string;
  history: Record<string, TaskHistoryEntry>;
  deadline: number;
  created_at: number;
  updated_at: number;
}

export interface TasksResponse {
  error: string | null;
  success: boolean;
  message: string | null;
  response: TaskInfo[];
}


export interface TasksResponseForm {
  team_id?: string;
  title: string;
  description: string;
  acpt_criteria?: string;
  category: 'bug' | 'testing' | 'task';
  priority: number;
  proj_name: string;
  assignee_id?: string;
  assignee_username?: string;
  deadline: number;
}