import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { CourseService, Course, CourseFilters } from './services/course.service';
import { calculateTotalPages, calculateStartIndex, calculateEndIndex } from '../../shared/utils';

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './cours.html',
  styleUrls: ['./cours.scss'],
})
export class CoursComponent {
  searchTerm = '';
  page = 1;
  pageSize: number;

  specialites: { value: string; label: string }[] = [];
  niveaux: { value: string; label: string }[] = [];
  classes: { value: string; label: string }[] = [];
  semestres: { value: string; label: string }[] = [];

  selectedSpecialite = 'toutes';
  selectedNiveau = 'tous';
  selectedClasse = 'toutes';
  selectedSemestre = 'tous';

  private allCourses: Course[] = [];

  constructor(private courseService: CourseService) {
    const options = this.courseService.getFilterOptions();
    this.pageSize = options.pageSize;
    this.specialites = options.specialites;
    this.niveaux = options.niveaux;
    this.classes = options.classes;
    this.semestres = options.semestres;
    this.allCourses = this.courseService.getCourses();

    this.selectedSpecialite = this.specialites[0]?.value ?? 'toutes';
    this.selectedNiveau = this.niveaux[0]?.value ?? 'tous';
    this.selectedClasse = this.classes[0]?.value ?? 'toutes';
    this.selectedSemestre = this.semestres[0]?.value ?? 'tous';
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.page = 1;
  }

  get filteredCourses(): Course[] {
    return this.courseService.filterCourses(this.allCourses, this.courseFilters);
  }

  private get courseFilters(): CourseFilters {
    return {
      searchTerm: this.searchTerm,
      specialite: this.selectedSpecialite,
      niveau: this.selectedNiveau,
      classe: this.selectedClasse,
      semestre: this.selectedSemestre,
    };
  }

  get totalResults(): number {
    return this.filteredCourses.length;
  }

  get totalPages(): number {
    return calculateTotalPages(this.totalResults, this.pageSize);
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    return calculateStartIndex(this.totalResults, this.currentPage, this.pageSize);
  }

  get endIndex(): number {
    return calculateEndIndex(this.currentPage, this.pageSize, this.totalResults);
  }

  get canPrev(): boolean {
    return this.currentPage > 1;
  }

  get canNext(): boolean {
    return this.currentPage < this.totalPages;
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
}
