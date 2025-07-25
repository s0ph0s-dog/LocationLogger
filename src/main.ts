import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, isPlatform, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

const getConfig = () => {
  let config = {};

  if (isPlatform("desktop")) {
    config = {
      ...config,
      mode: "ios",
    }
  }

  return config;
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(getConfig()),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
