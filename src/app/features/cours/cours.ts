import { Component } from '@angular/core';
import { APP_DATA } from '../../shared/data';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { SelectOption } from '../../shared/models';

interface Course {
  id: string;
  ue: string;
  module: string;
  professor: string;
  credits: number;
  hours: string;
  students: number;
  specialite: string;
  niveau: string;
  classe: string;
  semestre: string;
}

interface CoursDataSource {
  pageSize: number;
  specialites: SelectOption[];
  niveaux: SelectOption[];
  classes: SelectOption[];
  semestres: SelectOption[];
  courses: Course[];
}

const coursData = APP_DATA.features.cours as CoursDataSource;

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
  pageSize = coursData.pageSize;

  readonly specialites = coursData.specialites;
  readonly niveaux = coursData.niveaux;
  readonly classes = coursData.classes;
  readonly semestres = coursData.semestres;

  selectedSpecialite = this.specialites[0]?.value ?? '';
  selectedNiveau = this.niveaux[0]?.value ?? '';
  selectedClasse = this.classes[0]?.value ?? '';
  selectedSemestre = this.semestres[0]?.value ?? '';

  readonly courses = coursData.courses;

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.page = 1;
  }

  get filteredCourses(): Course[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.courses.filter(course => {
      const matchesSearch = term
        ? `${course.ue} ${course.module} ${course.professor}`.toLowerCase().includes(term)
        : true;
      const matchesSpecialite =
        this.selectedSpecialite === 'toutes' || course.specialite === this.selectedSpecialite;
      const matchesNiveau = this.selectedNiveau === 'tous' || course.niveau === this.selectedNiveau;
      const matchesClasse = this.selectedClasse === 'toutes' || course.classe === this.selectedClasse;
      const matchesSemestre =
        this.selectedSemestre === 'tous' || course.semestre === this.selectedSemestre;
      return matchesSearch && matchesSpecialite && matchesNiveau && matchesClasse && matchesSemestre;
    });
  }

  get totalResults(): number {
    return this.filteredCourses.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
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
}
