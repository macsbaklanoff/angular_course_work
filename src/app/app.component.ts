import {Component, computed, effect, HostBinding, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavigationComponent} from './navigation/navigation.component';
import {AuthService} from './services/auth.service';
import {MatButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AsyncPipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    MatButton,
    AsyncPipe,
    MatIcon,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular_course_work';
  public authService = inject(AuthService);

}

