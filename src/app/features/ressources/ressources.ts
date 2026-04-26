import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { AcademicYearsComponent } from './components/academic-years.component';
import { TrackedEventsComponent } from './components/tracked-events.component';
import { GeneralCalendarComponent } from './components/general-calendar.component';
import { SpecialityCatalogComponent } from './components/speciality-catalog.component';

interface ResourceTab {
  title: string;
  subtitle?: string;
  icon: string;
}

const mainTabs: ResourceTab[] = [
  { title: 'Année', subtitle: 'Décembre 2020', icon: 'event' },
  { title: 'Domaines & Spécialités', icon: 'folder' },
  { title: 'Classes & Sous-classes', icon: 'folder' },
  { title: 'UE & Modules', icon: 'folder' },
  { title: 'Paramètre', icon: 'settings' },
];

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS, AcademicYearsComponent, TrackedEventsComponent, GeneralCalendarComponent, SpecialityCatalogComponent],
  templateUrl: './ressources.html',
  styleUrls: ['./ressources.scss'],
})
export class RessourcesComponent {
  readonly mainTabs = mainTabs;
  activeMainTab = 0;
  activeSubTab = 0;

  setActiveMainTab(index: number): void {
    this.activeMainTab = index;
    this.activeSubTab = 0;
  }

  setActiveSubTab(index: number): void {
    this.activeSubTab = index;
  }
}
