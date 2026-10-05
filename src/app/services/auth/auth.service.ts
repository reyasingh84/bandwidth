import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { BASE_URL } from '../../constants/api.constants'; 
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class AuthService {
    http = inject(HttpClient);
    router = inject(Router);

    login(email: string, password: string): Observable<any>{
        const url = `${BASE_URL}/auth/login`
        return this.http.post(url, {
            email: email,
            password: password
        })
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['login']);
    }
}
