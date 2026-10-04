import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    id: string;
    username: string;
    email: string;
    role: string;
    team_id: string | null;
    iat: number;
    exp: number;
}

export function isValidAuthToken(token: string): boolean {
    try {
        const payload = jwtDecode<TokenPayload>(token);
        return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}
