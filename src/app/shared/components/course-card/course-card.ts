import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Course {
  id: string;
  title: string;
  instructor: string;
  time: string;
  room: string;
  students: number;
  icon: string;
  color: string;
  dayOfWeek?: string;
}

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCardComponent {
  @Input() course!: Course;
}
