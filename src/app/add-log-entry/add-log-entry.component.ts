import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { rfc3339 } from '../rfc3339';
import { CountryReverseGeocoderService } from '../country-reverse-geocoder.service';

@Component({
  selector: 'app-add-log-entry',
  templateUrl: './add-log-entry.component.html',
  styleUrls: ['./add-log-entry.component.scss'],
  imports: [
    ReactiveFormsModule,
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

  private formBuilder = inject(FormBuilder);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private crgcs = inject(CountryReverseGeocoderService);
  addLogForm: FormGroup;

  presentingElement!: HTMLElement | null;
  logDatabaseService: LogDatabaseService = inject(LogDatabaseService);

  constructor() {
    const now = new Date();
    this.addLogForm = this.formBuilder.group({
      date: [rfc3339(now), Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      country: [null, Validators.required],
    });
  }

  ngOnInit() {
    //this.dateInput.value = now.toISOString();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  add() {
    const formValues = this.addLogForm.value;
    const date = formValues.date;
    this.logDatabaseService.addEntry(
      new Date(date),
      Number(formValues.latitude),
      Number(formValues.longitude),
      formValues.country,
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
    const countryGuess = this.crgcs.getCountry(pos.coords.latitude, pos.coords.longitude);
    if (countryGuess) {
      this.addLogForm.patchValue({
        country: countryGuess.name,
      })
    }
    this.addLogForm.patchValue({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
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
