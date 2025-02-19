import { Routes } from "@angular/router";
import { ProjectsComponent } from "./components/projects/projects.component";
import { HomeComponent } from "./components/home/home.component";

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Default route
    { path: 'project', component: ProjectsComponent }, // New /project route
];