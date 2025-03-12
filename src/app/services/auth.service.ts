import {computed, effect, Inject, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IAuthData} from '../interfaces/requests/auth/auth-data.interface';
import {ILoginRequest} from '../interfaces/requests/auth/login/login-request.interface';
import {IAuthResponse} from '../interfaces/responses/auth/auth-response.interface';
import {IRegisterRequest} from '../interfaces/requests/auth/register/register-request.interface';
import {IRegisterResponse} from '../interfaces/responses/auth/register-response.interface';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _router = Inject(Router);

  private readonly _http = inject(HttpClient);

  private readonly _apiPath = '/api/v1/auth';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  private readonly _accessToken = signal<string>(localStorage.getItem('accessToken') ?? '');

  private readonly _authData = computed<IAuthData | undefined>(() => {
    if (!this.accessToken()) return undefined;
    const base64Url = this.accessToken().split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = window.atob(base64)
    const payload = JSON.parse(json);

    return {
      email: payload.email,
      name: payload.username,
    };
  });

  public readonly isAuthorized = computed(() => {
    return !!this._authData();
  })
  public readonly authData = computed(() => {
    return this._authData();
  })
  public readonly accessToken = computed(() => {
    return this._accessToken();
  })

  constructor() {
    effect(() => {
      localStorage.setItem('accessToken', this.accessToken());
    });
  }

  public login(loginRequest: ILoginRequest): Observable<void> {
    return this._http.post<IAuthResponse>(`${this._apiPath}/sign-in`, JSON.stringify(loginRequest), {headers: this.headers}).pipe(
      map(authResponse => {
        this._accessToken.set(authResponse.accessToken);
        this._router.navigate(['projects']).then(() => {});
      })
    );
  }
  public register(registerRequest: IRegisterRequest): Observable<IRegisterResponse> {
    return this._http.post<IRegisterResponse>(`${this._apiPath}/sign-up`, JSON.stringify(registerRequest), {headers: this.headers});
  }
}
