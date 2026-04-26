import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../../shared/imports/standalone-imports';
import { GeneralCalendarEntry, GeneralCalendarFilter } from '../models';
import { GeneralCalendarService } from '../services';

@Component({
  selector: 'app-general-calendar',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './general-calendar.component.html',
  styleUrls: ['./general-calendar.component.scss'],
})
export class GeneralCalendarComponent {
  readonly levelOptions: string[] = ['Licence', 'Master 1', 'Master 2'];
  readonly semesterOptions: string[] = ['Semestre 1', 'Semestre 2', 'Session intensive'];

  calendarEntries: GeneralCalendarEntry[] = [];
  calendarFilters: GeneralCalendarFilter = { level: '', semester: '', eventName: '' };
  appliedCalendarFilters: GeneralCalendarFilter = { level: '', semester: '', eventName: '' };
  calendarPage = 1;
  calendarPageSize = 5;
  openCalendarActionId: string | null = null;
  editingCalendarEntryId: string | null = null;

  constructor(private generalCalendarService: GeneralCalendarService) {
    this.loadCalendarEntries();
  }

  private loadCalendarEntries(): void {
    this.calendarEntries = this.generalCalendarService.getAll();
  }

  get calendarEventOptions(): string[] {
    return this.generalCalendarService.getEventNames();
  }

  get filteredGeneralCalendarEntries(): GeneralCalendarEntry[] {
    return this.generalCalendarService.filter(this.appliedCalendarFilters);
  }

  get totalGeneralCalendarEntries(): number {
    return this.filteredGeneralCalendarEntries.length;
  }

  get totalGeneralCalendarPages(): number {
    return Math.max(1, Math.ceil(this.totalGeneralCalendarEntries / this.calendarPageSize));
  }

  get currentGeneralCalendarPage(): number {
    return Math.min(this.calendarPage, this.totalGeneralCalendarPages);
  }

  get pagedGeneralCalendarEntries(): GeneralCalendarEntry[] {
    const start = (this.currentGeneralCalendarPage - 1) * this.calendarPageSize;
    return this.filteredGeneralCalendarEntries.slice(start, start + this.calendarPageSize);
  }

  get generalCalendarCanPrev(): boolean {
    return this.currentGeneralCalendarPage > 1;
  }

  get generalCalendarCanNext(): boolean {
    return this.currentGeneralCalendarPage < this.totalGeneralCalendarPages;
  }

  get generalCalendarPages(): number[] {
    return Array.from({ length: this.totalGeneralCalendarPages }, (_, index) => index + 1);
  }

  submitGeneralCalendarFilters(): void {
    if (this.editingCalendarEntryId) {
      this.generalCalendarService.update(this.editingCalendarEntryId, this.calendarFilters);
      this.resetGeneralCalendarFilters();
      this.loadCalendarEntries();
      return;
    }

    this.appliedCalendarFilters = { ...this.calendarFilters };
    this.calendarPage = 1;
  }

  editGeneralCalendarEntry(entry: GeneralCalendarEntry): void {
    this.openCalendarActionId = null;
    this.editingCalendarEntryId = entry.id;
    this.calendarFilters = {
      level: entry.level,
      semester: entry.semester,
      eventName: entry.eventName,
    };
  }

  deleteGeneralCalendarEntry(entryId: string): void {
    this.openCalendarActionId = null;
    this.generalCalendarService.delete(entryId);
    if (this.editingCalendarEntryId === entryId) {
      this.resetGeneralCalendarFilters();
    }
    this.loadCalendarEntries();
    if (this.calendarPage > this.totalGeneralCalendarPages) {
      this.calendarPage = this.totalGeneralCalendarPages;
    }
  }

  cancelGeneralCalendarEdition(): void {
    this.resetGeneralCalendarFilters();
  }

  toggleGeneralCalendarActionMenu(entryId: string): void {
    this.openCalendarActionId = this.openCalendarActionId === entryId ? null : entryId;
  }

  setGeneralCalendarPage(page: number): void {
    if (page >= 1 && page <= this.totalGeneralCalendarPages) {
      this.calendarPage = page;
    }
  }

  previousGeneralCalendarPage(): void {
    if (this.generalCalendarCanPrev) {
      this.calendarPage -= 1;
    }
  }

  nextGeneralCalendarPage(): void {
    if (this.generalCalendarCanNext) {
      this.calendarPage += 1;
    }
  }

  setGeneralCalendarPageSize(value: string): void {
    const pageSize = Number(value);
    if (!Number.isNaN(pageSize) && pageSize > 0) {
      this.calendarPageSize = pageSize;
      this.calendarPage = 1;
    }
  }

  private resetGeneralCalendarFilters(): void {
    this.editingCalendarEntryId = null;
    this.calendarFilters = { level: '', semester: '', eventName: '' };
    this.appliedCalendarFilters = { level: '', semester: '', eventName: '' };
    this.calendarPage = 1;
  }
}
