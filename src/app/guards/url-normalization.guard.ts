import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UrlNormalizationGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Skip normalization on server-side
    }

    const url = state.url;
    const normalizedUrl = this.normalizeUrl(url);

    // If URL needs normalization, redirect to normalized version
    if (url !== normalizedUrl) {
      this.router.navigateByUrl(normalizedUrl);
      return false;
    }

    return true;
  }

  /**
   * Normalize URL to ensure consistent structure
   */
  private normalizeUrl(url: string): string {
    // Remove trailing slash except for root
    if (url !== '/' && url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // Ensure lowercase
    url = url.toLowerCase();

    // Remove hash fragments (shouldn't be present in Angular routes, but just in case)
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      url = url.substring(0, hashIndex);
    }

    // Handle query parameters normalization if needed
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      const basePath = url.substring(0, queryIndex);
      const queryString = url.substring(queryIndex + 1);

      // Sort query parameters for consistency
      const params = new URLSearchParams(queryString);
      const sortedParams = new URLSearchParams();
      Array.from(params.keys()).sort().forEach(key => {
        sortedParams.append(key, params.get(key) || '');
      });

      const sortedQuery = sortedParams.toString();
      url = sortedQuery ? `${basePath}?${sortedQuery}` : basePath;
    }

    return url;
  }
}