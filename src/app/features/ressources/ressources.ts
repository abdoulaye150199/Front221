import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  semester: string;
  students: number;
  courses: number;
  status: 'En cours' | 'Terminé';
}

interface ResourceTab {
  title: string;
  subtitle?: string;
  icon: string;
}

interface TrackedEvent {
  id: string;
  level: string;
  semester: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'À venir' | 'Terminé';
}

interface EventFormModel {
  level: string;
  semester: string;
  name: string;
}

interface GeneralCalendarEntry {
  id: string;
  level: string;
  semester: string;
  eventName: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'En attente' | 'Terminé';
}

interface GeneralCalendarFilterModel {
  level: string;
  semester: string;
  eventName: string;
}

type SpecialitySectionKey =
  | 'Domaines'
  | 'Mention'
  | 'Spécialité'
  | 'Cycle'
  | 'Niveau'
  | 'Semestres';

interface SpecialityCatalogItem {
  id: string;
  category: SpecialitySectionKey;
  name: string;
  domainName?: string;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-ressources',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './ressources.html',
  styleUrl: './ressources.scss',
})
export class RessourcesComponent {
  mainTabs: ResourceTab[] = [
    { title: 'Année', subtitle: 'Décembre 2020', icon: 'event' },
    { title: 'Domaines & Spécialités', icon: 'folder' },
    { title: 'Classes & Sous-classes', icon: 'folder' },
    { title: 'UE & Modules', icon: 'folder' },
    { title: 'Paramètre', icon: 'settings' },
  ];
  subTabs = ['Année Scolaire', 'Suivi des événements', 'Calendrier Général'];
  specialityTabs: SpecialitySectionKey[] = [
    'Domaines',
    'Mention',
    'Spécialité',
    'Cycle',
    'Niveau',
    'Semestres',
  ];
  activeMainTab = 0;
  activeSubTab = 0;
  activeSpecialityTab = 0;
  openActionId: string | null = null;
  openTrackedEventActionId: string | null = null;
  openCalendarActionId: string | null = null;
  openSpecialityActionId: string | null = null;
  searchTerm = '';
  page = 1;
  pageSize = 4;
  eventPage = 1;
  eventPageSize = 5;
  calendarPage = 1;
  calendarPageSize = 5;
  specialityPage = 1;
  specialityPageSize = 5;
  nextTrackedEventId = 6;
  editingTrackedEventId: string | null = null;
  editingCalendarEntryId: string | null = null;
  editingSpecialityItemId: string | null = null;
  nextSpecialityItemId = 19;

  readonly levelOptions: string[] = ['Licence', 'Master 1', 'Master 2'];
  readonly semesterOptions: string[] = ['Semestre 1', 'Semestre 2', 'Session intensive'];
  readonly pageSizeOptions: number[] = [5, 10, 15];

  eventForm: EventFormModel = {
    level: '',
    semester: '',
    name: '',
  };

  calendarFilters: GeneralCalendarFilterModel = {
    level: '',
    semester: '',
    eventName: '',
  };

  appliedCalendarFilters: GeneralCalendarFilterModel = {
    level: '',
    semester: '',
    eventName: '',
  };

  specialityItemName = '';
  specialityDomainName = '';

  academicYears: AcademicYear[] = [
    {
      id: '1',
      year: '2024-2025',
      startDate: '01 Sep 2024',
      endDate: '30 Juin 2025',
      semester: 'Semestre 1',
      students: 1247,
      courses: 156,
      status: 'En cours',
    },
    {
      id: '2',
      year: '2023-2024',
      startDate: '01 Sep 2023',
      endDate: '30 Juin 2024',
      semester: 'Terminé',
      students: 1189,
      courses: 148,
      status: 'Terminé',
    },
    {
      id: '3',
      year: '2022-2023',
      startDate: '01 Sep 2022',
      endDate: '30 Juin 2023',
      semester: 'Terminé',
      students: 1098,
      courses: 142,
      status: 'Terminé',
    },
    {
      id: '4',
      year: '2021-2022',
      startDate: '01 Sep 2021',
      endDate: '30 Juin 2022',
      semester: 'Terminé',
      students: 987,
      courses: 135,
      status: 'Terminé',
    },
  ];

  trackedEvents: TrackedEvent[] = [
    {
      id: '1',
      level: 'Licence',
      semester: 'Semestre 1',
      name: 'Enseignements',
      startDate: '07/10/2024',
      endDate: '10/10/2024',
      status: 'En cours',
    },
    {
      id: '2',
      level: 'Licence',
      semester: 'Semestre 1',
      name: 'Évaluations',
      startDate: '14/10/2024',
      endDate: '18/10/2024',
      status: 'À venir',
    },
    {
      id: '3',
      level: 'Master 1',
      semester: 'Semestre 1',
      name: 'Rentrée pédagogique',
      startDate: '01/10/2024',
      endDate: '03/10/2024',
      status: 'Terminé',
    },
    {
      id: '4',
      level: 'Master 2',
      semester: 'Semestre 2',
      name: 'Soutenances',
      startDate: '05/03/2025',
      endDate: '12/03/2025',
      status: 'À venir',
    },
    {
      id: '5',
      level: 'Licence',
      semester: 'Semestre 2',
      name: 'Examens semestriels',
      startDate: '17/02/2025',
      endDate: '25/02/2025',
      status: 'À venir',
    },
  ];

  generalCalendarEntries: GeneralCalendarEntry[] = [
    {
      id: '1',
      level: 'Licence',
      semester: 'Semestre 1',
      eventName: 'Ouverture des classe',
      startDate: '07/10/2024',
      endDate: '10/10/2024',
      status: 'En cours',
    },
    {
      id: '2',
      level: 'Licence',
      semester: 'Semestre 1',
      eventName: 'Période de devoir surveillé No 1',
      startDate: '18/12/2024',
      endDate: '23/12/2024',
      status: 'En attente',
    },
    {
      id: '3',
      level: 'Licence',
      semester: 'Semestre 1',
      eventName: 'Période de devoir surveillé No 2',
      startDate: '11/01/2025',
      endDate: '15/01/2025',
      status: 'En attente',
    },
    {
      id: '4',
      level: 'Licence',
      semester: 'Semestre 2',
      eventName: 'Reprise des cours',
      startDate: '17/02/2025',
      endDate: '19/02/2025',
      status: 'En attente',
    },
    {
      id: '5',
      level: 'Licence',
      semester: 'Semestre 2',
      eventName: 'Examens blancs',
      startDate: '10/03/2025',
      endDate: '15/03/2025',
      status: 'En attente',
    },
    {
      id: '6',
      level: 'Master 1',
      semester: 'Semestre 1',
      eventName: 'Rentrée pédagogique',
      startDate: '01/10/2024',
      endDate: '03/10/2024',
      status: 'Terminé',
    },
    {
      id: '7',
      level: 'Master 1',
      semester: 'Semestre 1',
      eventName: 'Contrôle continu',
      startDate: '20/11/2024',
      endDate: '25/11/2024',
      status: 'Terminé',
    },
    {
      id: '8',
      level: 'Master 1',
      semester: 'Semestre 2',
      eventName: 'Séminaire de recherche',
      startDate: '08/04/2025',
      endDate: '09/04/2025',
      status: 'En attente',
    },
    {
      id: '9',
      level: 'Master 2',
      semester: 'Semestre 1',
      eventName: 'Lancement mémoire',
      startDate: '14/10/2024',
      endDate: '18/10/2024',
      status: 'En cours',
    },
    {
      id: '10',
      level: 'Master 2',
      semester: 'Semestre 1',
      eventName: 'Atelier méthodologie',
      startDate: '04/12/2024',
      endDate: '06/12/2024',
      status: 'Terminé',
    },
    {
      id: '11',
      level: 'Master 2',
      semester: 'Semestre 2',
      eventName: 'Pré-soutenances',
      startDate: '12/05/2025',
      endDate: '16/05/2025',
      status: 'En attente',
    },
    {
      id: '12',
      level: 'Licence',
      semester: 'Session intensive',
      eventName: 'Session de rattrapage',
      startDate: '02/06/2025',
      endDate: '06/06/2025',
      status: 'En attente',
    },
    {
      id: '13',
      level: 'Master 1',
      semester: 'Session intensive',
      eventName: 'Coaching projet',
      startDate: '09/06/2025',
      endDate: '12/06/2025',
      status: 'En attente',
    },
    {
      id: '14',
      level: 'Master 2',
      semester: 'Session intensive',
      eventName: 'Soutenances finales',
      startDate: '23/06/2025',
      endDate: '27/06/2025',
      status: 'En attente',
    },
    {
      id: '15',
      level: 'Licence',
      semester: 'Semestre 2',
      eventName: 'Délibérations',
      startDate: '30/06/2025',
      endDate: '01/07/2025',
      status: 'En attente',
    },
    {
      id: '16',
      level: 'Master 1',
      semester: 'Semestre 2',
      eventName: 'Remise des notes',
      startDate: '03/07/2025',
      endDate: '04/07/2025',
      status: 'En attente',
    },
    {
      id: '17',
      level: 'Master 2',
      semester: 'Semestre 2',
      eventName: 'Publication résultats',
      startDate: '08/07/2025',
      endDate: '09/07/2025',
      status: 'En attente',
    },
    {
      id: '18',
      level: 'Licence',
      semester: 'Semestre 1',
      eventName: 'Inscription pédagogique',
      startDate: '23/09/2024',
      endDate: '30/09/2024',
      status: 'Terminé',
    },
    {
      id: '19',
      level: 'Master 1',
      semester: 'Semestre 1',
      eventName: 'Journée d’intégration',
      startDate: '26/09/2024',
      endDate: '27/09/2024',
      status: 'Terminé',
    },
    {
      id: '20',
      level: 'Master 2',
      semester: 'Semestre 1',
      eventName: 'Validation sujets',
      startDate: '30/10/2024',
      endDate: '31/10/2024',
      status: 'Terminé',
    },
  ];

  specialityCatalogItems: SpecialityCatalogItem[] = [
    { id: '1', category: 'Domaines', name: 'Sciences et Technologies', status: 'Actif' },
    { id: '2', category: 'Domaines', name: 'Sciences et Technologies', status: 'Actif' },
    { id: '3', category: 'Domaines', name: 'Sciences et Technologies', status: 'Actif' },
    {
      id: '4',
      category: 'Mention',
      name: 'Informatique',
      domainName: 'Sciences et Technologies',
      status: 'Actif',
    },
    {
      id: '5',
      category: 'Mention',
      name: 'Mathématiques appliquées',
      domainName: 'Sciences et Technologies',
      status: 'Actif',
    },
    {
      id: '6',
      category: 'Mention',
      name: 'Réseaux et télécoms',
      domainName: 'Sciences et Technologies',
      status: 'Actif',
    },
    { id: '7', category: 'Spécialité', name: 'Génie logiciel', status: 'Actif' },
    { id: '8', category: 'Spécialité', name: 'Data & IA', status: 'Actif' },
    { id: '9', category: 'Spécialité', name: 'Cybersécurité', status: 'Actif' },
    { id: '10', category: 'Cycle', name: 'Licence', status: 'Actif' },
    { id: '11', category: 'Cycle', name: 'Master', status: 'Actif' },
    { id: '12', category: 'Cycle', name: 'Doctorat', status: 'Actif' },
    { id: '13', category: 'Niveau', name: 'Licence 1', status: 'Actif' },
    { id: '14', category: 'Niveau', name: 'Licence 2', status: 'Actif' },
    { id: '15', category: 'Niveau', name: 'Master 1', status: 'Actif' },
    { id: '16', category: 'Semestres', name: 'Semestre 1', status: 'Actif' },
    { id: '17', category: 'Semestres', name: 'Semestre 2', status: 'Actif' },
    { id: '18', category: 'Semestres', name: 'Session intensive', status: 'Actif' },
  ];

  setActiveMainTab(index: number) {
    this.activeMainTab = index;
    this.activeSubTab = 0;
    if (index === 1) {
      this.activeSpecialityTab = 0;
      this.specialityPage = 1;
    }
  }

  setActiveSubTab(index: number) {
    this.activeSubTab = index;
    if (index === 1) {
      this.eventPage = 1;
    }
    if (index === 2) {
      this.calendarPage = 1;
    }
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.page = 1;
  }

  get filteredAcademicYears(): AcademicYear[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.academicYears;
    return this.academicYears.filter(year =>
      `${year.year} ${year.startDate} ${year.endDate} ${year.semester} ${year.status}`
        .toLowerCase()
        .includes(term)
    );
  }

  get totalResults(): number {
    return this.filteredAcademicYears.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedAcademicYears(): AcademicYear[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAcademicYears.slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    if (this.totalResults === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    if (this.totalResults === 0) return 0;
    return Math.min(this.currentPage * this.pageSize, this.totalResults);
  }

  get canPrev(): boolean {
    return this.currentPage > 1;
  }

  get canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get isEventFormValid(): boolean {
    return (
      this.eventForm.level.trim().length > 0 &&
      this.eventForm.semester.trim().length > 0 &&
      this.eventForm.name.trim().length > 0
    );
  }

  get isEditingTrackedEvent(): boolean {
    return this.editingTrackedEventId !== null;
  }

  get totalTrackedEvents(): number {
    return this.trackedEvents.length;
  }

  get totalTrackedEventPages(): number {
    return Math.max(1, Math.ceil(this.totalTrackedEvents / this.eventPageSize));
  }

  get currentTrackedEventPage(): number {
    return Math.min(this.eventPage, this.totalTrackedEventPages);
  }

  get pagedTrackedEvents(): TrackedEvent[] {
    const start = (this.currentTrackedEventPage - 1) * this.eventPageSize;
    return this.trackedEvents.slice(start, start + this.eventPageSize);
  }

  get trackedEventCanPrev(): boolean {
    return this.currentTrackedEventPage > 1;
  }

  get trackedEventCanNext(): boolean {
    return this.currentTrackedEventPage < this.totalTrackedEventPages;
  }

  get calendarEventOptions(): string[] {
    return [...new Set(this.generalCalendarEntries.map(entry => entry.eventName))];
  }

  get filteredGeneralCalendarEntries(): GeneralCalendarEntry[] {
    return this.generalCalendarEntries.filter(entry => {
      const levelMatch =
        !this.appliedCalendarFilters.level || entry.level === this.appliedCalendarFilters.level;
      const semesterMatch =
        !this.appliedCalendarFilters.semester ||
        entry.semester === this.appliedCalendarFilters.semester;
      const eventMatch =
        !this.appliedCalendarFilters.eventName ||
        entry.eventName === this.appliedCalendarFilters.eventName;

      return levelMatch && semesterMatch && eventMatch;
    });
  }

  get totalGeneralCalendarEntries(): number {
    return this.filteredGeneralCalendarEntries.length;
  }

  get totalGeneralCalendarPages(): number {
    return Math.max(1, Math.ceil(this.totalGeneralCalendarEntries / this.calendarPageSize));
  }

  get currentGeneralCalendarPage(): number {
    return Math.min(this.calendarPage, this.totalGeneralCalendarPages);
  }

  get pagedGeneralCalendarEntries(): GeneralCalendarEntry[] {
    const start = (this.currentGeneralCalendarPage - 1) * this.calendarPageSize;
    return this.filteredGeneralCalendarEntries.slice(start, start + this.calendarPageSize);
  }

  get generalCalendarCanPrev(): boolean {
    return this.currentGeneralCalendarPage > 1;
  }

  get generalCalendarCanNext(): boolean {
    return this.currentGeneralCalendarPage < this.totalGeneralCalendarPages;
  }

  get generalCalendarPages(): number[] {
    return Array.from({ length: this.totalGeneralCalendarPages }, (_, index) => index + 1);
  }

  get currentSpecialityCategory(): SpecialitySectionKey {
    return this.specialityTabs[this.activeSpecialityTab];
  }

  get isMentionSpecialityTab(): boolean {
    return this.currentSpecialityCategory === 'Mention';
  }

  get domainOptions(): string[] {
    return [
      ...new Set(
        this.specialityCatalogItems
          .filter(item => item.category === 'Domaines')
          .map(item => item.name)
      ),
    ];
  }

  get currentSpecialityColumnLabel(): string {
    return this.currentSpecialityCategory;
  }

  get currentSpecialityPlaceholder(): string {
    switch (this.currentSpecialityCategory) {
      case 'Domaines':
        return 'Domaine';
      case 'Mention':
        return 'Mention';
      case 'Spécialité':
        return 'Spécialité';
      case 'Cycle':
        return 'Cycle';
      case 'Niveau':
        return 'Niveau';
      case 'Semestres':
        return 'Semestre';
    }
  }

  get filteredSpecialityCatalogItems(): SpecialityCatalogItem[] {
    return this.specialityCatalogItems.filter(item => item.category === this.currentSpecialityCategory);
  }

  get totalSpecialityItems(): number {
    return this.filteredSpecialityCatalogItems.length;
  }

  get totalSpecialityPages(): number {
    return Math.max(1, Math.ceil(this.totalSpecialityItems / this.specialityPageSize));
  }

  get currentSpecialityPage(): number {
    return Math.min(this.specialityPage, this.totalSpecialityPages);
  }

  get pagedSpecialityCatalogItems(): SpecialityCatalogItem[] {
    const start = (this.currentSpecialityPage - 1) * this.specialityPageSize;
    return this.filteredSpecialityCatalogItems.slice(start, start + this.specialityPageSize);
  }

  get specialityPages(): number[] {
    return Array.from({ length: this.totalSpecialityPages }, (_, index) => index + 1);
  }

  get specialityCanPrev(): boolean {
    return this.currentSpecialityPage > 1;
  }

  get specialityCanNext(): boolean {
    return this.currentSpecialityPage < this.totalSpecialityPages;
  }

  get isSpecialityFormValid(): boolean {
    if (this.isMentionSpecialityTab) {
      return this.specialityDomainName.trim().length > 0 && this.specialityItemName.trim().length > 0;
    }

    return this.specialityItemName.trim().length > 0;
  }

  get isEditingSpecialityItem(): boolean {
    return this.editingSpecialityItemId !== null;
  }

  previousPage() {
    if (this.canPrev) this.page -= 1;
  }

  nextPage() {
    if (this.canNext) this.page += 1;
  }

  previousTrackedEventPage() {
    if (this.trackedEventCanPrev) {
      this.eventPage -= 1;
    }
  }

  nextTrackedEventPage() {
    if (this.trackedEventCanNext) {
      this.eventPage += 1;
    }
  }

  previousGeneralCalendarPage() {
    if (this.generalCalendarCanPrev) {
      this.calendarPage -= 1;
    }
  }

  nextGeneralCalendarPage() {
    if (this.generalCalendarCanNext) {
      this.calendarPage += 1;
    }
  }

  previousSpecialityPage() {
    if (this.specialityCanPrev) {
      this.specialityPage -= 1;
    }
  }

  nextSpecialityPage() {
    if (this.specialityCanNext) {
      this.specialityPage += 1;
    }
  }

  setSpecialityPage(page: number) {
    if (page >= 1 && page <= this.totalSpecialityPages) {
      this.specialityPage = page;
    }
  }

  setGeneralCalendarPage(page: number) {
    if (page >= 1 && page <= this.totalGeneralCalendarPages) {
      this.calendarPage = page;
    }
  }

  setTrackedEventPageSize(value: string) {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && this.pageSizeOptions.includes(pageSize)) {
      this.eventPageSize = pageSize;
      this.eventPage = 1;
    }
  }

  setGeneralCalendarPageSize(value: string) {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && this.pageSizeOptions.includes(pageSize)) {
      this.calendarPageSize = pageSize;
      this.calendarPage = 1;
    }
  }

  setSpecialityPageSize(value: string) {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && this.pageSizeOptions.includes(pageSize)) {
      this.specialityPageSize = pageSize;
      this.specialityPage = 1;
    }
  }

  setActiveSpecialityTab(index: number) {
    this.activeSpecialityTab = index;
    this.specialityPage = 1;
    this.resetSpecialityForm();
    this.openSpecialityActionId = null;
  }

  submitSpecialityItem() {
    if (!this.isSpecialityFormValid) {
      return;
    }

    if (this.editingSpecialityItemId) {
      this.specialityCatalogItems = this.specialityCatalogItems.map(item =>
        item.id === this.editingSpecialityItemId
          ? {
              ...item,
              name: this.specialityItemName.trim(),
              category: this.currentSpecialityCategory,
              domainName: this.isMentionSpecialityTab ? this.specialityDomainName : undefined,
            }
          : item
      );
      this.resetSpecialityForm();
      return;
    }

    this.specialityCatalogItems = [
      {
        id: `${this.nextSpecialityItemId}`,
        category: this.currentSpecialityCategory,
        name: this.specialityItemName.trim(),
        domainName: this.isMentionSpecialityTab ? this.specialityDomainName : undefined,
        status: 'Actif',
      },
      ...this.specialityCatalogItems,
    ];
    this.nextSpecialityItemId += 1;
    this.specialityPage = 1;
    this.resetSpecialityForm();
  }

  submitGeneralCalendarFilters() {
    if (this.editingCalendarEntryId) {
      this.generalCalendarEntries = this.generalCalendarEntries.map(entry =>
        entry.id === this.editingCalendarEntryId
          ? {
              ...entry,
              level: this.calendarFilters.level || entry.level,
              semester: this.calendarFilters.semester || entry.semester,
              eventName: this.calendarFilters.eventName || entry.eventName,
            }
          : entry
      );
      this.resetGeneralCalendarFilters();
      return;
    }

    this.appliedCalendarFilters = { ...this.calendarFilters };
    this.calendarPage = 1;
  }

  submitTrackedEvent() {
    if (!this.isEventFormValid) {
      return;
    }

    if (this.editingTrackedEventId) {
      this.trackedEvents = this.trackedEvents.map(event =>
        event.id === this.editingTrackedEventId
          ? {
              ...event,
              level: this.eventForm.level,
              semester: this.eventForm.semester,
              name: this.eventForm.name.trim(),
            }
          : event
      );
      this.resetTrackedEventForm();
      return;
    }

    const newEvent: TrackedEvent = {
      id: `${this.nextTrackedEventId}`,
      level: this.eventForm.level,
      semester: this.eventForm.semester,
      name: this.eventForm.name.trim(),
      ...this.getDefaultEventWindow(this.eventForm.semester),
      status: 'En cours',
    };

    this.trackedEvents = [newEvent, ...this.trackedEvents];
    this.nextTrackedEventId += 1;
    this.eventPage = 1;
    this.resetTrackedEventForm();
  }

  editTrackedEvent(event: TrackedEvent) {
    this.openTrackedEventActionId = null;
    this.editingTrackedEventId = event.id;
    this.eventForm = {
      level: event.level,
      semester: event.semester,
      name: event.name,
    };
  }

  deleteTrackedEvent(eventId: string) {
    this.openTrackedEventActionId = null;
    this.trackedEvents = this.trackedEvents.filter(event => event.id !== eventId);

    if (this.editingTrackedEventId === eventId) {
      this.resetTrackedEventForm();
    }

    if (this.eventPage > this.totalTrackedEventPages) {
      this.eventPage = this.totalTrackedEventPages;
    }
  }

  cancelTrackedEventEdition() {
    this.resetTrackedEventForm();
  }

  toggleTrackedEventActionMenu(eventId: string) {
    this.openTrackedEventActionId =
      this.openTrackedEventActionId === eventId ? null : eventId;
  }

  editSpecialityItem(item: SpecialityCatalogItem) {
    this.openSpecialityActionId = null;
    this.editingSpecialityItemId = item.id;
    this.specialityItemName = item.name;
    this.specialityDomainName = item.domainName ?? '';
  }

  deleteSpecialityItem(itemId: string) {
    this.openSpecialityActionId = null;
    this.specialityCatalogItems = this.specialityCatalogItems.filter(item => item.id !== itemId);

    if (this.editingSpecialityItemId === itemId) {
      this.resetSpecialityForm();
    }

    if (this.specialityPage > this.totalSpecialityPages) {
      this.specialityPage = this.totalSpecialityPages;
    }
  }

  toggleSpecialityActionMenu(itemId: string) {
    this.openSpecialityActionId = this.openSpecialityActionId === itemId ? null : itemId;
  }

  cancelSpecialityEdition() {
    this.resetSpecialityForm();
  }

  editGeneralCalendarEntry(entry: GeneralCalendarEntry) {
    this.openCalendarActionId = null;
    this.editingCalendarEntryId = entry.id;
    this.calendarFilters = {
      level: entry.level,
      semester: entry.semester,
      eventName: entry.eventName,
    };
  }

  deleteGeneralCalendarEntry(entryId: string) {
    this.openCalendarActionId = null;
    this.generalCalendarEntries = this.generalCalendarEntries.filter(entry => entry.id !== entryId);

    if (this.editingCalendarEntryId === entryId) {
      this.resetGeneralCalendarFilters();
    }

    if (this.calendarPage > this.totalGeneralCalendarPages) {
      this.calendarPage = this.totalGeneralCalendarPages;
    }
  }

  toggleGeneralCalendarActionMenu(entryId: string) {
    this.openCalendarActionId = this.openCalendarActionId === entryId ? null : entryId;
  }

  setYearStatus(year: AcademicYear, status: AcademicYear['status']) {
    year.status = status;
  }

  private getDefaultEventWindow(semester: string): Pick<TrackedEvent, 'startDate' | 'endDate'> {
    switch (semester) {
      case 'Semestre 1':
        return { startDate: '07/10/2024', endDate: '10/10/2024' };
      case 'Semestre 2':
        return { startDate: '17/02/2025', endDate: '20/02/2025' };
      case 'Session intensive':
        return { startDate: '05/05/2025', endDate: '09/05/2025' };
      default:
        return { startDate: '--/--/----', endDate: '--/--/----' };
    }
  }

  private resetTrackedEventForm() {
    this.editingTrackedEventId = null;
    this.eventForm = {
      level: '',
      semester: '',
      name: '',
    };
  }

  private resetSpecialityForm() {
    this.editingSpecialityItemId = null;
    this.specialityItemName = '';
    this.specialityDomainName = '';
  }

  private resetGeneralCalendarFilters() {
    this.editingCalendarEntryId = null;
    this.calendarFilters = {
      level: '',
      semester: '',
      eventName: '',
    };
    this.appliedCalendarFilters = {
      level: '',
      semester: '',
      eventName: '',
    };
    this.calendarPage = 1;
  }

  toggleActionMenu(year: AcademicYear) {
    this.openActionId = this.openActionId === year.id ? null : year.id;
  }

  closeActionMenu() {
    this.openActionId = null;
    this.openTrackedEventActionId = null;
    this.openCalendarActionId = null;
    this.openSpecialityActionId = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.openActionId = null;
    this.openTrackedEventActionId = null;
    this.openCalendarActionId = null;
    this.openSpecialityActionId = null;
  }
}
