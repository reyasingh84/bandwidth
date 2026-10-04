import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { BandwidthComponent } from './components/bandwidth/bandwidth.component';
import { authGuard } from './guards/auth-guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: "login", 
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: "",
        component: BandwidthComponent,
        canActivate: [authGuard],
        children: [
            {   path: "dashboard", component: DashboardComponent    },
            {   path: "**", redirectTo: 'dashboard' }
        ]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
