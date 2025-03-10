import {Component, inject, Signal, signal} from '@angular/core';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormBuilder, FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {ProjectService} from '../../services/project.service';
import {IProjectRequest} from '../../interfaces/project-request.interface';
import {MatDialog} from '@angular/material/dialog';
import {CreateProjectDialogComponent} from '../dialogs/create-project-dialog/create-project-dialog.component';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatCheckbox} from '@angular/material/checkbox';
import {IIssue} from '../../interfaces/issue.interface';
import {IProject} from '../../interfaces/project.interface';
import {IssueService} from '../../services/issue.service';

@Component({
  selector: 'app-project',
  imports: [
    MatTableModule,
    FormsModule,
    MatButton,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatCheckbox
  ],
  templateUrl: './project.component.html',
  styleUrl: '../../../scss/project.component.scss'
})
export class ProjectComponent {
  private readonly _matDialogRef = inject(MatDialog);

  public dataSource = new ProjectDataSource();

  private _projectService = inject(ProjectService);

  public displayedColumns: string[] = ['id', 'name', 'description'];

  public code: string = "";

  public name: string = "";

  public description: string = "";


  public createProject(): void {
    const dialogRef = this._matDialogRef.open(CreateProjectDialogComponent)

    dialogRef.afterClosed().subscribe((request: IProjectRequest) => {
      if (!request) return;

      this._projectService.createProject(request).subscribe({
        next: () => this.dataSource.refresh()
      })

      console.log('The dialog was closed');
    });

  }
}
