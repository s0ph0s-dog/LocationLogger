import { Component, OnInit, input } from '@angular/core';
import { LogEntry } from '../logentry';
import { IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-log-row',
  templateUrl: './log-row.component.html',
  styleUrls: ['./log-row.component.scss'],
  imports: [IonItem, IonLabel, IonNote],
})
export class LogRowComponent  implements OnInit {
  logEntry = input.required<LogEntry>();

  constructor() { }

  ngOnInit() {}

}
