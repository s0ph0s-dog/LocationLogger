import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonInput,
  IonButtons,
  IonButton,
  IonDatetimeButton,
  IonDatetime,
  IonModal,
  IonLabel,
  IonSelect,
  IonSelectOption,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { LogDatabaseService } from '../logdatabase.service';

@Component({
  selector: 'app-add-log-entry',
  templateUrl: './add-log-entry.component.html',
  styleUrls: ['./add-log-entry.component.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonList,
    IonItem,
    IonInput,
    IonDatetimeButton,
    IonDatetime,
    IonModal,
    IonLabel,
    IonSelect,
    IonSelectOption,
  ],
})
export class AddLogEntryComponent implements OnInit {

  @ViewChild('latitudeInput') latitudeInput!: IonInput;
  @ViewChild('longitudeInput') longitudeInput!: IonInput;
  @ViewChild('dateInput') dateInput!: IonDatetime;
  @ViewChild('countryInput') countryInput!: IonSelect;

  presentingElement!: HTMLElement | null;
  logDatabaseService: LogDatabaseService = inject(LogDatabaseService);

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
    const now = new Date();
    //this.dateInput.value = now.toISOString();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  add() {
    const date = Array.isArray(this.dateInput.value)
      ? this.dateInput.value[0]
      : this.dateInput.value;
    if (!date) {
      console.log("bad date:", date)
      return this.modalCtrl.dismiss(null, 'confirm');
    }
    this.logDatabaseService.addEntry(
      new Date(date),
      Number(this.latitudeInput.value),
      Number(this.longitudeInput.value),
      this.countryInput.value
    );
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  async showGeolocationError(err: GeolocationPositionError) {
    let alertSettings = {
      header: "",
      message: "",
      buttons: ["OK"],
    };
    switch (err.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        alertSettings.header = "Location Access Denied";
        alertSettings.message = "If you choose to grant location access, your coordinates and country can be determined automatically.  Go to your device's settings to grant permission.";
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        alertSettings.header = "Location Unavailable";
        alertSettings.message = "Your geographic location could not be determined. Consider moving closer to a window or to an area with a clear view of the sky so that your device can communicate with cell towers and GPS satellites.";
        break;
      default:
        alertSettings.header = "Unknown Location Error";
        alertSettings.message = "Something went wrong while trying to find your location. Please try again!";
    }
    const alert = await this.alertCtrl.create(alertSettings)
    await alert.present();
  }

  updateFormWithLocation(pos: GeolocationPosition) {
    console.log(pos.coords.latitude, pos.coords.longitude);
    this.latitudeInput.value = pos.coords.latitude;
    this.longitudeInput.value = pos.coords.longitude;
  }

  async doGeolocation(this: AddLogEntryComponent) {
    const options = {
      maximumAge: 1000 * 60 * 5,
    };
    navigator.geolocation.getCurrentPosition(
      (pos) => this.updateFormWithLocation(pos),
      (err) => this.showGeolocationError(err),
      options,
    );
  }

}
