import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { BandwidthComponent } from './components/bandwidth/bandwidth.component';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TeamsComponent } from './components/teams/teams.component';
import { roleGuard } from './guards/role-guard';
import { TasksComponent } from './components/tasks/tasks.component';
import { MembersComponent } from './components/members/members.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: BandwidthComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard(['admin', 'director', 'manager', 'employee'])] },
      { path: 'teams', component: TeamsComponent , canActivate: [roleGuard(['admin', 'director'])]},
      { path: 'all-tasks', component:TasksComponent, canActivate: [roleGuard(['admin', 'director'])]},
      { path: 'members' , component:MembersComponent, canActivate: [roleGuard(['admin', 'director', 'manager'])] },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
