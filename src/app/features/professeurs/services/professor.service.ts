import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { SelectOption } from '../../../shared/models';

export interface Professor {
  id: string;
  name: string;
  grade: string;
  phone: string;
  email: string;
  hours: number;
  status: 'Actif' | 'Inactif';
  classe: string;
}

export interface ProfesseursDataSource {
  pageSizeOptions: SelectOption[];
  classOptions: SelectOption[];
  statusOptions: SelectOption[];
  professors: Professor[];
}

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private readonly data: ProfesseursDataSource;

  constructor() {
    this.data = structuredClone(APP_DATA.features.professeurs as ProfesseursDataSource);
  }

  getProfessors(): Professor[] {
    return [...this.data.professors];
  }

  getFilterOptions(): {
    pageSizeOptions: SelectOption[];
    classOptions: SelectOption[];
    statusOptions: SelectOption[];
  } {
    return {
      pageSizeOptions: [...this.data.pageSizeOptions],
      classOptions: [...this.data.classOptions],
      statusOptions: [...this.data.statusOptions],
    };
  }

  filterProfessors(
    professors: Professor[],
    searchTerm: string,
    selectedClass: string,
    selectedStatus: string
  ): Professor[] {
    const term = searchTerm.trim().toLowerCase();
    return professors.filter(prof => {
      const matchesSearch = term
        ? `${prof.name} ${prof.grade} ${prof.email}`.toLowerCase().includes(term)
        : true;
      const matchesClass = selectedClass === 'toutes' || prof.classe.startsWith(selectedClass);
      const matchesStatus = selectedStatus === 'tous' || prof.status === selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }
}
