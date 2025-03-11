import {inject, Injectable} from '@angular/core';
import {IIssue} from '../interfaces/issue.interface';
import {delay, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IProjectRequest} from '../interfaces/project-request.interface';
import {IProject} from '../interfaces/project.interface';
import {IIssueRequest} from '../interfaces/issue-request.interface';
import {IUpdateIssueRequest} from '../interfaces/update-issue-request.interface';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiPath = '/api/v1/issues/';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  public getIssues(projectId: string) : Observable<IIssue[]> {
    console.log(`${this._apiPath}`+`${projectId}`);
    return this._httpClient.get<IIssue[]>(`${this._apiPath}`+`${projectId}`);
  }
  public createIssue(issueRequest: IIssueRequest, projectId: string): Observable<IIssue> {
    return this._httpClient.post<IIssue>(`${this._apiPath}${projectId}`, JSON.stringify(issueRequest), {headers: this.headers});
  }
  public updateIssue(updateIssueRequest: IUpdateIssueRequest, projectId: string, id: string): Observable<IIssue> {
    return this._httpClient.put<IIssue>(`${this._apiPath}`+`${projectId}`+`/${id}`, JSON.stringify(updateIssueRequest), {headers: this.headers});
  }
  public deleteIssue(projectId: string, id: string): Observable<IIssue> {
    return this._httpClient.delete<IIssue>(`${this._apiPath}`+`${projectId}`+`/${id}`);
  }
  public deleteAllIssues(projectId: string) {
    return this._httpClient.delete<IIssue>(`${this._apiPath}`+`${projectId}/all`);
  }
}
