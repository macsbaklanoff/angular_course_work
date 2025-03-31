import {Component, computed, effect, inject, Signal, signal} from '@angular/core';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {
  CreateProjectDialogComponent
} from '../dialogs/project-dialogs/create-project-dialog/create-project-dialog.component';
import {Router} from '@angular/router';
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
import {IProjectResponse} from '../../interfaces/responses/project/project-response.interface';
import {IProjectUpdateRequest} from '../../interfaces/requests/project/update-project-request.interface';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {formatDistanceToNow} from 'date-fns';
import {debounceTime} from 'rxjs/operators';
import {rxResource, toObservable} from '@angular/core/rxjs-interop';
import {MatFormField, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-project',
  imports: [
    MatTableModule,
    FormsModule,
    MatButton,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatPaginator,
    MatFormField,
    MatInput,
    MatPrefix,
    MatSuffix
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private readonly _matDialogRef = inject(MatDialog);

  private readonly _pageRequest = signal<IPageRequest>({
    pageNumber: 1,
    pageSize: 5,
  });

  private readonly _sortRequest = signal<ISortRequest>({
    sortBy: 'code',
    sortDir: 'asc',
  });

  private readonly _filterRequest = signal<IProjectFilterRequest>({});


  public dataSource = new ProjectDataSource();

  public sortRequest = computed(() => {
    return this._sortRequest().sortDir;
  })

  public searchTerm = signal<string>('');

  private searchTerm$ = toObservable(this.searchTerm).pipe(
    debounceTime(300)
  );

  displayedColumns: string[] = ['code', 'name', 'created', 'modified', 'actions'];

  constructor(private router: Router) {
    this.load();
    effect(() => {
      this.searchTerm$.subscribe(term => {
        this._filterRequest.set({
          searchTerm: term
        })
        this.load();
      })
    });
  }

  private readonly _projectResource = rxResource({
    request: () => ({
      pageRequest: this._pageRequest(),
      sortRequest: this._sortRequest(),
      filterRequest: this._filterRequest()
    }),
    loader: ({request}) =>
      this.dataSource.getProjects(request.pageRequest, request.sortRequest, request.filterRequest)
  });


  public readonly projects = computed<IProjectResponse[]>(() => {
    return this._projectResource.value()?.items.map(project => ({
      ...project,
      createdOn: formatDistanceToNow(new Date(project.createdOn), {addSuffix: true}),
      modifiedOn: formatDistanceToNow(new Date(project.modifiedOn), {addSuffix: true}),
    })) ?? [];
  });

  public readonly total = computed(() => {
    return this._projectResource.value()?.total ?? 0;
  })

  public readonly isLoading = computed<boolean>(() => {
    return this._projectResource.isLoading();
  })



  public load() {
   this._sortRequest.set({
     sortBy: 'code',
     sortDir: 'asc',
   })
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
  }

  public changeSort(sortBy: string) {
    if (this._sortRequest().sortDir === 'asc') {
      this._sortRequest.set({
        sortBy: sortBy,
        sortDir: "desc"
      });
    }
    else {
      this._sortRequest.set({
        sortBy: sortBy,
        sortDir: "asc"
      });
    }
  }
}
