import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { GoogleAnalyticsService } from './service/google-analytics.service';
import { SeoService } from './service/seo.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HomeComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    RouterOutlet, RouterLink, RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.googleAnalyticsService.loadGoogleAnalytics();



    // Set default SEO meta tags
    this.seoService.updateMetaTags({
      title: 'Darshan Bhuva | Full-Stack Developer | Angular & .NET Expert | Portfolio',
      description: 'Experienced Full-Stack Developer specializing in Angular, .NET, TypeScript, and modern web technologies. View my portfolio showcasing scalable web applications, API development, and innovative solutions.',
      url: 'https://darshanbhuva.vercel.app/',
      image: 'https://darshanbhuva.vercel.app/assets/logo.jpg',
      keywords: 'Darshan Bhuva, Full-Stack Developer, Angular Developer, .NET Developer, TypeScript Expert, Web Development, JavaScript, Node.js, Software Engineer, Frontend Developer, Backend Developer, Portfolio'
    });

    // Ensure canonical URL is set for current page
    this.seoService.setCanonicalForCurrentPage();
  }
}
