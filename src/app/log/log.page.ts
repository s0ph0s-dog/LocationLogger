import { Component, OnInit, Signal, signal, inject, effect } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
  IonButton,
  IonSpinner,
  ModalController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { LogDatabaseService } from '../logdatabase.service';
import { LogRowComponent } from '../log-row/log-row.component';
import { AddLogEntryComponent } from '../add-log-entry/add-log-entry.component';
import { LogEntry } from '../logentry';

@Component({
  selector: 'app-log',
  templateUrl: 'log.page.html',
  styleUrls: ['log.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonText,
    IonButton,
    IonSpinner,
    LogRowComponent,
  ],
})
export class LogPage implements OnInit {
  logDatabaseService: LogDatabaseService = inject(LogDatabaseService);
  logEntries: Signal<LogEntry[]|undefined> = signal(undefined)
  presentingElement: HTMLElement | null = null;

  constructor(private modalCtrl: ModalController) {
    effect(() => {
      console.log("logEntries is:", this.logEntries);
    })
    addIcons({ add });
    this.logDatabaseService.getAllEntries()
    .then((allEntries) => {
      this.logEntries = allEntries;
    });
  }

  ngOnInit(): void {
    this.presentingElement = document.querySelector("app-tabs.ion-page");
    const urlhash = window.location.hash.slice(1);
    window.location.hash = "";
    if (urlhash === "add") {
      this.openNewLogModal(false)
    }
  }

  async openNewLogModal(animated: boolean) {
    const modal = await this.modalCtrl.create({
      component: AddLogEntryComponent,
      presentingElement: this.presentingElement ?? undefined,
      animated: animated
    });
    modal.present();
  }
}
