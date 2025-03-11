import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IProject} from '../interfaces/project.interface';
import {IProjectRequest} from '../interfaces/project-request.interface';
import {IPageResponse} from '../interfaces/responses/project/page-response.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response.interface';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IProjectFilterRequest} from '../interfaces/project-filter-request.interface';

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
  public createProject(projectRequest: IProjectRequest): Observable<IProject> {
    return this._http.post<IProject>(this._apiPath, JSON.stringify(projectRequest), {headers: this.headers});
  }
  public updateProject(projectRequest: IProjectRequest, projectId: string): Observable<IProject[]> {
    return this._http.put<IProject[]>(`${this._apiPath}/${[projectId]}`, JSON.stringify(projectRequest), {headers: this.headers});
  }
  public deleteProject(projectId: string): Observable<IProject[]> {
    return this._http.delete<IProject[]>(`${this._apiPath}/${[projectId]}`);
  }

  public deleteAllProjects() {
    return this._http.delete<IProject[]>(`${this._apiPath}/all`);
  }
}
