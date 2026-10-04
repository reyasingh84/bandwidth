import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const retrievedToken = localStorage.getItem('token');
  const finalToken: string = retrievedToken? retrievedToken: "";

  const newReq = req.clone({
    setHeaders: {
      session_token : finalToken
    }
  });
  return next(newReq);
};
