import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { getAnalytics, provideAnalytics, ScreenTrackingService } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { appInitializer } from './app/app-initializer';
import { routes } from './app/app-routing';
import { AppComponent } from './app/app.component';
import { firebaseConfig } from './config/firebase';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
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
}).catch((err) => console.error(err));
