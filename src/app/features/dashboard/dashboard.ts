import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card';
import { EventCardComponent } from '../../shared/components/event-card/event-card';
import { CourseCardComponent } from '../../shared/components/course-card/course-card';
import { Event } from '../../shared/components/event-card/event-card';
import { Course } from '../../shared/components/course-card/course-card';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    StatCardComponent,
    EventCardComponent,
    CourseCardComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {
  events: Event[] = [];
  courses: Course[] = [];
  stats = {
    students: { count: '1,247', change: '12.5%', isPositive: true },
    teachers: { count: '87', change: '5.2%', isPositive: true },
  };

  schoolInfo = {
    name: 'Ecole 221',
    description: 'École Supérieure d\'Informatique',
    location: 'Dakar, Sénégal',
    founded: '2015',
    programs: '12 Spécialités',
    accreditation: 'Certifiée',
  };

  academicYear = {
    year: '2024-2025',
    status: 'En cours',
    semester: 'Semestre 1',
    week: 'Semaine 12',
  };

  chartData = {
    inscriptions: [
      { month: 'Sep', value: 85 },
      { month: 'Oct', value: 120 },
      { month: 'Nov', value: 95 },
      { month: 'Déc', value: 140 },
      { month: 'Jan', value: 165 },
    ],
    attendance: [
      { month: 'Sep', value: 92 },
      { month: 'Oct', value: 88 },
      { month: 'Nov', value: 95 },
      { month: 'Déc', value: 90 },
      { month: 'Jan', value: 94 },
    ],
  };

  selectedAttendanceTab = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.events = this.dashboardService.getEvents();
    this.courses = this.dashboardService.getCourses();
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
