import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject } from '@vercel/analytics';

inject();
injectSpeedInsights();
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
