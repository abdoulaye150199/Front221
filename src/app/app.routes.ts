import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'ressources',
        loadComponent: () => import('./features/ressources/ressources').then((m) => m.RessourcesComponent),
      },
      {
        path: 'cours',
        loadComponent: () => import('./features/cours/cours').then((m) => m.CoursComponent),
      },
      {
        path: 'referentiel',
        loadComponent: () => import('./features/referentiel/referentiel').then((m) => m.ReferentielComponent),
      },
      {
        path: 'professeurs',
        loadComponent: () => import('./features/professeurs/professeurs').then((m) => m.ProfesseursComponent),
      },
      {
        path: 'planning',
        loadComponent: () => import('./features/planning/planning.component').then((m) => m.PlanningComponent),
      },
      {
        path: 'inscriptions',
        loadComponent: () => import('./features/inscriptions/inscriptions').then((m) => m.InscriptionsComponent),
      },
      {
        path: 'paiement',
        loadComponent: () => import('./features/paiement/paiement').then((m) => m.PaiementComponent),
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'auth', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];
