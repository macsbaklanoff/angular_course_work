import {Routes} from '@angular/router';
import {ProjectComponent} from './layout/project/project.component';
import {IssuesComponent} from './layout/issues/issues.component';
import {LoginComponent} from './layout/auth/login/login.component';
import {RegisterComponent} from './layout/auth/register/register.component';

export const routes: Routes = [
  {
    path: 'projects',
    component: ProjectComponent,
    children: [{
      path: ':projectId',
      component: IssuesComponent
    }]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },

    ]
  },
];
