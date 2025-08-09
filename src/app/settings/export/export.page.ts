import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonNote,
} from '@ionic/angular/standalone';
import { LogDatabaseService } from 'src/app/logdatabase.service';
import { rfc3339 } from 'src/app/rfc3339';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonNote,
    CommonModule,
    FormsModule,
  ]
})
export class ExportPage implements OnInit {
  private logDatabaseService: LogDatabaseService = inject(LogDatabaseService);
  private alertCtrl = inject(AlertController);

  constructor() { }

  ngOnInit() {
  }

  download(filename: string, mimetype: string, data: string) {
    const blob = new Blob([data], { type: mimetype });

    let a = document.createElement('a');
    a.download = filename;
    a.href = URL.createObjectURL(blob);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {URL.revokeObjectURL(a.href);}, 10 * 1000);
  }

  async doExport() {
    const logData = (await this.logDatabaseService.getAllEntries())();
    if (logData === undefined) {
      const a = await this.alertCtrl.create({
        header: "Log Data Still Loading",
        message: "Please wait until the log database has finished loading before trying to export your log data.",
        buttons: ["OK"],
      });
      await a.present();
      return;
    }
    var csvData = '';
    for (const entry of logData) {
      csvData += `${rfc3339(entry.date)},${entry.lat},${entry.lon},${entry.country},${entry.level1}\n`
    }
    const now = new Date();
    const filename = `LocationLogger-export-${now.getFullYear()}-${now.getMonth()}-${now.getDay()}.csv`;
    this.download(filename, "text/csv", csvData);
  }
}
