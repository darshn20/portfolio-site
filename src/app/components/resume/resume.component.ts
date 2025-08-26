import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleAnalyticsService } from '../../service/google-analytics.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resume.component.html',
})
export class ResumeComponent {

  constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

  trackResumeDownload(): void {
    this.googleAnalyticsService.trackResumeDownload();
  }
}
