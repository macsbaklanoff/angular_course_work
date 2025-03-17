import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-sign-out',
  imports: [
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    RouterLink,
    MatError,
    MatFormField,
    MatInput,
    MatLabel
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
