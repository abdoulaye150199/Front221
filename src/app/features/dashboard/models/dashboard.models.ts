import { CourseCardData, EventCardData } from '../../../shared/models/card.models';

export interface DashboardStat {
  count: string;
  change: string;
  isPositive: boolean;
}

export interface DashboardStats {
  students: DashboardStat;
  teachers: DashboardStat;
}

export interface SchoolInfo {
  name: string;
  description: string;
  location: string;
  founded: string;
  programs: string;
  accreditation: string;
}

export interface AcademicYearInfo {
  year: string;
  status: string;
  semester: string;
  week: string;
}

export interface ChartPoint {
  month: string;
  value: number;
}

export interface DashboardChartData {
  inscriptions: ChartPoint[];
  attendance: ChartPoint[];
}

export interface DashboardData {
  events: EventCardData[];
  courses: CourseCardData[];
  stats: DashboardStats;
  schoolInfo: SchoolInfo;
  academicYear: AcademicYearInfo;
  chartData: DashboardChartData;
}
