import { Component } from '@angular/core';
import { LIST_PAGE_IMPORTS } from '../../shared/imports/page-imports';
import { getInitials } from '../../shared/utils';
import { parseAllowedNumberOption } from '../../shared/validation';
import { SelectOption } from '../../shared/models';
import { Professor, ProfessorService } from './services/professor.service';

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
  pageSize = 10;
  pageSizeOptions: SelectOption[] = [];

  specialites: SelectOption[] = [];
  niveaux: SelectOption[] = [];
  classes: SelectOption[] = [];
  semestres: SelectOption[] = [];

  selectedSpecialite = 'toutes';
  selectedNiveau = 'tous';
  selectedClasse = 'toutes';
  selectedSemestre = 'tous';

  openMenuId: string | null = null;
  selectedProfessor: Professor | null = null;

  private allProfessors: Professor[] = [];

  constructor(private professorService: ProfessorService) {
    const options = this.professorService.getFilterOptions();
    this.pageSizeOptions = options.pageSizeOptions;
    this.pageSize = Number(this.pageSizeOptions[0]?.value ?? 10);
    this.specialites = options.pageSizeOptions;
    this.niveaux = options.classOptions;
    this.classes = options.statusOptions;
    this.allProfessors = this.professorService.getProfessors();

    this.selectedSpecialite = this.specialites[0]?.value ?? 'toutes';
    this.selectedNiveau = this.niveaux[0]?.value ?? 'tous';
    this.selectedClasse = this.classes[0]?.value ?? 'toutes';
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.page = 1;
  }

  onPageSizeChange(value: string): void {
    const pageSize = parseAllowedNumberOption(value, [10, 20, 50]);
    if (pageSize === null) {
      return;
    }
    this.pageSize = pageSize;
    this.page = 1;
  }

  get filterConfigs(): { id: string; label: string; value: string; options: SelectOption[] }[] {
    return [
      { id: 'class', label: 'Classe', value: this.selectedClasse, options: this.classes },
      { id: 'status', label: 'Statut', value: this.selectedSemestre, options: this.semestres },
    ];
  }

  get filteredProfessors(): Professor[] {
    return this.professorService.filterProfessors(
      this.allProfessors,
      this.searchTerm,
      this.selectedClasse,
      this.selectedSemestre
    );
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
    return this.totalResults === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return this.totalResults === 0
      ? 0
      : Math.min(this.currentPage * this.pageSize, this.totalResults);
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

  previousPage(): void {
    if (this.canPrev) {
      this.page -= 1;
    }
  }

  nextPage(): void {
    if (this.canNext) {
      this.page += 1;
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  onFilterChange(filter: { id: string; value: string }): void {
    if (filter.id === 'class') {
      this.selectedClasse = filter.value;
    }
    if (filter.id === 'status') {
      this.selectedSemestre = filter.value;
    }
    this.page = 1;
  }

  toggleMenu(id: string): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openProfile(professor: Professor): void {
    this.selectedProfessor = professor;
    this.openMenuId = null;
  }

  closeProfile(): void {
    this.selectedProfessor = null;
  }
}
