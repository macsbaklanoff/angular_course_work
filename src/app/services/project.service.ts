import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IProject} from '../interfaces/project.interface';
import {IProjectRequest} from '../interfaces/project-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly _http = inject(HttpClient);

  private readonly _apiPath = '/api/v1/projects';

  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  public getProjects(): Observable<IProject[]> {
    return this._http.get<IProject[]>(this._apiPath);
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
}
