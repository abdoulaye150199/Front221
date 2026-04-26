import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard-module').then(m => m.DashboardModule),
      },
      {
        path: 'ressources',
        loadChildren: () => import('./features/ressources/ressources-module').then(m => m.RessourcesModule),
      },
      {
        path: 'cours',
        loadChildren: () => import('./features/cours/cours-module').then(m => m.CoursModule),
      },
      {
        path: 'referentiel',
        loadChildren: () => import('./features/referentiel/referentiel-module').then(m => m.ReferentielModule),
      },
      {
        path: 'professeurs',
        loadChildren: () => import('./features/professeurs/professeurs-module').then(m => m.ProfesseursModule),
      },
      {
        path: 'planning',
        loadChildren: () => import('./features/planning/planning-module').then(m => m.PlanningModule),
      },
      {
        path: 'inscriptions',
        loadChildren: () => import('./features/inscriptions/inscriptions-module').then(m => m.InscriptionsModule),
      },
      {
        path: 'paiement',
        loadChildren: () => import('./features/paiement/paiement-module').then(m => m.PaiementModule),
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];
