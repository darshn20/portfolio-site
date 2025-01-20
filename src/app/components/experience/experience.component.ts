import { Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.component.html'
})
export class ExperienceComponent {
  skills = [
    'Angular', '.Net', 'C#', 'HTML', 'CSS', 'JavaScript', 'Typescript', 'python', 'SQL', 'Git', 'Entity Framework',
    'ASP.NET MVC', 'ASP.NET CORE', 'REST API', 'IIS server', 'CI/CD pipeline', 'Firebase'
  ];
}

