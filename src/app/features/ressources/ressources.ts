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
  activeMainTab = 0;
  activeSubTab = 0;
  openActionId: string | null = null;
  searchTerm = '';
  page = 1;
  pageSize = 4;

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

  setActiveMainTab(index: number) {
    this.activeMainTab = index;
    this.activeSubTab = 0;
  }

  setActiveSubTab(index: number) {
    this.activeSubTab = index;
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

  previousPage() {
    if (this.canPrev) this.page -= 1;
  }

  nextPage() {
    if (this.canNext) this.page += 1;
  }

  setYearStatus(year: AcademicYear, status: AcademicYear['status']) {
    year.status = status;
  }

  toggleActionMenu(year: AcademicYear) {
    this.openActionId = this.openActionId === year.id ? null : year.id;
  }

  closeActionMenu() {
    this.openActionId = null;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.openActionId = null;
  }
}
