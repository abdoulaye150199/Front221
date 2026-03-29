import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Gestion Ressources',
      icon: 'folder_open',
      route: '/ressources',
    },
    {
      label: 'Gestion Cours',
      icon: 'school',
      route: '/cours',
    },
    {
      label: 'Gestion Référentiel',
      icon: 'library_books',
      route: '/referentiel',
    },
    {
      label: 'Professeurs',
      icon: 'people',
      route: '/professeurs',
    },
    {
      label: 'Planning',
      icon: 'calendar_today',
      route: '/planning',
    },
    {
      label: 'Inscriptions',
      icon: 'assignment',
      route: '/inscriptions',
    },
    {
      label: 'Paiement',
      icon: 'payment',
      route: '/paiement',
    },
  ];

  academicYear = {
    label: 'Année Académique',
    year: '2024-2025',
  };
}
