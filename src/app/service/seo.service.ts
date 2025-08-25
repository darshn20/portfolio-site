import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface PageMetadata {
  title: string;
  description: string;
  url?: string;
  keywords?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: BreadcrumbListItem[];
}

export interface BreadcrumbListItem {
  '@type': string;
  position: number;
  name: string;
  item: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private baseUrl = 'https://darshanbhuva.vercel.app';
  private siteName = 'Darshan Bhuva';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeRouteListener();
  }

  /**
   * Initialize route listener to automatically update SEO metadata on route changes
   */
  private initializeRouteListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe(route => {
        const routeData = route.snapshot.data;
        const url = this.router.url;

        if (routeData) {
          const normalizedUrl = this.normalizeUrl(`${this.baseUrl}${url}`);

          this.updatePageMetadata({
            title: routeData['title'] || 'Darshan Bhuva | Full-Stack Developer | Angular & .NET Expert | Portfolio',
            description: routeData['description'] || 'Full-Stack Developer Portfolio',
            keywords: routeData['keywords'],
            url: normalizedUrl,
            breadcrumbs: this.generateBreadcrumbs(url)
          });

          // Cleanup any duplicate canonical tags
          this.cleanupCanonicalTags();
        }
      });
  }

  /**
   * Update page metadata with enhanced SEO tags
   */
  updatePageMetadata(metadata: PageMetadata): void {
    // Format title with site name
    const formattedTitle = metadata.title === 'Home'
      ? 'Darshan Bhuva | Full-Stack Developer'
      : `${metadata.title} – ${this.siteName}`;

    // Update title
    this.title.setTitle(formattedTitle);

    // Update meta tags
    this.updateMetaTags({
      title: formattedTitle,
      description: metadata.description,
      url: metadata.url,
      keywords: metadata.keywords
    });

    // Update canonical URL
    if (metadata.url) {
      this.updateCanonicalUrl(metadata.url);
    }

    // Generate and add breadcrumb structured data
    if (metadata.breadcrumbs && metadata.breadcrumbs.length > 0) {
      this.addBreadcrumbStructuredData(metadata.breadcrumbs);
    }
  }

  /**
   * Generate breadcrumbs based on current URL
   */
  generateBreadcrumbs(url: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', url: this.baseUrl }
    ];

    if (url === '' || url === '/') {
      return []; // No breadcrumbs for home page
    }

    const pathSegments = url.split('/').filter(segment => segment);

    pathSegments.forEach((segment, index) => {
      const segmentUrl = `${this.baseUrl}/${pathSegments.slice(0, index + 1).join('/')}`;
      const segmentName = this.getPageNameFromSegment(segment);

      breadcrumbs.push({
        name: segmentName,
        url: segmentUrl
      });
    });

    return breadcrumbs;
  }

  /**
   * Get human-readable page name from URL segment
   */
  private getPageNameFromSegment(segment: string): string {
    const pageNames: { [key: string]: string } = {
      'about': 'About Me',
      'experience': 'Experience',
      'projects': 'Projects',
      'contact': 'Contact',
      'resume': 'Resume'
    };

    return pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  /**
   * Add breadcrumb structured data to page
   */
  addBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]): void {
    // Remove existing breadcrumb structured data
    this.removeStructuredData('BreadcrumbList');

    const breadcrumbSchema: BreadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url
      }))
    };

    this.addStructuredData(breadcrumbSchema);
  }

  /**
   * Update title only
   */
  updateTitle(title: string): void {
    const formattedTitle = title === 'Home'
      ? 'Darshan Bhuva | Full-Stack Developer'
      : `${title} – ${this.siteName}`;
    this.title.setTitle(formattedTitle);
  }

  /**
   * Update meta tags with enhanced social media support
   */
  updateMetaTags(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string;
  }): void {
    if (config.title) {
      this.meta.updateTag({ property: 'og:title', content: config.title });
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
      this.meta.updateTag({ property: 'og:description', content: config.description });
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
      this.meta.updateTag({ name: 'twitter:url', content: config.url });
    }

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Add additional Open Graph tags
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  /**
   * Update canonical URL with proper normalization
   */
  updateCanonicalUrl(url: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip DOM manipulation on server
    }

    // Normalize URL to ensure consistency
    const normalizedUrl = this.normalizeUrl(url);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', normalizedUrl);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', normalizedUrl);
      document.head.appendChild(link);
    }
  }

  /**
   * Normalize URL to ensure consistent structure
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);

      // Remove trailing slash except for root
      if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }

      // Ensure lowercase
      urlObj.pathname = urlObj.pathname.toLowerCase();

      // Remove hash fragments
      urlObj.hash = '';

      // Sort query parameters for consistency (if any)
      const params = new URLSearchParams(urlObj.search);
      const sortedParams = new URLSearchParams();
      Array.from(params.keys()).sort().forEach(key => {
        sortedParams.append(key, params.get(key) || '');
      });
      urlObj.search = sortedParams.toString();

      return urlObj.toString();
    } catch (error) {
      // Fallback for invalid URLs
      console.warn('Invalid URL provided to normalizeUrl:', url);
      return url;
    }
  }

  /**
   * Set canonical URL for current page
   */
  setCanonicalForCurrentPage(): void {
    const currentUrl = `${this.baseUrl}${this.router.url}`;
    this.updateCanonicalUrl(currentUrl);
  }

  /**
   * Remove duplicate canonical tags (cleanup utility)
   */
  cleanupCanonicalTags(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    // Keep only the last canonical tag (most recent)
    for (let i = 0; i < canonicals.length - 1; i++) {
      canonicals[i].remove();
    }
  }

  /**
   * Add structured data to page
   */
  addStructuredData(data: any): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip DOM manipulation on server
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.setAttribute('data-schema-type', data['@type']);
    document.head.appendChild(script);
  }

  /**
   * Remove existing structured data of specific type
   */
  removeStructuredData(schemaType: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip DOM manipulation on server
    }

    const existingScripts = document.querySelectorAll(`script[data-schema-type="${schemaType}"]`);
    existingScripts.forEach(script => script.remove());
  }

  /**
   * Get current page breadcrumbs
   */
  getCurrentBreadcrumbs(): BreadcrumbItem[] {
    const currentUrl = this.router.url;
    return this.generateBreadcrumbs(currentUrl);
  }

  /**
   * Manually update SEO for specific route (useful for dynamic content)
   */
  updateSeoForRoute(route: string, metadata: Partial<PageMetadata>): void {
    const fullUrl = `${this.baseUrl}${route}`;
    const breadcrumbs = this.generateBreadcrumbs(route);

    this.updatePageMetadata({
      title: metadata.title || 'Darshan Bhuva | Full-Stack Developer | Angular & .NET Expert | Portfolio',
      description: metadata.description || 'Full-Stack Developer Portfolio',
      url: fullUrl,
      keywords: metadata.keywords,
      breadcrumbs: breadcrumbs
    });
  }
}
