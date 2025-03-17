import {Component, computed, inject, model, Signal, signal} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {issuePriority} from '../../../../types/issue-type';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect
  ],
  templateUrl: './create-issue-dialog.component.html',
  styleUrl: './create-issue-dialog.component.scss'
})
export class CreateIssueDialogComponent {

  private readonly _dialogRef = inject(MatDialogRef<CreateIssueDialogComponent>);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.createFormStatusChange() != "VALID"
  })

  public createForm: FormGroup = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
    description: new FormControl<string>("", []),
    priority: new FormControl<string>("", [Validators.required]),
  });

  priorityes: issuePriority[] = ['Critical','Major','Minor','Normal'];

  public get name(): FormControl {
    return this.createForm.controls['name'] as FormControl;
  }
  public get description(): FormControl {
    return this.createForm.controls['description'] as FormControl;
  }
  public get priority(): FormControl {
    return this.createForm.controls['priority'] as FormControl;
  }

  public createFormStatusChange = toSignal(this.createForm.statusChanges)


  public onCreate(): void {
    if(this.isInvalidState()) return;
    this._dialogRef.close(this.createForm.value);
  }
}
