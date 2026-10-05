export interface TeamInfo {
  id: string;
  name: string;
  short_name: string;
  description: string;
  created_at: number;
  updated_at: number;
}

export interface TeamsResponse {
  error: string | null;
  success: boolean;
  message: string | null;
  response: TeamInfo[];
}

export interface AddTeamBody {
  name: string;
  short_name: string;
  description: string;
}

export interface AddTeamResponse {
  error: string | null;
  success: boolean;
  message: string | null;
  response: TeamInfo;
}
