import {Routes} from '@angular/router';
import {ProjectComponent} from './layout/project/project.component';
import {IssuesComponent} from './layout/issues/issues.component';
import {LoginComponent} from './layout/auth/login/login.component';
import {RegisterComponent} from './layout/auth/register/register.component';
import {authGuard} from './guards/auth.guard';
import {SignOutComponent} from './layout/auth/sign-out/sign-out.component';
import {SecuredAreaComponent} from './layout/secured-area/secured-area.component';

export const routes: Routes = [
  {
    path: '',
    component: SecuredAreaComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'projects',
        component: ProjectComponent,
      },
      {
        path: 'issues',
        component: IssuesComponent,
      },
      {
        path: 'sign-out',
        component: SignOutComponent
      },
    ]
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
    ]
  },
];
