import {Component, effect, inject, Input, input, OnInit, signal} from '@angular/core';
import {IssueDataSource} from '../../data-sources/issue.data-source';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-issues',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatIcon,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.scss'
})
export class IssuesComponent implements OnInit {

  public dataSource = new IssueDataSource();

  public readonly projectId = input.required<string>();

  constructor() {
    effect(() => {
      this.dataSource._projectId.set(this.projectId());
    });
  }

  ngOnInit(): void {
    this.dataSource._projectId.set(this.projectId());
  }
}
