import {computed, inject, signal} from '@angular/core';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IssueService} from '../services/issue.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request.interface';
import {IIssueFilterRequest} from '../interfaces/requests/issue/issue-filter-request.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response.interface';
import {IIssueResponse} from '../interfaces/responses/issue/issue.interface';
import {IIssueUpdateRequest} from '../interfaces/requests/issue/update-issue-request.interface';
import {IIssueCreate} from '../interfaces/requests/issue/issue-create-request.interface';
import {Observable} from 'rxjs';
import {IPageResponse} from '../interfaces/responses/project/page-response.interface';

export class IssueDataSource {

  private readonly _issueService = inject(IssueService);

  private readonly _pageRequest = signal<IPageRequest>({
    pageNumber: 1,
    pageSize: 25,
  });

  private readonly _sortRequest = signal<ISortRequest>({
    sortBy: 'updated',
    sortDir: 'desc',
  });

  private readonly _filterRequest = signal<IIssueFilterRequest>({});

  public readonly _projectId = signal<string>('');

  public getIssues(projectId: string, pageRequest: IPageRequest, sortRequest: ISortRequest, filterRequest: IIssueFilterRequest) {
    return this._issueService.getIssues(projectId, pageRequest, sortRequest, filterRequest);
  }
  public createIssue(projectId: string, issueRequest: IIssueCreate) {
    return this._issueService.createIssue(projectId, issueRequest);
  }
  public updateIssue(projectId: string, id: string, issueRequest: IIssueUpdateRequest) {
    return this._issueService.updateIssue(projectId, id, issueRequest);
  }
  public deleteIssue(projectId: string, id: string) {
    return this._issueService.deleteIssue(projectId, id);
  }
  // private readonly _issuesResource = rxResource({
  //   request: () => ({
  //     pageRequest: this._pageRequest(),
  //     sortRequest: this._sortRequest(),
  //     filterRequest: this._filterRequest(),
  //     projectId: this._projectId(),
  //   }),
  //   loader: ({request}) =>
  //     this._issueService.getIssues(request.projectId, request.pageRequest, request.sortRequest, request.filterRequest)
  // });

  // public readonly data = computed<IIssueResponse[]>(() => {
  //   return this._issuesResource.value()?.items ?? [];
  // });
  //
  // public readonly isLoading = computed<boolean>(() => {
  //   return this._issuesResource.isLoading();
  // })
  //
  // public createIssue(request: IIssueCreate): Observable<IIssueResponse> {
  //   return this._issueService.createIssue(this._projectId(), request);
  // }
}
