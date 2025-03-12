import {Component, effect, inject, Input, input, OnInit, signal} from '@angular/core';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
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
import {IIssueRequest} from '../../interfaces/requests/issue/update-issue-request.interface';
import {IIssueCreate} from '../../interfaces/requests/issue/issue-create-request.interface';
import {CreateIssueDialogComponent} from '../dialogs/issue-dialogs/create-issue-dialog/create-issue-dialog.component';

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

  public issues = signal<IIssueResponse[]>([]);

  public priorityColors: {[key: number]: string} = {
    0: '#DB4242', // Красный
    1: '#EBA134', // Оранжевый
    2: '#dbd765', // Жёлтый
    3: '#45a85b', // Зелёный
  };

  constructor() {
     effect(() => {
       this.issues.set(this.dataSource.data());
       this.dataSource._projectId.set(this.projectId());
    });
  }

  drop(event: CdkDragDrop<IIssueResponse[]>) {
    moveItemInArray(this.issues(), event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this.dataSource._projectId.set(this.projectId());
  }

  public createIssue(): void {
    const dialogRef = this._matDialogRef.open(CreateIssueDialogComponent)

    dialogRef.afterClosed().subscribe((request: IIssueCreate) => {
      if (!request) return;
      this.dataSource.createIssue(request).subscribe({
        next: () => {this.dataSource.data()}
      });
    });
  }
  // }
  // public updateIssue(issueId: string): void {
  //   const dialogRef = this._matDialogRef.open(UpdateIssueDialogComponent)
  //
  //   dialogRef.afterClosed().subscribe((request: IUpdateIssueRequest) => {
  //     if (!request) return;
  //
  //     this._issueService.updateIssue(request, this.projectId(), issueId).subscribe({
  //       next: () => this.dataSource.refresh()
  //     })
  //     console.log('The dialog was closed');
  //   });
  // }
  // public deleteIssue(issueId: string): void {
  //   const dialogRef = this._matDialogRef.open(DeleteIssueDialogComponent)
  //
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (!result) return;
  //     this._issueService.deleteIssue(this.projectId(), issueId).subscribe({
  //       next: () => this.dataSource.refresh()
  //     })
  //     console.log('The dialog was closed');
  //   });
  // }
  //
  // deleteAllIssues() {
  //   const dialogRef = this._matDialogRef.open(DeleteAllIssuesDialogComponent);
  //
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (!result) return;
  //     this._issueService.deleteAllIssues(this.projectId()).subscribe({
  //       next: () => this.dataSource.refresh()
  //     })
  //     console.log('The dialog was closed');
  //   });
  // }
}
