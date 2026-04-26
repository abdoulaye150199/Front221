export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  semester: string;
  students: number;
  courses: number;
  status: 'En cours' | 'Terminé';
}

export interface AcademicYearsState {
  items: AcademicYear[];
  page: number;
  pageSize: number;
  searchTerm: string;
}

export type AcademicYearStatus = AcademicYear['status'];
