import {Component, inject, signal} from '@angular/core';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {ProjectService} from '../../services/project.service';
import {MatDialog} from '@angular/material/dialog';
import {
  CreateProjectDialogComponent
} from '../dialogs/project-dialogs/create-project-dialog/create-project-dialog.component';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {
  UpdateProjectDialogComponent
} from '../dialogs/project-dialogs/update-project-dialog/update-project-dialog.component';
import {
  DeleteProjectDialogComponent
} from '../dialogs/project-dialogs/delete-project-dialog/delete-project-dialog.component';
import {IProjectCreateRequest} from '../../interfaces/requests/project/project-create-request.interface';
import {IPageRequest} from '../../interfaces/page-request.interface';
import {ISortRequest} from '../../interfaces/sort-request.interface';
import {IProjectFilterRequest} from '../../interfaces/requests/project/project-filter-request.interface';
import {IIssueResponse} from '../../interfaces/responses/issue/issue.interface';
import {IProjectResponse} from '../../interfaces/responses/project/project-response.interface';
import {IProjectUpdateRequest} from '../../interfaces/requests/project/update-project-request.interface';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-project',
  imports: [
    MatTableModule,
    FormsModule,
    MatButton,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatInput
  ],
  templateUrl: './project.component.html',
  styleUrl: '../../../scss/project.component.scss'
})
export class ProjectComponent {
  private readonly _matDialogRef = inject(MatDialog);

  public dataSource = new ProjectDataSource();

  private _projectService = inject(ProjectService);

  private readonly _pageRequest = signal<IPageRequest>({
    pageNumber: 1,
    pageSize: 25,
  });

  private readonly _sortRequest = signal<ISortRequest>({
    sortBy: 'updated',
    sortDir: 'asc',
  });

  private readonly _filterRequest = signal<IProjectFilterRequest>({});

  public searchTerm: string = '';

  public readonly projects = signal<IProjectResponse[]>([]);


  constructor(private router: Router) {
    this.load();
  }
  public search(): void {
    this.load();
  }

  public load() {
    this.dataSource.getProjects(this._pageRequest(), this._sortRequest(), this._filterRequest()).subscribe({
      next: (projects) => this.projects.set(projects.items.filter((project) =>
        project.name.includes(this.searchTerm)))
    });
  }

  public sortDirAscending() {
    this._sortRequest.set({sortBy: 'updated', sortDir: 'asc'});
    this.load()
  }
  public sortDirDescending() {
    this._sortRequest.set({sortBy: 'updated', sortDir: 'desc'});
    this.load()
  }
  public sortByAscending() {
    this._sortRequest.set({sortBy: 'updated', sortDir: 'asc'});
    this.load()
  }
  public sortByDescending() {
    this._sortRequest.set({sortBy: 'code', sortDir: 'asc'});
    this.load()
  }

  public createProject(): void {
    const dialogRef = this._matDialogRef.open(CreateProjectDialogComponent)

    dialogRef.afterClosed().subscribe((request: IProjectCreateRequest) => {
      if (!request) return;
      this.dataSource.createProject(request).subscribe({
        next: () => {
          this.load()
        }
      })
    });
  }

  public updateProject(projectId: string) {
    const dialogRef = this._matDialogRef.open(UpdateProjectDialogComponent)

    dialogRef.afterClosed().subscribe((request: IProjectUpdateRequest) => {
      if (!request) return;
      this.dataSource.updateProject(projectId, request).subscribe({
        next: () => {
          this.load()
        }
      });
      console.log('The dialog was closed');
    });
  }
  public deleteProject(projectId: string) {
    const dialogRef = this._matDialogRef.open(DeleteProjectDialogComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataSource.deleteProject(projectId).subscribe({
        next: () => {
          this.load()
        }
      });
    });
  }
}
