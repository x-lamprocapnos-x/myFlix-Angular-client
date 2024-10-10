/**
 * This is the entry point of the Angular application. It bootstraps the AppModule
 * and sets up event coalescing to optimize Angular’s change detection mechanism.
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
