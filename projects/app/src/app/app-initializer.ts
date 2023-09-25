import {
  APP_INITIALIZER,
  EnvironmentInjector,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  runInInjectionContext,
} from '@angular/core';

export function provideAppInitializer(fn: () => unknown): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const envInjector = inject(EnvironmentInjector);
        return async () => {
          await runInInjectionContext(envInjector, fn);
        };
      },
    },
  ]);
}
