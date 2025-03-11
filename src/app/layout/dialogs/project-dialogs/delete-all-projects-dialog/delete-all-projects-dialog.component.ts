import {Component, computed, inject, model, Signal, signal} from '@angular/core';
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
  templateUrl: './delete-all-projects-dialog.component.html',
  styleUrl: './delete-all-projects-dialog.component.scss'
})
export class DeleteAllProjectsDialogComponent {

  private readonly _dialogRef = inject(MatDialogRef<DeleteAllProjectsDialogComponent>);

  public onConfirm() {
    this._dialogRef.close(true);
  }
  public onCancel() {
    this._dialogRef.close(false);
  }

}
