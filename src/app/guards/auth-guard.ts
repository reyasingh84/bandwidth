
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { isValidAuthToken } from "../utils/auth-token";

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (token && isValidAuthToken(token)) {
        return true;
    }

    if (token) {
        localStorage.removeItem('token');
    }

    return router.createUrlTree(['/login']);
};