export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  semester: string;
  students: number;
  courses: number;
  status: 'En cours' | 'Clôturé';
}

export interface AcademicYearForm {
  year: string;
  startDate: string;
  endDate: string;
}

export interface AcademicYearsState {
  items: AcademicYear[];
  page: number;
  pageSize: number;
  searchTerm: string;
  form: AcademicYearForm;
}

export type AcademicYearStatus = AcademicYear['status'];
