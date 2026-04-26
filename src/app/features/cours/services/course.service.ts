import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { SelectOption } from '../../../shared/models';

export interface Course {
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

export interface CoursDataSource {
  pageSize: number;
  specialites: SelectOption[];
  niveaux: SelectOption[];
  classes: SelectOption[];
  semestres: SelectOption[];
  courses: Course[];
}

export interface CourseFilters {
  searchTerm: string;
  specialite: string;
  niveau: string;
  classe: string;
  semestre: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private readonly data: CoursDataSource;

  constructor() {
    this.data = structuredClone(APP_DATA.features.cours as CoursDataSource);
  }

  getCourses(): Course[] {
    return [...this.data.courses];
  }

  getFilterOptions(): {
    specialites: SelectOption[];
    niveaux: SelectOption[];
    classes: SelectOption[];
    semestres: SelectOption[];
    pageSize: number;
  } {
    return {
      specialites: [...this.data.specialites],
      niveaux: [...this.data.niveaux],
      classes: [...this.data.classes],
      semestres: [...this.data.semestres],
      pageSize: this.data.pageSize,
    };
  }

  filterCourses(courses: Course[], filters: CourseFilters): Course[] {
    const { searchTerm, specialite, niveau, classe, semestre } = filters;
    const term = searchTerm.trim().toLowerCase();

    return courses.filter(course => {
      const matchesSearch = term
        ? `${course.ue} ${course.module} ${course.professor}`.toLowerCase().includes(term)
        : true;
      const matchesSpecialite = specialite === 'toutes' || course.specialite === specialite;
      const matchesNiveau = niveau === 'tous' || course.niveau === niveau;
      const matchesClasse = classe === 'toutes' || course.classe === classe;
      const matchesSemestre = semestre === 'tous' || course.semestre === semestre;
      return matchesSearch && matchesSpecialite && matchesNiveau && matchesClasse && matchesSemestre;
    });
  }
}
