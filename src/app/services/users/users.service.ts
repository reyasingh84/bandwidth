import { Service } from '@angular/core';
import { User } from '../../models/user.model';

@Service()
export class UsersService {
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
}
