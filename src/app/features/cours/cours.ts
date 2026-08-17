import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { CourseService, Course, CourseFilters } from './services/course.service';
import { createPaginationHandler } from '../../shared/utils';

interface CourseGroup {
  ue: string;
  credits: number;
  courses: Course[];
}

type EditableCourseField =
  | 'ue'
  | 'module'
  | 'coefficient'
  | 'credits'
  | 'professor'
  | 'specialite'
  | 'niveau'
  | 'classe'
  | 'semestre'
  | 'vhp'
  | 'tpe'
  | 'vht'
  | 'students';

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
  detailCourse: Course | null = null;
  editingCourseId: string | null = null;
  editingField: EditableCourseField | null = null;
  editingValue = '';
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

  viewCourse(course: Course): void {
    this.detailCourse = course;
    this.closeActionMenu();
  }

  backToCourseList(): void {
    this.detailCourse = null;
  }

  startInlineEditing(course: Course, field: EditableCourseField): void {
    if (this.isEditing(course, field)) {
      return;
    }

    this.closeActionMenu();
    this.editingCourseId = course.id;
    this.editingField = field;
    this.editingValue = this.fieldValue(course, field);

    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('.inline-edit-input');
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
      });
    }
  }

  isEditing(course: Course, field: EditableCourseField): boolean {
    return this.editingCourseId === course.id && this.editingField === field;
  }

  cancelInlineEditing(): void {
    this.editingCourseId = null;
    this.editingField = null;
    this.editingValue = '';
  }

  updateEditingValue(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.editingValue = input.value;
    }
  }

  saveInlineEdit(course: Course): void {
    const field = this.editingField;
    if (!field || this.editingCourseId !== course.id) {
      return;
    }

    const updatedCourse = { ...course };
    const value = this.editingValue.trim();

    if (
      field === 'ue' ||
      field === 'module' ||
      field === 'professor' ||
      field === 'specialite' ||
      field === 'niveau' ||
      field === 'classe' ||
      field === 'semestre'
    ) {
      updatedCourse[field] = value || course[field];
    } else if (field === 'coefficient') {
      updatedCourse.coefficient = this.numberValue(value, this.coefficient(course));
    } else if (field === 'credits') {
      updatedCourse.credits = this.numberValue(value, course.credits);
    } else if (field === 'vhp') {
      updatedCourse.vhp = this.numberValue(value, this.plannedHours(course));
      updatedCourse.hours = `${updatedCourse.vhp}h`;
    } else if (field === 'tpe') {
      updatedCourse.tpe = this.numberValue(value, this.personalWorkHours(course));
    } else if (field === 'students') {
      updatedCourse.students = this.numberValue(value, course.students);
    } else {
      updatedCourse.vht = this.numberValue(value, this.totalHours(course));
    }

    this.allCourses = this.allCourses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course,
    );
    if (this.detailCourse?.id === updatedCourse.id) {
      this.detailCourse = updatedCourse;
    }
    this.cancelInlineEditing();
  }

  fieldValue(course: Course, field: EditableCourseField): string {
    switch (field) {
      case 'ue':
        return course.ue;
      case 'module':
        return course.module;
      case 'professor':
        return course.professor;
      case 'specialite':
        return course.specialite;
      case 'niveau':
        return course.niveau;
      case 'classe':
        return course.classe;
      case 'semestre':
        return course.semestre;
      case 'coefficient':
        return String(this.coefficient(course));
      case 'credits':
        return String(course.credits);
      case 'vhp':
        return String(this.plannedHours(course));
      case 'tpe':
        return String(this.personalWorkHours(course));
      case 'vht':
        return String(this.totalHours(course));
      case 'students':
        return String(course.students);
    }
  }

  private numberValue(value: number | string | null | undefined, fallback = 0): number {
    const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
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
