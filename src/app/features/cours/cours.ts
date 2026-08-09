import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { CourseService, Course, CourseFilters } from './services/course.service';
import { createPaginationHandler } from '../../shared/utils';

interface CourseGroup {
  ue: string;
  credits: number;
  courses: Course[];
}

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './cours.html',
  styleUrls: ['./cours.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  openCourseActionId: string | null = null;
  readonly semesterTabs = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
  readonly academicContext = {
    domain: 'Sciences et Technologies',
    speciality: 'Développement Web et Mobile',
    mention: 'Informatique',
    grade: 'Licence',
  };

  private allCourses: Course[] = [];

  private pagination = createPaginationHandler(
    () => this.filteredCourses.length,
    () => this.pageSize,
    () => this.page,
    (page) => {
      this.page = page;
    },
  );

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

  selectSemester(semester: string): void {
    this.selectedSemestre = semester;
    this.page = 1;
    this.closeActionMenu();
  }

  toggleActionMenu(courseId: string): void {
    this.openCourseActionId = this.openCourseActionId === courseId ? null : courseId;
  }

  closeActionMenu(): void {
    this.openCourseActionId = null;
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
    return this.pagination.totalPages;
  }

  get currentPage(): number {
    return this.page;
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
  }

  get groupedCourses(): CourseGroup[] {
    const groups = new Map<string, CourseGroup>();

    for (const course of this.pagedCourses) {
      const current = groups.get(course.ue);
      if (current) {
        current.courses.push(course);
      } else {
        groups.set(course.ue, {
          ue: course.ue,
          credits: course.credits,
          courses: [course],
        });
      }
    }

    return [...groups.values()];
  }

  coefficient(course: Course): number {
    return course.coefficient ?? Math.max(1, Math.round(course.credits / 2));
  }

  plannedHours(course: Course): number {
    return course.vhp ?? (Number.parseInt(course.hours, 10) || 0);
  }

  personalWorkHours(course: Course): number {
    return course.tpe ?? 0;
  }

  totalHours(course: Course): number {
    return course.vht ?? this.plannedHours(course) + this.personalWorkHours(course);
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
    return this.pagination.canPrev;
  }

  get canNext(): boolean {
    return this.pagination.canNext;
  }

  previousPage(): void {
    this.pagination.previousPage();
  }

  nextPage(): void {
    this.pagination.nextPage();
  }

  setPage(page: number): void {
    this.pagination.setPage(page);
  }
}
