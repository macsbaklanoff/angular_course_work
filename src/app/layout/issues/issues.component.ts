import {Component, effect, inject, Input, input, OnInit, signal} from '@angular/core';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, NgStyle} from '@angular/common';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
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
    MatOption
  ],
  templateUrl: './issues.component.html',
  styleUrl: 'issues.component.scss'
})
export class IssuesComponent implements OnInit {

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
    sortDir: 'desc',
  });

  private readonly _filterRequest = signal<IIssueFilterRequest>({});

  public readonly issues = signal<IIssueResponse[]>([]);

  public searchTerm: string = '';

  public priorityColors: {[key: string]: string} = {
    'Critical': '#DB4242', // Красный
    'Major': '#EBA134', // Оранжевый
    'Normal': '#dbd765', // Жёлтый
    'Minor' : '#45a85b', // Зелёный
  };

  toppings = new FormControl('');
  public projectsList: IProjectResponse[] = [];
  private projectIds: string[] = [];

  constructor() {
    this.projectDataSource.getProjects().subscribe({
      next: projects => {
        this.projectsList = projects.items
        this.projectIds.push(projects.items[0].id)
      }
    })
    this.toppings.valueChanges.subscribe((selectedIds) => {
        if (selectedIds == null) return;
        this.projectIds = [...selectedIds]
        this.load()
    });
     effect(() => {
       this.issueDataSource._projectId.set(this.projectId());
       this.load()
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

  drop(event: CdkDragDrop<IIssueResponse[]>) {
    moveItemInArray(this.issues(), event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.load();
    this.issueDataSource._projectId.set(this.projectId());
  }

  public load() : void {
    this.issueDataSource.getIssues(this.projectIds, this._pageRequest(), this._sortRequest(), this._filterRequest()).subscribe({
      next: (issues) => {
        this.issues.set(issues.items.filter((issue) => issue.name.includes(this.searchTerm.toLowerCase())))
      },
      error: () => console.log('error')
    })
  }

  public createIssue(): void {
    const dialogRef = this._matDialogRef.open(CreateIssueDialogComponent)

    dialogRef.afterClosed().subscribe((request: IIssueCreate) => {
      if (!request) return;
      this.issueDataSource.createIssue(this.projectId(), request).subscribe({
        next: (issue) => {this.load()}
      });
    });
  }
  public updateIssue(issueId: string): void {
    const dialogRef = this._matDialogRef.open(UpdateIssueDialogComponent)

    dialogRef.afterClosed().subscribe((request: IIssueUpdateRequest) => {
      if (!request) return;

      this.issueDataSource.updateIssue(this.projectId(), issueId, request).subscribe({
        next: () => {this.load()}
      })
    });
  }
  public deleteIssue(issueId: string): void {
    const dialogRef = this._matDialogRef.open(DeleteIssueDialogComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.issueDataSource.deleteIssue(this.projectId(), issueId).subscribe({
        next: () => {this.load()}
      })
    });
  }
}
