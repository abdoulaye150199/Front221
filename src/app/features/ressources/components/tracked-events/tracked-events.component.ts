import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { hasRequiredTextValues } from '@shared/validation';
import { TrackedEvent, TrackedEventForm, TrackedEventStatus } from '../../models';
import { TrackedEventService } from '../../services';

@Component({
  selector: 'app-tracked-events',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './tracked-events.component.html',
  styleUrls: ['./tracked-events.component.scss'],
})
export class TrackedEventsComponent {
  readonly levelOptions: string[] = ['Licence', 'Master 1', 'Master 2'];
  readonly semesterOptions: string[] = ['Semestre 1', 'Semestre 2', 'Session intensive'];
  readonly statusOptions: TrackedEventStatus[] = ['En cours', 'À venir', 'Terminé'];

  trackedEvents: TrackedEvent[] = [];
  eventForm: TrackedEventForm = { level: '', semester: '', name: '' };
  eventPage = 1;
  eventPageSize = 5;
  openTrackedEventActionId: string | null = null;
  editingTrackedEventId: string | null = null;
  nextTrackedEventId = 1;

  constructor(private trackedEventService: TrackedEventService) {
    this.loadTrackedEvents();
  }

  private loadTrackedEvents(): void {
    this.trackedEvents = this.trackedEventService.getAll();
    this.nextTrackedEventId = this.trackedEvents.length + 1;
  }

  get isEventFormValid(): boolean {
    return hasRequiredTextValues(this.eventForm.level, this.eventForm.semester, this.eventForm.name);
  }

  get isEditingTrackedEvent(): boolean {
    return this.editingTrackedEventId !== null;
  }

  get totalTrackedEvents(): number {
    return this.trackedEvents.length;
  }

  get totalTrackedEventPages(): number {
    return Math.max(1, Math.ceil(this.totalTrackedEvents / this.eventPageSize));
  }

  get currentTrackedEventPage(): number {
    return Math.min(this.eventPage, this.totalTrackedEventPages);
  }

  get pagedTrackedEvents(): TrackedEvent[] {
    const start = (this.currentTrackedEventPage - 1) * this.eventPageSize;
    return this.trackedEvents.slice(start, start + this.eventPageSize);
  }

  get trackedEventCanPrev(): boolean {
    return this.currentTrackedEventPage > 1;
  }

  get trackedEventCanNext(): boolean {
    return this.currentTrackedEventPage < this.totalTrackedEventPages;
  }

  previousTrackedEventPage(): void {
    if (this.trackedEventCanPrev) {
      this.eventPage -= 1;
    }
  }

  nextTrackedEventPage(): void {
    if (this.trackedEventCanNext) {
      this.eventPage += 1;
    }
  }

  setTrackedEventPageSize(value: string): void {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && pageSize > 0) {
      this.eventPageSize = pageSize;
      this.eventPage = 1;
    }
  }

  submitTrackedEvent(): void {
    if (!this.isEventFormValid) {
      return;
    }

    if (this.editingTrackedEventId) {
      this.trackedEventService.update(this.editingTrackedEventId, this.eventForm);
      this.resetTrackedEventForm();
      this.loadTrackedEvents();
      return;
    }

    this.trackedEventService.create(this.eventForm);
    this.resetTrackedEventForm();
    this.loadTrackedEvents();
  }

  editTrackedEvent(event: TrackedEvent): void {
    this.openTrackedEventActionId = null;
    this.editingTrackedEventId = event.id;
    this.eventForm = {
      level: event.level,
      semester: event.semester,
      name: event.name,
    };
  }

  deleteTrackedEvent(eventId: string): void {
    this.openTrackedEventActionId = null;
    this.trackedEventService.delete(eventId);
    if (this.editingTrackedEventId === eventId) {
      this.resetTrackedEventForm();
    }
    this.loadTrackedEvents();
    if (this.eventPage > this.totalTrackedEventPages) {
      this.eventPage = this.totalTrackedEventPages;
    }
  }

  cancelTrackedEventEdition(): void {
    this.resetTrackedEventForm();
  }

  toggleTrackedEventActionMenu(eventId: string): void {
    this.openTrackedEventActionId =
      this.openTrackedEventActionId === eventId ? null : eventId;
  }

  private resetTrackedEventForm(): void {
    this.editingTrackedEventId = null;
    this.eventForm = { level: '', semester: '', name: '' };
  }
}
