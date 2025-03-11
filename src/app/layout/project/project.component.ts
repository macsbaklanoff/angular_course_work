import {Component, inject, Signal, signal} from '@angular/core';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormBuilder, FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ProjectService} from '../../services/project.service';
import {IProjectRequest} from '../../interfaces/project-request.interface';
import {MatDialog} from '@angular/material/dialog';
import {CreateProjectDialogComponent} from '../dialogs/project-dialogs/create-project-dialog/create-project-dialog.component';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatCheckbox} from '@angular/material/checkbox';
import {IIssue} from '../../interfaces/issue.interface';
import {IProject} from '../../interfaces/project.interface';
import {IssueService} from '../../services/issue.service';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {
  UpdateProjectDialogComponent
} from '../dialogs/project-dialogs/update-project-dialog/update-project-dialog.component';
import {
  DeleteProjectDialogComponent
} from '../dialogs/project-dialogs/delete-project-dialog/delete-project-dialog.component';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project',
  imports: [
    MatTableModule,
    FormsModule,
    MatButton,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './project.component.html',
  styleUrl: '../../../scss/project.component.scss'
})
export class ProjectComponent {
  private readonly _matDialogRef = inject(MatDialog);

  public dataSource = new ProjectDataSource();

  public issueDataSource = new IssueDataSource();

  private _projectService = inject(ProjectService);

  public displayedColumns: string[] = ['id', 'name', 'description'];

  public code: string = "";

  public name: string = "";

  public description: string = "";

  constructor(private router: Router) {}

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

  public updateProject(projectId: string) {
    const dialogRef = this._matDialogRef.open(UpdateProjectDialogComponent)

    dialogRef.afterClosed().subscribe((request: IProjectRequest) => {
      if (!request) return;

      this._projectService.updateProject(request, projectId).subscribe({
        next: () => this.dataSource.refresh()
      })

      console.log('The dialog was closed');
    });
  }

  public deleteProject(projectId: string) {
    const dialogRef = this._matDialogRef.open(DeleteProjectDialogComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this._projectService.deleteProject(projectId).subscribe({
        next: () => this.dataSource.refresh()
      })
      this.dataSource.getData().subscribe({
        next: (projects) => {
          this.router.navigate([`/${projects[0].id}`]);
        }
      })
      console.log('The dialog was closed');
    });
  }
}
