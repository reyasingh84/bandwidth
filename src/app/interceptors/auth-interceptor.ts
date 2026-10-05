import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const retrievedToken = localStorage.getItem('token');
  const finalToken = retrievedToken ?? '';

  const newReq = req.clone({
    setHeaders: {
      session_token: finalToken,
    }
  });

  return next(newReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.clear();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
