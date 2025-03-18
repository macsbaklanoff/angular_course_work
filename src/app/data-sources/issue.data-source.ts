import {inject, signal} from '@angular/core';
import {IPageRequest} from '../interfaces/page-request.interface';
import {ISortRequest} from '../interfaces/sort-request.interface';
import {IssueService} from '../services/issue.service';
import {IIssueFilterRequest} from '../interfaces/requests/issue/issue-filter-request.interface';
import {IIssueUpdateRequest} from '../interfaces/requests/issue/update-issue-request.interface';
import {IIssueCreate} from '../interfaces/requests/issue/issue-create-request.interface';

export class IssueDataSource {

  private readonly _issueService = inject(IssueService);

  public getIssues(projectIds: string[], pageRequest?: IPageRequest, sortRequest?: ISortRequest, filterRequest?: IIssueFilterRequest) {
    return this._issueService.getIssues(projectIds, pageRequest, sortRequest, filterRequest);
  }
  public createIssue(issueRequest: IIssueCreate) {
    return this._issueService.createIssue(issueRequest);
  }

  public updateStageIssue(issueId: string, issue: IIssueUpdateRequest) {
    return this._issueService.updateStageIssue(issueId, issue);
  }

  public updateIssue(issueId: string, issueRequest: IIssueUpdateRequest) {
    return this._issueService.updateIssue(issueId, issueRequest);
  }
  public deleteIssue(issueId: string) {
    return this._issueService.deleteIssue(issueId);
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
