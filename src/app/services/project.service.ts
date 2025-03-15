import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request.interface';
import {IPageResponse} from '../interfaces/responses/project/page-response.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response.interface';
import {IProjectCreateRequest} from '../interfaces/requests/project/project-create-request.interface';
import {IProjectUpdateRequest} from '../interfaces/requests/project/update-project-request.interface';
import {IProjectUpdateResponse} from '../interfaces/responses/project/project-update-response.interface';
import {IProjectDeleteResponse} from '../interfaces/responses/project/project-delete-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly _http = inject(HttpClient);

  private readonly _apiPath = '/api/v1/projects';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  public getProjects(pageRequest?: IPageRequest, sortRequest?: ISortRequest, filterRequest?: IProjectFilterRequest): Observable<IPageResponse<IProjectResponse>> {
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
    return this._http.get<IPageResponse<IProjectResponse>>(this._apiPath, { params: params });
  }
  public createProject(projectRequest: IProjectCreateRequest): Observable<IProjectResponse> {
    return this._http.post<IProjectResponse>(this._apiPath, JSON.stringify(projectRequest), {headers: this.headers});
  }
  public updateProject(projectId: string, projectRequest: IProjectUpdateRequest): Observable<IProjectUpdateResponse> {
    return this._http.put<IProjectUpdateResponse>(`${this._apiPath}/${projectId}`, JSON.stringify(projectRequest), {headers: this.headers});
  }
  public deleteProject(projectId: string): Observable<IProjectDeleteResponse> {
    return this._http.delete<IProjectDeleteResponse>(`${this._apiPath}/${projectId}`);
  }
  //
  // public deleteAllProjects() {
  //   return this._http.delete<IProjectResponse[]>(`${this._apiPath}/all`);
  // }
}
