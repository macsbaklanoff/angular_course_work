import {Component, computed, inject, Signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatLabel
  ],
  templateUrl: './update-project-dialog.component.html',
  styleUrl: './update-project-dialog.component.scss'
})
export class UpdateProjectDialogComponent {

  private readonly _dialogRef = inject(MatDialogRef<UpdateProjectDialogComponent>);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.createFormStatusChange() != "VALID"
  })

  public createForm: FormGroup = new FormGroup({
    code: new FormControl<string>("", [Validators.required]),
    name: new FormControl<string>("", [Validators.required]),
    description: new FormControl<string>("", []),
  });

  public createFormStatusChange = toSignal(this.createForm.statusChanges)

  public get code(): FormControl {
    return this.createForm.controls['code'] as FormControl;
  }
  public get name(): FormControl {
    return this.createForm.controls['name'] as FormControl;
  }
  public get description(): FormControl {
    return this.createForm.controls['description'] as FormControl;
  }

  public onCreate(): void {
    if(this.isInvalidState()) return;
    this._dialogRef.close(this.createForm.value);
  }
}
