import {Component, inject} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  templateUrl: './delete-project-dialog.component.html',
  styleUrl: './delete-project-dialog.component.scss'
})
export class DeleteProjectDialogComponent {

  private readonly _dialogRef = inject(MatDialogRef<DeleteProjectDialogComponent>);

  public onCancel(): void {
    this._dialogRef.close(false);
  }

  public onDelete(): void {
    this._dialogRef.close(true);
  }
}
