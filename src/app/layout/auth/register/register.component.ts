import {Component, computed, inject, Signal} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-register',
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly _authService = inject(AuthService);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.formStatusChange() != "VALID"
  })

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    password: new FormControl<string>("", [Validators.required]),
    username: new FormControl<string>("", [Validators.required]),
  });

  public formStatusChange = toSignal(this.loginForm.statusChanges)

  public get email(): FormControl {
    return this.loginForm.controls['email'] as FormControl;
  }
  public get password(): FormControl {
    return this.loginForm.controls['password'] as FormControl;
  }
  public get username(): FormControl {
    return this.loginForm.controls['username'] as FormControl;
  }

  public register(): void {
    if(this.isInvalidState()) return;

    this._authService.register(this.loginForm.value).subscribe({
      next: data => {
        console.log(data);
      }
    })
  }
}
