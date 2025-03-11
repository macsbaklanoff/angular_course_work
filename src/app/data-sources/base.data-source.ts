import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {IIssue} from '../interfaces/issue.interface';
import {Observable, of} from 'rxjs';
import {Component, Directive, effect, inject, Injector, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {IssueService} from '../services/issue.service';

export abstract class BaseDataSource<TDataType> {

  private readonly _injector = inject(Injector);

  private readonly _data = signal<TDataType[]>([]);

  public readonly isLoading = signal<boolean>(false)

  protected readonly isInit = signal<boolean>(false);

  public readonly $data = this.connect();

  constructor(isReady: boolean = true) {

    this.isInit.set(isReady);

    effect(() => {
      if (!this.isInit) return;
      this.load()
    });
  }

  public connect(): Observable<readonly TDataType[]> {
    return toObservable(this._data, {
      injector: this._injector,
    });
  }

  public refresh(): void {
    this.load()
  }

  public disconnect(): void {
  }

  private load(): void {
    this.isLoading.set(true);
    this.getData().subscribe({
      next: data => this._data.set(data),
      error: error => console.log(error),
      complete: () => {this.isLoading.set(false);}
    })
  }

  protected abstract getData(): Observable<TDataType[]>;
}
