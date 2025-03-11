import {inject, Injectable} from '@angular/core';
import {IIssue} from '../interfaces/issue.interface';
import {delay, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IProjectRequest} from '../interfaces/project-request.interface';
import {IProject} from '../interfaces/project.interface';
import {IIssueRequest} from '../interfaces/issue-request.interface';

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
  public createIssue(issueRequest: IIssueRequest, projectId: string): Observable<IIssue> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this._httpClient.post<IIssue>(`${this._apiPath}${projectId}`, JSON.stringify(issueRequest), {headers: headers});
  }
}
