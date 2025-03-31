import {Component, effect, inject, signal} from '@angular/core';
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
import {IProjectUpdateRequest} from '../../interfaces/requests/project/update-project-request.interface';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {debounceTime} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';
import {MatFormField, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';

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
    MatSuffix,
    MatProgressBar,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  private readonly _matDialogRef = inject(MatDialog);

  public dataSource = new ProjectDataSource();

  public searchTerm = signal<string>('');

  private searchTerm$ = toObservable(this.searchTerm).pipe(
    debounceTime(300)
  );

  displayedColumns: string[] = ['code', 'name', 'created', 'modified', 'actions'];

  constructor(private router: Router) {
    effect(() => {
      this.searchTerm$.subscribe(term => {
        this.dataSource.filterRequest.set({
          searchTerm: term
        })
        this.load();
      })
    });
  }

  public load() {
    this.dataSource.sortRequest.set({
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
        error: err => {
          alert(err.error.detail)
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
        },
        error: err => {
          alert(err.error.detail)
        }
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
        error: err => {
          alert(err.error.detail)
        }
      });
    });
  }
}
