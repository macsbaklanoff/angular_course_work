import {Routes} from '@angular/router';
import {ProjectComponent} from './layout/project/project.component';
import {IssuesComponent} from './layout/issues/issues.component';
import {LoginComponent} from './layout/auth/login/login.component';
import {RegisterComponent} from './layout/auth/register/register.component';
import {authGuard} from './guards/auth.guard';
import {SignOutComponent} from './layout/auth/sign-out/sign-out.component';

export const routes: Routes = [
  {
    path: 'projects',
    component: ProjectComponent,
    canActivate: [authGuard],
    children: [{
      path: ':projectId',
      component: IssuesComponent
    }]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        component: LoginComponent
      },
      {
        path: 'sign-up',
        component: RegisterComponent
      },
      {
        path: 'sign-out',
        canActivate: [authGuard],
        component: SignOutComponent
      },
    ]
  },
];
