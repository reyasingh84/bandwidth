import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../constants/api.constants';
import { Observable } from 'rxjs';

@Service()
export class AuthService {
    http = inject(HttpClient);

    login(email: string, password: string): Observable<any>{
        const url = `${BASE_URL}/auth/login`
        return this.http.post(url, {
            email: email,
            password: password
        })
    }
}
