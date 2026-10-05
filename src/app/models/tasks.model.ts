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
