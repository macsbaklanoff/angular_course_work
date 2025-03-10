import { Routes } from '@angular/router';
import {ProjectComponent} from './layout/project/project.component';
import {IssuesComponent} from './layout/issues/issues.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [{
      path: ':projectId',
      component: IssuesComponent
    }]
  }
];
