import {Component, HostBinding, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationComponent} from './navigation/navigation.component';
import {AuthService} from './services/auth.service';
import {MatButton} from '@angular/material/button';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AsyncPipe} from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    MatButton,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular_course_work';
  public authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.isPhone$.subscribe(isPhone => {this.isMobileLayout = isPhone})
  }

  @HostBinding('class.mobile-layout') isMobileLayout = false;
  public isPhone$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 400px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    )

}

