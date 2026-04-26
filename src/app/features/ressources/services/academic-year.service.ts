import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { AcademicYear } from '../models';

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
}
