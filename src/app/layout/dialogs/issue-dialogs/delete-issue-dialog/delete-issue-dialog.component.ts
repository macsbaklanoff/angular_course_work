import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ReactiveFormsModule, } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './delete-issue-dialog.component.html',
  styleUrl: './delete-issue-dialog.component.scss'
})
export class DeleteIssueDialogComponent {

  private readonly _dialogRef = inject(MatDialogRef<DeleteIssueDialogComponent>);

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  public onDelete(): void {
    this._dialogRef.close(true);
  }
}
