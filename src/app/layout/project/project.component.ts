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
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {IPageResponse} from '../../interfaces/responses/project/page-response.interface';
import {formatDistanceToNow} from 'date-fns';
import {map} from 'rxjs/operators';

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
    MatInput,
    MatPaginator
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
    pageSize: 5,
  });

  public readonly total = signal<number>(0);

  private readonly _sortRequest = signal<ISortRequest>({
    sortBy: 'updated',
    sortDir: 'asc',
  });

  private readonly _filterRequest = signal<IProjectFilterRequest>({});

  public searchTerm: string = '';

  public readonly projects = signal<IProjectResponse[]>([]);

  displayedColumns: string[] = ['code', 'name', 'created', 'modified', 'actions'];

  constructor(private router: Router) {
    this.load();
  }

  public search(): void {
    this.load();
  }

  public load() {
    this.dataSource.getProjects(this._pageRequest(), this._sortRequest(), this._filterRequest()).subscribe({
      next: (projects) => {
        const transformedProjects = projects.items.map(project => ({
            ...project,
            createdOn: formatDistanceToNow(new Date(project.createdOn), {addSuffix: true}),
            modifiedOn: formatDistanceToNow(new Date(project.modifiedOn), {addSuffix: true}),
          })
        )
        this.projects.set(transformedProjects);
        this.total.set(projects.total);
        this._pageRequest.set({
          pageNumber: projects.pageNumber,
          pageSize: projects.pageSize,
        })
      }
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
        },
        error: err => {alert(err.error.detail)}
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
        },
        error: err => {alert(err.error.detail)}
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
        },
        error: err => {alert(err.error.detail)}
      });
    });
  }

  public onPageChange($event: PageEvent) {
    this._pageRequest.set({
      pageNumber: $event.pageIndex + 1,
      pageSize: $event.pageSize,
    })
    this.load();
  }
}
