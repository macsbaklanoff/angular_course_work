import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {NavigationComponent} from '../../navigation/navigation.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-secured-area',
  imports: [
    RouterOutlet,
    MatIcon,
    NavigationComponent
  ],
  templateUrl: './secured-area.component.html',
  styleUrl: './secured-area.component.scss'
})
export class SecuredAreaComponent {
  public authService = inject(AuthService);
}
