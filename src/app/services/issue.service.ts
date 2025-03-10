import {inject, Injectable} from '@angular/core';
import {IIssue} from '../interfaces/issue.interface';
import {delay, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiPath = '/api/v1/issues/';

  public getIssues(projectId: string) : Observable<IIssue[]> {
    console.log(`${this._apiPath}`+`${projectId}`);
    return this._httpClient.get<IIssue[]>(`${this._apiPath}`+`${projectId}`);
  }
}
