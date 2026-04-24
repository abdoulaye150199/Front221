import { Component, OnInit } from '@angular/core';
import { DASHBOARD_IMPORTS } from '../../shared/imports/page-imports';
import { CourseCardData, EventCardData } from '../../shared/models';
import { DashboardService } from './services/dashboard.service';
import {
  AcademicYearInfo,
  DashboardChartData,
  DashboardStats,
  SchoolInfo,
} from './models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...DASHBOARD_IMPORTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  events: EventCardData[] = [];
  courses: CourseCardData[] = [];
  stats!: DashboardStats;
  schoolInfo!: SchoolInfo;
  academicYear!: AcademicYearInfo;
  chartData!: DashboardChartData;

  selectedAttendanceTab = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const dashboardData = this.dashboardService.getDashboardData();
    this.events = dashboardData.events;
    this.courses = dashboardData.courses;
    this.stats = dashboardData.stats;
    this.schoolInfo = dashboardData.schoolInfo;
    this.academicYear = dashboardData.academicYear;
    this.chartData = dashboardData.chartData;
  }

  getBarHeight(value: number, maxValue: number): string {
    return `${(value / maxValue) * 100}%`;
  }

  getAttendanceColor(value: number): string {
    if (value >= 90) return '#22a855';
    if (value >= 80) return '#f59e0b';
    return '#c1361c';
  }
}
