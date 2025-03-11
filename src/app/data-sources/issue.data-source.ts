import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {IIssue} from '../interfaces/issue.interface';
import {Observable, of} from 'rxjs';
import {Component, Directive, effect, inject, Injector, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {IssueService} from '../services/issue.service';
import {BaseDataSource} from './base.data-source';

export class IssueDataSource extends BaseDataSource<IIssue> {

  private readonly _issueService = inject(IssueService);

  public readonly _projectId = signal<string>('');

  constructor() {
    super(false);
    effect(() => {
      if (!this._projectId) return;
      this.isInit.set(true);
    });
  }
  public override getData(): Observable<IIssue[]> {
    return this._issueService.getIssues(this._projectId());
  }
}
