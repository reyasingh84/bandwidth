import { inject, Service } from '@angular/core';
import { User, UsersResponse } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../constants/api.constants';
import { Observable } from 'rxjs';

@Service()
export class UsersService {

    http = inject(HttpClient);

    getUserInfo(): User | null {
        const storedUser = localStorage.getItem('userDetails');

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as User;
        } catch {
            return null;
        }
    }


    getUsersByTeamId(teamId: string): Observable<any>{
        const url = `${BASE_URL}/admin/users`
        return this.http.get(url)
    }

    getAllUsers(): Observable<User[] | UsersResponse>{
        const url = `${BASE_URL}/admin/users`
        return this.http.get<User[] | UsersResponse>(url)
    }
}
