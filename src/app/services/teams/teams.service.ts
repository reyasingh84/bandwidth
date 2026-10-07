import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants';
import { map, Observable } from 'rxjs';
import { AddTeamBody, AddTeamResponse, TeamInfo, TeamsResponse } from '../../models/team.model';
import { User } from '../../models/user.model';

@Service()
export class TeamsService {
    http = inject(HttpClient);

    getAllTeams(): Observable<TeamsResponse>{
        const url = `${BASE_URL}/teams`;
        return this.http.get<TeamsResponse>(url);
    }

    getTeamById(teamId: string): Observable<TeamInfo | undefined> {
        const url = `${BASE_URL}/teams/${teamId}`;
        return this.http.get<unknown>(url).pipe(
            map((response) => {
                console.log('Team detail API response', response);

                const payload = response as {
                    response?: Record<string, unknown>;
                    team?: Record<string, unknown>;
                };
                const body = payload.response ?? response as Record<string, unknown>;
                const team = (body['team'] as Record<string, unknown> | undefined) ?? body;
                const members = this.extractMembers(
                    body['members'] ?? body['users'] ?? team['members'] ?? team['users'],
                );

                return {
                    ...team,
                    members,
                } as TeamInfo;
            }),
        );
    }

    getTeamMembers(teamId: string): Observable<User[]> {
        const url = `${BASE_URL}/team/users/${teamId}`;
        return this.http.get<unknown>(url).pipe(
            map((response) => {
                console.log('Team members API response', response);

                if (Array.isArray(response)) {
                    return response as User[];
                }

                const payload = response as {
                    response?: unknown;
                    members?: unknown;
                    users?: unknown;
                };
                const members = payload.response ?? payload.members ?? payload.users;

                return Array.isArray(members) ? members as User[] : [];
            }),
        );
    }

    private extractMembers(value: unknown): User[] {
        if (Array.isArray(value)) {
            return value as User[];
        }

        if (value && typeof value === 'object' && 'response' in value) {
            const response = (value as { response?: unknown }).response;
            return Array.isArray(response) ? response as User[] : [];
        }

        return [];
    }

    addTeam(team: AddTeamBody): Observable<AddTeamResponse>{
        const url = `${BASE_URL}/teams/team`;
        return this.http.post<AddTeamResponse>(url, team);
    }

    updateTeam(teamId: string, team: AddTeamBody): Observable<AddTeamResponse>{
        const url = `${BASE_URL}/teams/update/${teamId}`;
        return this.http.put<AddTeamResponse>(url, team);
    }
}
