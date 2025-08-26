import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent as ProjectsContentComponent } from '../../components/projects/projects.component';

import { SeoService } from '../../service/seo.service';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, ProjectsContentComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Projects – Darshan Bhuva',
      description: 'Explore Darshan Bhuva\'s portfolio of innovative web applications and software projects. View detailed case studies of Angular, .NET, and full-stack development work.',
      url: 'https://darshanbhuva.vercel.app/projects',
      keywords: 'Darshan Bhuva Projects, Full-Stack Developer Portfolio, Angular Projects, .NET Applications, Web Development Portfolio, Software Development Projects'
    });
  }
}
