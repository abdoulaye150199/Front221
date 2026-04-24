import { Component } from '@angular/core';
import { APP_DATA } from '../../shared/data';
import { LIST_PAGE_IMPORTS } from '../../shared/imports/page-imports';
import { ListFilterConfig, SelectOption } from '../../shared/models';
import { getInitials } from '../../shared/utils';
import { parseAllowedNumberOption } from '../../shared/validation';

interface Professor {
  id: string;
  name: string;
  grade: string;
  phone: string;
  email: string;
  hours: number;
  status: 'Actif' | 'Inactif';
  classe: string;
}

interface ProfesseursDataSource {
  pageSizeOptions: SelectOption[];
  classOptions: SelectOption[];
  statusOptions: SelectOption[];
  professors: Professor[];
}

const professeursData = APP_DATA.features.professeurs as ProfesseursDataSource;

@Component({
  selector: 'app-professeurs',
  standalone: true,
  imports: [...LIST_PAGE_IMPORTS],
  templateUrl: './professeurs.html',
  styleUrls: ['./professeurs.scss'],
})
export class ProfesseursComponent {
  readonly getInitials = getInitials;
  searchTerm = '';
  page = 1;
  readonly pageSizeOptions = professeursData.pageSizeOptions;
  readonly classOptions = professeursData.classOptions;
  readonly statusOptions = professeursData.statusOptions;
  pageSize = Number(this.pageSizeOptions[0]?.value ?? 10);

  selectedClass = this.classOptions[0]?.value ?? '';
  selectedStatus = this.statusOptions[0]?.value ?? '';

  openMenuId: string | null = null;
  selectedProfessor: Professor | null = null;

  readonly professors = professeursData.professors;

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.page = 1;
  }

  onPageSizeChange(value: string) {
    const pageSize = parseAllowedNumberOption(value, this.pageSizeOptions.map(option => Number(option.value)));
    if (pageSize === null) {
      return;
    }

    this.pageSize = pageSize;
    this.page = 1;
  }

  get filterConfigs(): ListFilterConfig[] {
    return [
      { id: 'class', label: 'Classe', value: this.selectedClass, options: this.classOptions },
      { id: 'status', label: 'Statut', value: this.selectedStatus, options: this.statusOptions },
    ];
  }

  get filteredProfessors(): Professor[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.professors.filter(prof => {
      const matchesSearch = term
        ? `${prof.name} ${prof.grade} ${prof.email}`.toLowerCase().includes(term)
        : true;
      const matchesClass =
        this.selectedClass === 'toutes' || prof.classe.startsWith(this.selectedClass);
      const matchesStatus = this.selectedStatus === 'tous' || prof.status === this.selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }

  get totalResults(): number {
    return this.filteredProfessors.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedProfessors(): Professor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProfessors.slice(start, start + this.pageSize);
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

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage() {
    if (this.canPrev) this.page -= 1;
  }

  nextPage() {
    if (this.canNext) this.page += 1;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  onFilterChange(filter: { id: string; value: string }): void {
    if (filter.id === 'class') {
      this.selectedClass = filter.value;
    }

    if (filter.id === 'status') {
      this.selectedStatus = filter.value;
    }

    this.page = 1;
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openProfile(professor: Professor) {
    this.selectedProfessor = professor;
    this.openMenuId = null;
  }

  closeProfile() {
    this.selectedProfessor = null;
  }
}
