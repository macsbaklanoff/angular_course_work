import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  let headers = req.headers;

  headers = headers.set('Content-Type', 'application/json');

  headers = authService.addAuthorizationHeader(headers);

  req = req.clone({ headers: headers });

  return next(req);
};
