import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants';

@Service()
export class TeamsService {
    htttp = inject(HttpClient);

    getAllTeams(){
        const url = `${BASE_URL}/teams`;
        return this.htttp.get(url);
    }
}
