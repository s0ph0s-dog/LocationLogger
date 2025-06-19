import { Component, OnInit, inject } from '@angular/core';
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
  ModalController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { LogDatabaseService } from '../logdatabase.service';
import { LogRowComponent } from '../log-row/log-row.component';
import { AddLogEntryComponent } from '../add-log-entry/add-log-entry.component';

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
    LogRowComponent,
  ],
})
export class LogPage implements OnInit {
  logDatabaseService: LogDatabaseService = inject(LogDatabaseService);
  readonly logEntries = this.logDatabaseService.getAllEntries();
  presentingElement: HTMLElement | null = null;

  constructor(private modalCtrl: ModalController) {
    addIcons({ add });
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
