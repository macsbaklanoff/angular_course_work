import {Component, effect, inject, Input, input, OnInit, signal} from '@angular/core';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, NgStyle} from '@angular/common';
import {CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {IIssue} from '../../interfaces/issue.interface';
import {MatMenu, MatMenuItem, MatMenuPanel, MatMenuTrigger} from '@angular/material/menu';
import {CreateProjectDialogComponent} from '../dialogs/project-dialogs/create-project-dialog/create-project-dialog.component';
import {IProjectRequest} from '../../interfaces/project-request.interface';
import {MatDialog} from '@angular/material/dialog';
import {ProjectService} from '../../services/project.service';
import {IssueService} from '../../services/issue.service';
import {IIssueRequest} from '../../interfaces/issue-request.interface';
import {UpdateIssueDialogComponent} from '../dialogs/issue-dialogs/update-issue-dialog/update-issue-dialog.component';
import {IUpdateIssueRequest} from '../../interfaces/update-issue-request.interface';
import {DeleteIssueDialogComponent} from '../dialogs/issue-dialogs/delete-issue-dialog/delete-issue-dialog.component';
import {DeleteAllIssuesDialogComponent} from '../dialogs/issue-dialogs/delete-all-issues-dialog/delete-all-issues-dialog.component';

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
    MatMenuItem
  ],
  templateUrl: './issues.component.html',
  styleUrl: 'issues.component.scss'
})
export class IssuesComponent implements OnInit {

  private readonly _matDialogRef = inject(MatDialog);

  private _issueService = inject(IssueService);

  public dataSource = new IssueDataSource();

  public readonly projectId = input.required<string>();

  public issues: IIssue[] = [];

  public priorityColors: {[key: number]: string} = {
    0: '#DB4242', // Красный
    1: '#EBA134', // Оранжевый
    2: '#dbd765', // Жёлтый
    3: '#45a85b', // Зелёный
  };

  constructor() {
    effect(() => {
      this.dataSource.$data.subscribe((data) => {
        this.issues = [...data];
      })
      this.dataSource._projectId.set(this.projectId());

    });
  }

  drop(event: CdkDragDrop<IIssue[]>) {
    moveItemInArray(this.issues, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.dataSource._projectId.set(this.projectId());
  }

  public createIssue(): void {
    const dialogRef = this._matDialogRef.open(CreateProjectDialogComponent)

    dialogRef.afterClosed().subscribe((request: IIssueRequest) => {
      if (!request) return;

      this._issueService.createIssue(request, this.projectId()).subscribe({
        next: () => this.dataSource.refresh()
      })

      console.log('The dialog was closed');
    });
  }
  public updateIssue(issueId: string): void {
    const dialogRef = this._matDialogRef.open(UpdateIssueDialogComponent)

    dialogRef.afterClosed().subscribe((request: IUpdateIssueRequest) => {
      if (!request) return;

      this._issueService.updateIssue(request, this.projectId(), issueId).subscribe({
        next: () => this.dataSource.refresh()
      })
      console.log('The dialog was closed');
    });
  }
  public deleteIssue(issueId: string): void {
    const dialogRef = this._matDialogRef.open(DeleteIssueDialogComponent)

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this._issueService.deleteIssue(this.projectId(), issueId).subscribe({
        next: () => this.dataSource.refresh()
      })
      console.log('The dialog was closed');
    });
  }

  deleteAllIssues() {
    const dialogRef = this._matDialogRef.open(DeleteAllIssuesDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this._issueService.deleteAllIssues(this.projectId()).subscribe({
        next: () => this.dataSource.refresh()
      })
      console.log('The dialog was closed');
    });
  }
}
