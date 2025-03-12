import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {IIssueResponse} from '../interfaces/responses/issue/issue.interface';
import {IPageResponse} from '../interfaces/responses/project/page-response.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response.interface';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request.interface';
import {IIssueCreate} from '../interfaces/requests/issue/issue-create-request.interface';
import {IIssueUpdateResponse} from '../interfaces/responses/issue/issue-update-respone.interface';
import {IIssueUpdateRequest} from '../interfaces/requests/issue/update-issue-request.interface';
import {IIssueDeleteResponse} from '../interfaces/responses/issue/issue-delete-response.interface';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _apiPath = '/api/v1/issues/';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  public getIssues(projectId: string, pageRequest?: IPageRequest, sortRequest?: ISortRequest, filterRequest?: IProjectFilterRequest) : Observable<IPageResponse<IIssueResponse>> {
    // console.log(`${this._apiPath}`+`${projectId}`);
    // return this._httpClient.get<IIssue[]>(`${this._apiPath}`+`${projectId}`);
    let params = new HttpParams();

    if (!!pageRequest) { //!! более надежный запрос для проверки сложных значений
      params = params.append("pageNumber", pageRequest.pageNumber);
      params = params.append("pageSize", pageRequest.pageSize);
    }
    if (!!sortRequest) {
      params = params.append("sortBy", sortRequest.sortBy);
      params = params.append("sortDir", sortRequest.sortDir);
    }
    if (!!filterRequest) {
      if (!!filterRequest.searchTerm) {
        params = params.append("searchTerm", filterRequest.searchTerm);
      }
    }
    console.log("getIssues");
    return this._httpClient.get<IPageResponse<IIssueResponse>>(`${this._apiPath}${projectId}`, { params: params });
  }
  public createIssue(projectId: string, issueRequest: IIssueCreate): Observable<IIssueResponse> {
    let params = new HttpParams();
    return this._httpClient.post<IIssueResponse>(`${this._apiPath}${projectId}`, JSON.stringify(issueRequest), {params: params});
  }
  public updateIssue(projectId: string, id: string, updateIssueRequest: IIssueUpdateRequest): Observable<IIssueUpdateResponse> {
    return this._httpClient.put<IIssueUpdateResponse>(`${this._apiPath}`+`${projectId}`+`/${id}`, JSON.stringify(updateIssueRequest), {headers: this.headers});
  }
  public deleteIssue(projectId: string, id: string): Observable<IIssueDeleteResponse> {
    return this._httpClient.delete<IIssueDeleteResponse>(`${this._apiPath}`+`${projectId}`+`/${id}`);
  }
  // public deleteAllIssues(projectId: string) {
  //   return this._httpClient.delete<IIssue>(`${this._apiPath}`+`${projectId}/all`);
  // }
}
