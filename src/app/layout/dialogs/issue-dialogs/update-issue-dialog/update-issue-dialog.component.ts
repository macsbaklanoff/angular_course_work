import {Component, computed, Inject, inject, model, Signal, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {toSignal} from '@angular/core/rxjs-interop';
import {issuePriority} from '../../../../types/issue-type';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption
  ],
  templateUrl: './update-issue-dialog.component.html',
  styleUrl: './update-issue-dialog.component.scss'
})
export class UpdateIssueDialogComponent {


  private readonly _dialogRef = inject(MatDialogRef<UpdateIssueDialogComponent>);

  public readonly isInvalidState: Signal<boolean> = computed(() => {
    return this.createFormStatusChange() != "VALID"
  })

  public updateForm: FormGroup = new FormGroup({
    name: new FormControl<string>("", []),
    description: new FormControl<string>("", []),
    priority: new FormControl<issuePriority>("Critical", []),
  });

  public createFormStatusChange = toSignal(this.updateForm.statusChanges)
  priorityes: issuePriority[] = ['Critical','Major','Minor','Normal'];

  public get name(): FormControl {
    return this.updateForm.controls['name'] as FormControl;
  }
  public get priority(): FormControl {
    return this.updateForm.controls['priority'] as FormControl;
  }

  public onCreate(): void {
    if(this.isInvalidState()) return;
    this._dialogRef.close(this.updateForm.value);
  }
}
