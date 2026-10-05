import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants';
import { Observable } from 'rxjs';
import { AddTeamBody, AddTeamResponse, TeamsResponse } from '../../models/team.model';

@Service()
export class TeamsService {
    http = inject(HttpClient);

    getAllTeams(): Observable<TeamsResponse>{
        const url = `${BASE_URL}/teams`;
        return this.http.get<TeamsResponse>(url);
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
