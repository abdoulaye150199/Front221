import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { hasRequiredTextValues } from '@shared/validation';
import { PaginatedFormState } from '@shared/utils/pagination.utils';
import { TrackedEvent, TrackedEventForm } from '../../models';
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

  readonly eventState = new PaginatedFormState<TrackedEvent, TrackedEventForm>(
    5,
    () => this.createTrackedEventForm()
  );

  constructor(private trackedEventService: TrackedEventService) {
    this.loadTrackedEvents();
  }

  private loadTrackedEvents(): void {
    this.eventState.setItems(this.trackedEventService.getAll());
  }

  get isEventFormValid(): boolean {
    return hasRequiredTextValues(
      this.eventState.form.level,
      this.eventState.form.semester,
      this.eventState.form.name
    );
  }

  get isEditingTrackedEvent(): boolean {
    return this.eventState.editingItemId !== null;
  }

  get eventForm(): TrackedEventForm {
    return this.eventState.form;
  }

  get totalTrackedEventPages(): number {
    return this.eventState.totalPages;
  }

  get currentTrackedEventPage(): number {
    return this.eventState.currentPage;
  }

  get pagedTrackedEvents(): TrackedEvent[] {
    return this.eventState.pagedItems;
  }

  get trackedEventCanPrev(): boolean {
    return this.eventState.canPrev;
  }

  get trackedEventCanNext(): boolean {
    return this.eventState.canNext;
  }

  get eventPageSize(): number {
    return this.eventState.pageSize;
  }

  updateEventForm(patch: Partial<TrackedEventForm>): void {
    this.eventState.patchForm(patch);
  }

  previousTrackedEventPage(): void {
    this.eventState.previousPage();
  }

  nextTrackedEventPage(): void {
    this.eventState.nextPage();
  }

  setTrackedEventPageSize(value: string): void {
    this.eventState.setPageSize(value);
  }

  submitTrackedEvent(): void {
    if (!this.isEventFormValid) {
      return;
    }

    const form = { ...this.eventState.form };

    if (this.eventState.editingItemId) {
      this.trackedEventService.update(this.eventState.editingItemId, form);
      this.eventState.reset();
      this.loadTrackedEvents();
      return;
    }

    this.trackedEventService.create(form);
    this.eventState.reset();
    this.loadTrackedEvents();
  }

  editTrackedEvent(event: TrackedEvent): void {
    this.eventState.startEditing(event.id, {
      level: event.level,
      semester: event.semester,
      name: event.name,
    });
  }

  deleteTrackedEvent(eventId: string): void {
    this.eventState.closeActionMenu();
    this.trackedEventService.delete(eventId);
    if (this.eventState.editingItemId === eventId) {
      this.eventState.reset();
    }
    this.loadTrackedEvents();
  }

  cancelTrackedEventEdition(): void {
    this.eventState.reset();
  }

  toggleTrackedEventActionMenu(eventId: string): void {
    this.eventState.toggleActionMenu(eventId);
  }

  private createTrackedEventForm(): TrackedEventForm {
    return { level: '', semester: '', name: '' };
  }
}
