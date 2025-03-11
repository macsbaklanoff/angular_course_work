import {Component, computed, inject, Signal} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _authService = inject(AuthService);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.formStatusChange() != "VALID"
  })

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    password: new FormControl<string>("", [Validators.required]),
  });

  public formStatusChange = toSignal(this.loginForm.statusChanges)

  public get email(): FormControl {
    return this.loginForm.controls['email'] as FormControl;
  }
  public get password(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }

  public login(): void {
    if(this.isInvalidState()) return;

    this._authService.login(this.loginForm.value).subscribe({
      next: result => {
        this._authService.updateAuthData(result.accessToken);
      }
    })
  }
}
