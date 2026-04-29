import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { AcademicYearsComponent } from './components/academic-years/academic-years.component';
import { TrackedEventsComponent } from './components/tracked-events/tracked-events.component';
import { GeneralCalendarComponent } from './components/general-calendar/general-calendar.component';
import { SpecialityCatalogComponent } from './components/speciality-catalog/speciality-catalog.component';
import { ClassStructureComponent } from './components/class-structure/class-structure.component';
import { UeModuleComponent } from './components/ue-module/ue-module.component';

interface ResourceTab {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const mainTabs: ResourceTab[] = [
  {
    title: 'Années académiques',
    subtitle: 'Calendrier et cycles',
    description: 'Pilotez les années scolaires, les événements structurants et le calendrier général.',
    icon: 'calendar_month'
  },
  {
    title: 'Domaines & spécialités',
    subtitle: 'Catalogue pédagogique',
    description: 'Organisez l’offre de formation, les mentions, cycles, niveaux et semestres.',
    icon: 'account_tree'
  },
  {
    title: 'Classes & sous-classes',
    subtitle: 'Organisation des cohortes',
    description: 'Préparez la structuration des promotions, groupes et sous-ensembles académiques.',
    icon: 'groups_2'
  },
  {
    title: 'UE & modules',
    subtitle: 'Maquettes d’enseignement',
    description: 'Centralisez les unités d’enseignement et la construction des modules par niveau.',
    icon: 'library_books'
  },
  {
    title: 'Paramètres',
    subtitle: 'Configuration métier',
    description: 'Réglez les préférences globales qui alimentent l’ensemble du référentiel ressources.',
    icon: 'tune'
  },
];

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [
    ...FORM_ACTION_IMPORTS,
    AcademicYearsComponent,
    TrackedEventsComponent,
    GeneralCalendarComponent,
    SpecialityCatalogComponent,
    ClassStructureComponent,
    UeModuleComponent,
  ],
  templateUrl: './ressources.html',
  styleUrls: ['./ressources.scss'],
})
export class RessourcesComponent {
  readonly mainTabs = mainTabs;
  activeMainTab = 0;
  activeSubTab = 0;
  academicYearSearchTerm = '';

  get currentMainTabTitle(): string {
    return this.mainTabs[this.activeMainTab]?.title ?? '';
  }

  get isAcademicMainTab(): boolean {
    return this.currentMainTabTitle === 'Années académiques';
  }

  get isSpecialityMainTab(): boolean {
    return this.currentMainTabTitle === 'Domaines & spécialités';
  }

  get isClassStructureMainTab(): boolean {
    return this.currentMainTabTitle === 'Classes & sous-classes';
  }

  get isUeModuleMainTab(): boolean {
    return this.currentMainTabTitle === 'UE & modules';
  }

  get isPlaceholderMainTab(): boolean {
    return !this.isAcademicMainTab
      && !this.isSpecialityMainTab
      && !this.isClassStructureMainTab
      && !this.isUeModuleMainTab;
  }

  setActiveMainTab(index: number): void {
    this.activeMainTab = index;
    this.activeSubTab = 0;
    this.academicYearSearchTerm = '';
  }

  setActiveSubTab(index: number): void {
    this.activeSubTab = index;
  }
}
