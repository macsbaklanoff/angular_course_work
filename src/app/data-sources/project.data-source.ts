import {computed, inject, signal} from '@angular/core';
import {ProjectService} from '../services/project.service';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IIssueFilterRequest} from '../interfaces/requests/issue/issue-filter-request.interface';
import {IProjectCreateRequest} from '../interfaces/requests/project/project-create-request.interface';
import {IProjectUpdateRequest} from '../interfaces/requests/project/update-project-request.interface';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request.interface';
import {rxResource} from '@angular/core/rxjs-interop';
import {formatDistanceToNow} from 'date-fns';
import {PageEvent} from '@angular/material/paginator';


export class ProjectDataSource {

  private readonly _projectService = inject(ProjectService);

  public sortRequest = signal<ISortRequest>({
    sortBy: 'code',
    sortDir: 'asc'
  });

  public filterRequest = signal<IProjectFilterRequest>({});

  public readonly pageRequest = signal<IPageRequest>({
    pageNumber: 1,
    pageSize: 5,
  });

  private readonly _projectResource = rxResource({
    request: () => ({
      pageRequest: this.pageRequest(),
      sortRequest: this.sortRequest(),
      filterRequest: this.filterRequest()
    }),
    loader: ({request}) =>
      this._projectService.getProjects(request.pageRequest, request.sortRequest, request.filterRequest)
  });

  public readonly data = computed(() => {
    return this._projectResource.value()?.items.map(project => ({
      ...project,
      createdOn: formatDistanceToNow(new Date(project.createdOn), {addSuffix: true}),
      modifiedOn: formatDistanceToNow(new Date(project.modifiedOn), {addSuffix: true}),
    })) ?? [];
  });

  public readonly total = computed(() => {
    return this._projectResource.value()?.total ?? 0;
  });

  public readonly isLoading = computed(() => {
    return this._projectResource.isLoading();
  })

  public onPageChange($event: PageEvent) {
    this.pageRequest.set({
      pageNumber: $event.pageIndex + 1,
      pageSize: $event.pageSize,
    })
  }

  public changeSort(sortBy: string) {
    if (this.sortRequest().sortDir === 'asc') {
      this.sortRequest.set({
        sortBy: sortBy,
        sortDir: "desc"
      });
    } else {
      this.sortRequest.set({
        sortBy: sortBy,
        sortDir: "asc"
      });
    }
  }

  public getProjects(pageRequest?: IPageRequest, sortRequest?: ISortRequest, filterRequest?: IIssueFilterRequest) {
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

}
