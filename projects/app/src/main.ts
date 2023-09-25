import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular-ivy';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

Sentry.init({
  dsn: 'https://48ce7e8128de640dc25a32324a1e6c5b@o4505734726549504.ingest.sentry.io/4505941302837248',
  environment: isDevMode() ? 'development' : 'production',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  tracesSampleRate: 0.1,
});

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
