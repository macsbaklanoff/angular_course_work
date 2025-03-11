import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavigationComponent} from './navigation/navigation.component';
import {AuthService} from './services/auth.service';
import {MatButton} from '@angular/material/button';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    MatButton,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular_course_work';
  public authService = inject(AuthService);
}
