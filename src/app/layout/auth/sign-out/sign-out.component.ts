import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sign-out',
  imports: [
    FormsModule,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './sign-out.component.html',
  styleUrl: './sign-out.component.scss'
})
export class SignOutComponent {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  public signOut() {
    this._authService.signOut();
  }
  public cancel() {
    this._router.navigate(['projects'])
  }
}
