import { Component, Input } from '@angular/core';
import { ICON_IMPORTS } from '../../imports/standalone-imports';
import { CourseCardData } from '../../models';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [...ICON_IMPORTS],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss',
})
export class CourseCardComponent {
  @Input({ required: true }) course!: CourseCardData;
}
