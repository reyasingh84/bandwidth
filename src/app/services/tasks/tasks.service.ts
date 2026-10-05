import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants';
import { Observable } from 'rxjs';

@Service()
export class TasksService {
    http = inject(HttpClient);

    getDashboardStats(): Observable<any>{
        const url = `${BASE_URL}/tasks/statistics`
        return this.http.get(url)
    }

    getDashboardTeamStats(): Observable<any>{
        const url = `${BASE_URL}/tasks/statistics/team`
        return this.http.get(url)
    }
}
