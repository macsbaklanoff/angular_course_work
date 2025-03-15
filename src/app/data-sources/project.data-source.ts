import {inject} from '@angular/core';
import {ProjectService} from '../services/project.service';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IIssueFilterRequest} from '../interfaces/requests/issue/issue-filter-request.interface';
import {IProjectCreateRequest} from '../interfaces/requests/project/project-create-request.interface';
import {IProjectUpdateRequest} from '../interfaces/requests/project/update-project-request.interface';


export class ProjectDataSource {

  private readonly _projectService = inject(ProjectService);

  public getProjects(pageRequest: IPageRequest, sortRequest: ISortRequest, filterRequest: IIssueFilterRequest) {
    return this._projectService.getProjects(pageRequest, sortRequest, filterRequest);
  }
  public createProject(projectRequest: IProjectCreateRequest) {
    return this._projectService.createProject(projectRequest);
  }
  public updateProject(projectId: string, projectRequest: IProjectUpdateRequest) {
    return this._projectService.updateProject(projectId, projectRequest);
  }
  public deleteProject(projectId: string) {
    return this._projectService.deleteProject(projectId);
  }
  // private readonly _projectResource = rxResource({
  //   request: () => ({
  //     pageRequest: this._pageRequest(),
  //     sortRequest: this._sortRequest(),
  //     filterRequest: this._filterRequest()
  //   }),
  //   loader: ({request}) =>
  //     this._projectService.getProjects(request.pageRequest, request.sortRequest, request.filterRequest)
  // });
  //
  // public readonly data = computed<IProjectResponse[]>(() => {
  //   return this._projectResource.value()?.items ?? [];
  // });
  //
  // public readonly isLoading = computed<boolean>(() => {
  //   return this._projectResource.isLoading();
  // })
}
