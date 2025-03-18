import {Component, effect, inject, input, signal} from '@angular/core';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgStyle} from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList, CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatDialog} from '@angular/material/dialog';
import {IIssueResponse} from '../../interfaces/responses/issue/issue.interface';
import {IIssueUpdateRequest} from '../../interfaces/requests/issue/update-issue-request.interface';
import {IIssueCreate} from '../../interfaces/requests/issue/issue-create-request.interface';
import {CreateIssueDialogComponent} from '../dialogs/issue-dialogs/create-issue-dialog/create-issue-dialog.component';
import {IPageRequest} from '../../interfaces/page-request.interface';
import {ISortRequest} from '../../interfaces/sort-request.interface';
import {IIssueFilterRequest} from '../../interfaces/requests/issue/issue-filter-request.interface';
import {UpdateIssueDialogComponent} from '../dialogs/issue-dialogs/update-issue-dialog/update-issue-dialog.component';
import {DeleteIssueDialogComponent} from '../dialogs/issue-dialogs/delete-issue-dialog/delete-issue-dialog.component';
import {MatOption, MatSelect} from '@angular/material/select';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {IProjectResponse} from '../../interfaces/responses/project/project-response.interface';
import {MatProgressBar} from '@angular/material/progress-bar';
import {toObservable} from '@angular/core/rxjs-interop';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-issues',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIcon,
    FormsModule,
    CdkDropList,
    CdkDrag,
    NgStyle,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    CdkDropListGroup,
    MatProgressBar
  ],
  templateUrl: './issues.component.html',
  styleUrl: 'issues.component.scss'
})
export class IssuesComponent {

  private readonly _matDialogRef = inject(MatDialog);

  public issueDataSource = new IssueDataSource();
  public projectDataSource = new ProjectDataSource();

  public readonly projectId = input.required<string>();

  private readonly _pageRequest = signal<IPageRequest>({
    pageNumber: 1,
    pageSize: 25,
  });

  private readonly _sortRequest = signal<ISortRequest>({
    sortBy: 'updated',
    sortDir: 'asc',
  });

  private readonly _filterRequest = signal<IIssueFilterRequest>({});

  public readonly issues = signal<IIssueResponse[]>([]);
  public readonly todo = signal<IIssueResponse[]>([]);
  public readonly inprogress = signal<IIssueResponse[]>([]);
  public readonly done = signal<IIssueResponse[]>([]);

  public isLoading = signal<boolean>(false);

  public searchTerm = signal<string>('');

  private searchTerm$ = toObservable(this.searchTerm).pipe(
    debounceTime(300)
  );

  public priorityColors: { [key: string]: string } = {
    'Critical': '#DB4242',
    'Major': '#EBA134',
    'Normal': '#dbd765',
    'Minor': '#45a85b',
  };

  toppings = new FormControl('');
  public projectsList: IProjectResponse[] = [];
  public projectIds: string[] = [];

  constructor() {
    this.projectDataSource.getProjects().subscribe({
      next: projects => {
        this.projectsList = projects.items
        //this.load()
      }
    })
    this.toppings.valueChanges.subscribe((selectedIds) => {
      if (selectedIds == null) return;

      this.projectIds = [...selectedIds]
      this.load()
    });
    effect(() => {
      this.searchTerm$.subscribe(term => {
        this._filterRequest.set({
          searchTerm: term
        })
        this.load();
      })
    });
  }


  drop(event: CdkDragDrop<IIssueResponse[]>) {
    if (this.isLoading()) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log(event.container.id)
      this.updateStageIssue(event.container.data[event.currentIndex], event.container.id)
    }
  }

  private updateStageIssue(issue: IIssueResponse, newContainerId: string): void {
    let newIssue: IIssueUpdateRequest = {
      stage: issue.stage,
      name: issue.name,
      state: issue.state,
      priority: issue.priority
    }
    this.isLoading.set(true);
    if (newContainerId == 'backlog-list') {
      newIssue = {
        stage: 'Backlog',
        name: issue.name,
        state: null,
        priority: issue.priority
      }
      this.issueDataSource.updateStageIssue(issue.id, newIssue).subscribe({
        next: () => {
          this.load()
        }
      })
    } else if (newContainerId == 'todo-list') {
      newIssue = {
        stage: 'ToDo',
        name: issue.name,
        state: null,
        priority: issue.priority
      }
      this.issueDataSource.updateStageIssue(issue.id, newIssue).subscribe({
        next: () => {
          this.load()
        }
      })
    } else if (newContainerId == 'inprogress-list') {
      newIssue = {
        stage: 'InProgress',
        name: issue.name,
        state: null,
        priority: issue.priority
      }
      this.issueDataSource.updateStageIssue(issue.id, newIssue).subscribe({
        next: () => {
          this.load()
        }
      });
    } else if (newContainerId == 'done-list') {
      newIssue = {
        stage: 'Done',
        name: issue.name,
        state: null,
        priority: issue.priority
      }
      this.issueDataSource.updateStageIssue(issue.id, newIssue).subscribe({
        next: () => {
          this.load()
        }
      });
    }
  }

  public load(): void {
    if (this.projectIds.length == 0) return;
    this.issueDataSource.getIssues(this.projectIds, this._pageRequest(), this._sortRequest(), this._filterRequest()).subscribe({
      next: (issues) => {
        let tempBacklog = []
        let tempToDo = []
        let tempInProgress = []
        let tempDone = []
        for (const issue of issues.items) {
          if (issue.stage === 'Backlog') {
            tempBacklog.push(issue)
          } else if (issue.stage === 'ToDo') {
            tempToDo.push(issue)
          } else if (issue.stage === 'InProgress') {
            tempInProgress.push(issue)
          } else {
            tempDone.push(issue)
          }
        }
        this.issues.set(tempBacklog);
        this.todo.set(tempToDo);
        this.inprogress.set(tempInProgress);
        this.done.set(tempDone);
        this.isLoading.set(false);
      },
      error: () => console.log('error')
    })
  }

  public createIssue(projectId: string): void {
    const dialogRef = this._matDialogRef.open(CreateIssueDialogComponent)

    dialogRef.afterClosed().subscribe((request: IIssueCreate) => {
      if (!request) return;
      let newRequest: IIssueCreate = {
        projectId: projectId,
        name: request.name,
        description: request.description,
        priority: request.priority,
      }
      this.issueDataSource.createIssue(newRequest).subscribe({
        next: (issue) => {
          this.load()
        }
      });
    });
  }

  public updateIssue(issue: IIssueResponse): void {
    const dialogRef = this._matDialogRef.open(UpdateIssueDialogComponent, {
      data: {
        issueName: issue.name
      }
    })

    dialogRef.afterClosed().subscribe((request: IIssueUpdateRequest) => {
      if (!request) return;

      this.issueDataSource.updateIssue(issue.id, request).subscribe({
        next: () => {
          this.load()
        }
      })
    });
  }

  public deleteIssue(issueId: string): void {
    const dialogRef = this._matDialogRef.open(DeleteIssueDialogComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.issueDataSource.deleteIssue(issueId).subscribe({
        next: () => {
          this.load()
        }
      })
    });
  }
}
