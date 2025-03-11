import {computed, inject, signal} from '@angular/core';
import {ProjectService} from '../services/project.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IProjectFilterRequest} from '../interfaces/project-filter-request.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response.interface';

export class ProjectDataSource {

  private readonly _projectService = inject(ProjectService);

  private readonly _pageRequest = signal<IPageRequest>({
    pageNumber: 1,
    pageSize: 25,
  });

  private readonly _sortRequest = signal<ISortRequest>({
    sortBy: 'updated',
    sortDir: 'desc',
  });

  private readonly _filterRequest = signal<IProjectFilterRequest>({});

  private readonly _projectResource = rxResource({
    request: () => ({
      pageRequest: this._pageRequest(),
      sortRequest: this._sortRequest(),
      filterRequest: this._filterRequest()
    }),
    loader: ({request}) =>
      this._projectService.getProjects(request.pageRequest, request.sortRequest, request.filterRequest)
  });

  public readonly data = computed<IProjectResponse[]>(() => {
    return this._projectResource.value()?.items ?? []
  })

  public readonly isLoading = computed<boolean>(() => {
    return this._projectResource.isLoading();
  })
}
