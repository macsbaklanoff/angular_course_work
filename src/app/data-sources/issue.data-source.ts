import {computed, inject, signal} from '@angular/core';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IssueService} from '../services/issue.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {IProjectFilterRequest} from '../interfaces/requests/project/project-filter-request.interface';
import {IIssueFilterRequest} from '../interfaces/requests/issue/issue-filter-request.interface';
import {IProjectResponse} from '../interfaces/responses/project/project-response.interface';
import {IIssueResponse} from '../interfaces/responses/issue/issue.interface';
import {IIssueRequest} from '../interfaces/requests/issue/update-issue-request.interface';
import {IIssueCreate} from '../interfaces/requests/issue/issue-create-request.interface';
import {Observable} from 'rxjs';

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

  private readonly _issuesResource = rxResource({
    request: () => ({
      pageRequest: this._pageRequest(),
      sortRequest: this._sortRequest(),
      filterRequest: this._filterRequest(),
      projectId: this._projectId(),
    }),
    loader: ({request}) =>
      this._issueService.getIssues(request.projectId, request.pageRequest, request.sortRequest, request.filterRequest)
  });

  public readonly data = computed<IIssueResponse[]>(() => {
    return this._issuesResource.value()?.items ?? [];
  });

  // public readonly issue = computed<IIssueResponse>(() => {
  //   return this._projectResource.value()
  // })
  public readonly isLoading = computed<boolean>(() => {
    return this._issuesResource.isLoading();
  })

  public issueCreate = signal<IIssueCreate>({});

  // private readonly _issueResource = rxResource({
  //   request: () => ({
  //     pageRequest: this._pageRequest(),
  //     sortRequest: this._sortRequest(),
  //     filterRequest: this._filterRequest(),
  //     projectId: this._projectId(),
  //     issue: this.issueCreate()
  //   }),
  //   loader: ({request}) =>
  //     this._issueService.createIssue(request.projectId, request.issue, request.pageRequest, request.sortRequest, request.filterRequest)
  // });

  // public readonly dataIssue = computed<IIssueResponse>(() => {
  //   return this._issueResource.value()!;
  // });
  // public readonly dataIssue = computed<IIssueResponse>(() => {
  //   return this._issueService.createIssue(this._projectId(), this.issueCreate()).subscribe();
  // });

  public createIssue(request: IIssueCreate): Observable<IIssueResponse> {
    this.issueCreate.set(request);
    //return this.dataIssue();
    return this._issueService.createIssue(this._projectId(), request);
  }

}
