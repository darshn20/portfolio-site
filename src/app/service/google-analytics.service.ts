import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private isScriptLoaded = false;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  loadGoogleAnalytics(): void {
    if (this.isScriptLoaded || !environment.production || !environment.googleAnalyticsId) {
      return;
    }

    const existingScript = this.document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}"]`);
    if (existingScript) {
      this.isScriptLoaded = true;
      return;
    }

    this.isScriptLoaded = true;

    const gaScript = this.document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}`;

    const head = this.document.head;
    if (head.firstChild) {
      head.insertBefore(gaScript, head.firstChild);
    } else {
      head.appendChild(gaScript);
    }

    const inlineScript = this.document.createElement('script');
    inlineScript.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${environment.googleAnalyticsId}');
    `;

    if (gaScript.nextSibling) {
      head.insertBefore(inlineScript, gaScript.nextSibling);
    } else {
      head.appendChild(inlineScript);
    }
  }
}
