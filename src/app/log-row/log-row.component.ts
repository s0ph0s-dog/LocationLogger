import { Component, OnInit, input, inject } from '@angular/core';
import { LogEntry } from '../logentry';
import {
  IonItem,
  IonLabel,
  IonNote,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { LogDatabaseService } from '../logdatabase.service';

@Component({
  selector: 'app-log-row',
  templateUrl: './log-row.component.html',
  styleUrls: ['./log-row.component.scss'],
  imports: [
    IonItem,
    IonLabel,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonItemSliding,
    IonIcon,
  ],
})
export class LogRowComponent  implements OnInit {
  logDatabaseService = inject(LogDatabaseService);
  logEntry = input.required<LogEntry>();

  constructor() {
    addIcons({trash});
  }

  ngOnInit() {}

  async delete() {
    await this.logDatabaseService.deleteEntry(this.logEntry().id)
  }

}
