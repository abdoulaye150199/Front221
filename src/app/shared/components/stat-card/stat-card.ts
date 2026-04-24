import { Component, Input } from '@angular/core';
import { ICON_IMPORTS } from '../../imports/standalone-imports';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [...ICON_IMPORTS],
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.scss'],
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() change: string = '';
  @Input() icon: string = '';
  @Input() isPositive: boolean = true;
}
