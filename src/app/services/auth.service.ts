import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ILoginRequest} from '../interfaces/login-request.interface';
import {IRegisterRequest} from '../interfaces/register-request.interface';
import {IRegisterResponse} from '../interfaces/register-response.interface';
import {IAuthData} from '../interfaces/auth-data.interface';
import {IAuthResponse} from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  private readonly _apiPath = '/api/v1/auth';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  private readonly _accessToken = signal<string>('');

  private readonly _authData = signal<IAuthData | undefined>(undefined);

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
    console.log(this.accessToken());
  }

  public login(loginRequest: ILoginRequest): Observable<IAuthResponse> {
    return this._http.post<IAuthResponse>(`${this._apiPath}/sign-in`, JSON.stringify(loginRequest), {headers: this.headers});
  }
  public register(registerRequest: IRegisterRequest): Observable<IRegisterResponse> {
    return this._http.post<IRegisterResponse>(`${this._apiPath}/sign-up`, JSON.stringify(registerRequest), {headers: this.headers});
  }

  public updateAuthData(accessToken: string): void {
    this._accessToken.set(accessToken);
    //localStorage.setItem('accessToken', accessToken);

    const base64Url = accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = window.atob(base64)
    const payload = JSON.parse(json);

    this._authData.set({
      email: payload.email,
      name: payload.username,
    });
  }

}
