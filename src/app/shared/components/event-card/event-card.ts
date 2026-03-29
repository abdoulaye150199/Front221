import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCardComponent {
  @Input() event!: Event;
}
