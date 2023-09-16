import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { ScreenTrackingService, getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { firebaseConfig } from '../config/firebase';
import { appInitializer } from './app-initializer';
import { routes } from './app-routing';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(firebaseConfig))),
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    ScreenTrackingService,
    importProvidersFrom(providePerformance(() => getPerformance())),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
    },
  ],
};
