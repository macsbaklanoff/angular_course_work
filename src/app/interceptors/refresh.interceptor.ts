import {HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';
import {Observable} from 'rxjs';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  return new Observable<HttpEvent<any>>(subscriber => {
    let originalRequestSubscription = next(req).subscribe({
      next: response => subscriber.next(response),
      error: error => {
        if (error.status === 401) {
          authService.handleUnauthorizedError(subscriber, req);
        } else {
          subscriber.error(error);
        }
      },
      complete: () => subscriber.complete()
    });

    return () => {
      originalRequestSubscription.unsubscribe();
    };
  });
};
