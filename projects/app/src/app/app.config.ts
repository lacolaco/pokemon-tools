import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { ScreenTrackingService, getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { TraceService, createErrorHandler } from '@sentry/angular-ivy';
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
    TraceService,
    {
      provide: ErrorHandler,
      useValue: createErrorHandler(),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
    },
  ],
};
