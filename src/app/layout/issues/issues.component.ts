import {Component, effect, inject, Input, input, OnInit, signal} from '@angular/core';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, NgStyle} from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList, CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {MatMenu, MatMenuItem, MatMenuPanel, MatMenuTrigger} from '@angular/material/menu';
import {MatDialog} from '@angular/material/dialog';
import {ProjectService} from '../../services/project.service';
import {IssueService} from '../../services/issue.service';
import {IIssueResponse} from '../../interfaces/responses/issue/issue.interface';
import {
  CreateProjectDialogComponent
} from '../dialogs/project-dialogs/create-project-dialog/create-project-dialog.component';
import {IIssueUpdateRequest} from '../../interfaces/requests/issue/update-issue-request.interface';
import {IIssueCreate} from '../../interfaces/requests/issue/issue-create-request.interface';
import {CreateIssueDialogComponent} from '../dialogs/issue-dialogs/create-issue-dialog/create-issue-dialog.component';
import {IPageRequest} from '../../interfaces/page-request.interface';
import {ISortRequest} from '../../interfaces/sort-request.interface';
import {IIssueFilterRequest} from '../../interfaces/requests/issue/issue-filter-request.interface';
import {IPageResponse} from '../../interfaces/responses/project/page-response.interface';
import {UpdateIssueDialogComponent} from '../dialogs/issue-dialogs/update-issue-dialog/update-issue-dialog.component';
import {DeleteIssueDialogComponent} from '../dialogs/issue-dialogs/delete-issue-dialog/delete-issue-dialog.component';
import {MatPaginator} from "@angular/material/paginator";
import {MatOption, MatSelect} from '@angular/material/select';
import {ProjectDataSource} from '../../data-sources/project.data-source';
import {IProjectResponse} from '../../interfaces/responses/project/project-response.interface';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatProgressBar} from '@angular/material/progress-bar';
import {issuePriority} from '../../types/issue-type';

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
    CdkDragPlaceholder,
    NgStyle,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatPaginator,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    CdkDropListGroup,
    MatProgressSpinner,
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

  public searchTerm: string = '';

  public priorityColors: { [key: string]: string } = {
    'Critical': '#DB4242', // Красный
    'Major': '#EBA134', // Оранжевый
    'Normal': '#dbd765', // Жёлтый
    'Minor': '#45a85b', // Зелёный
  };

  toppings = new FormControl('');
  public projectsList: IProjectResponse[] = [];
  public projectIds: string[] = [];


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

  constructor() {
    this.projectDataSource.getProjects().subscribe({
      next: projects => {
        this.projectsList = projects.items
        //this.projectIds.push(projects.items[0].id)
        this.load()
      }
    })
    this.toppings.valueChanges.subscribe((selectedIds) => {
      if (selectedIds == null) return;
      this.projectIds = [...selectedIds]
      this.load()
    });
    effect(() => {
      //this.issueDataSource._projectId.set(this.projectId());
      //this.load()
    });
  }

  public search() {
    //this.load()
    console.log(this.toppings.value)
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

  public load(): void {
    if (this.projectIds.length == 0) return;
    this.issueDataSource.getIssues(this.projectIds, this._pageRequest(), this._sortRequest(), this._filterRequest()).subscribe({
      next: (issues) => {
        // this.issues.set(issues.items.filter((issue) => issue.name.includes(this.searchTerm.toLowerCase())))
        // console.log(issues);
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

  public updateIssue(issueId: string): void {
    const dialogRef = this._matDialogRef.open(UpdateIssueDialogComponent)

    dialogRef.afterClosed().subscribe((request: IIssueUpdateRequest) => {
      if (!request) return;

      this.issueDataSource.updateIssue(issueId, request).subscribe({
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
