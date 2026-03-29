import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() change: string = '';
  @Input() icon: string = '';
  @Input() isPositive: boolean = true;
}
