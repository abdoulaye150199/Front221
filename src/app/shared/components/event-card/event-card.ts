import { Component, Input } from '@angular/core';
import { ICON_IMPORTS } from '../../imports/standalone-imports';
import { EventCardData } from '../../models';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [...ICON_IMPORTS],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCardComponent {
  @Input({ required: true }) event!: EventCardData;
}
