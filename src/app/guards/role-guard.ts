import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../models/user.model';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const userDetails = localStorage.getItem('userDetails');

    if (!userDetails) {
      return router.createUrlTree(['/dashboard']);
    }

    try {
      const user = JSON.parse(userDetails) as Partial<User>;
      const currentRole = typeof user.role === 'string'
        ? user.role.trim().toLowerCase()
        : '';
      const hasPermission = allowedRoles.some(
        (role) => role.trim().toLowerCase() === currentRole,
      );

      return hasPermission
        ? true
        : router.createUrlTree(['/dashboard']);
    } catch {
      return router.createUrlTree(['/dashboard']);
    }
  };
};
