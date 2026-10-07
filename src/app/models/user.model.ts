export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone: string | null;
    role: string;
    team_id: string | null;
    department: string;
    designation: string | null;
    is_active?: boolean;
    created_at?: number;
    updated_at?: number;
}

export interface UsersResponse {
    error: string | null;
    success: boolean;
    message: string | null;
    response: User[];
}