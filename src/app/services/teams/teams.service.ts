import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants';
import { map, Observable } from 'rxjs';
import { AddTeamBody, AddTeamResponse, TeamInfo, TeamsResponse } from '../../models/team.model';

@Service()
export class TeamsService {
    http = inject(HttpClient);

    getAllTeams(): Observable<TeamsResponse>{
        const url = `${BASE_URL}/teams`;
        return this.http.get<TeamsResponse>(url);
    }

    getTeamById(teamId: string): Observable<TeamInfo | undefined> {
        return this.getAllTeams().pipe(map((response) => response.response.find((team) => team.id === teamId)));
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
