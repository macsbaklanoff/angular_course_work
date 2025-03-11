import {DataSource} from '@angular/cdk/collections';
import {IProject} from '../interfaces/project.interface';
import {Observable} from 'rxjs';
import {inject, Injector, signal} from '@angular/core';
import {ProjectService} from '../services/project.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {BaseDataSource} from './base.data-source';

export class ProjectDataSource extends BaseDataSource<IProject> {

  private readonly _projectService = inject(ProjectService);

  public override getData(): Observable<IProject[]> {
    return this._projectService.getProjects();
  }
}
