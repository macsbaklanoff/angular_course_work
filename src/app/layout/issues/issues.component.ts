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
}
