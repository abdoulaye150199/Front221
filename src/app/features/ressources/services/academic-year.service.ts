import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { formatAcademicYearDate, formatAcademicYearLabel } from '../../../shared/validation';
import { AcademicYear, AcademicYearForm } from '../models';

const RESSOURCES_DATA = APP_DATA.features.ressources as {
  academicYears: AcademicYear[];
};

@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  private readonly academicYears: AcademicYear[];

  constructor() {
    this.academicYears = structuredClone(RESSOURCES_DATA.academicYears);
  }

  getAll(): AcademicYear[] {
    return [...this.academicYears];
  }

  getById(id: string): AcademicYear | undefined {
    return this.academicYears.find(year => year.id === id);
  }

  create(form: AcademicYearForm): AcademicYear {
    const createdAcademicYear: AcademicYear = {
      id: this.generateId(),
      year: formatAcademicYearLabel(form.year),
      startDate: formatAcademicYearDate(form.startDate),
      endDate: formatAcademicYearDate(form.endDate),
      semester: 'Semestre 1',
      students: 0,
      courses: 0,
      status: 'En cours',
    };

    this.academicYears.unshift(createdAcademicYear);
    return createdAcademicYear;
  }

  updateStatus(id: string, status: AcademicYear['status']): void {
    const index = this.academicYears.findIndex(year => year.id === id);
    if (index !== -1) {
      this.academicYears[index].status = status;
    }
  }

  filterBySearchTerm(term: string): AcademicYear[] {
    if (!term.trim()) {
      return this.getAll();
    }
    const lowerTerm = term.toLowerCase();
    return this.academicYears.filter(year =>
      `${year.year} ${year.startDate} ${year.endDate} ${year.semester} ${year.status}`
        .toLowerCase()
        .includes(lowerTerm)
    );
  }

  private generateId(): string {
    const highestId = this.academicYears.reduce((maxId, year) => {
      const parsedId = Number(year.id);
      return Number.isNaN(parsedId) ? maxId : Math.max(maxId, parsedId);
    }, 0);

    return String(highestId + 1);
  }
}
