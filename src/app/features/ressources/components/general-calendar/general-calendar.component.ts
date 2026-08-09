import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { PaginatedFormState } from '@shared/utils/pagination.utils';
import { GeneralCalendarEntry, GeneralCalendarFilter } from '../../models';
import { GeneralCalendarService } from '../../services';

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

  readonly calendarState = new PaginatedFormState<GeneralCalendarEntry, GeneralCalendarFilter>(
    5,
    () => this.createCalendarFilters(),
  );
  appliedCalendarFilters: GeneralCalendarFilter = { level: '', semester: '', eventName: '' };

  constructor(private generalCalendarService: GeneralCalendarService) {
    this.loadCalendarEntries();
  }

  private loadCalendarEntries(): void {
    this.calendarState.setItems(this.generalCalendarService.filter(this.appliedCalendarFilters));
  }

  get calendarEventOptions(): string[] {
    return this.generalCalendarService.getEventNames();
  }

  get filteredGeneralCalendarEntries(): GeneralCalendarEntry[] {
    return this.calendarState.items;
  }

  get totalGeneralCalendarEntries(): number {
    return this.filteredGeneralCalendarEntries.length;
  }

  get totalGeneralCalendarPages(): number {
    return this.calendarState.totalPages;
  }

  get currentGeneralCalendarPage(): number {
    return this.calendarState.currentPage;
  }

  get pagedGeneralCalendarEntries(): GeneralCalendarEntry[] {
    return this.calendarState.pagedItems;
  }

  get generalCalendarCanPrev(): boolean {
    return this.calendarState.canPrev;
  }

  get generalCalendarCanNext(): boolean {
    return this.calendarState.canNext;
  }

  get generalCalendarPages(): number[] {
    return this.calendarState.pages;
  }

  get calendarFilters(): GeneralCalendarFilter {
    return this.calendarState.form;
  }

  get calendarPageSize(): number {
    return this.calendarState.pageSize;
  }

  updateCalendarFilters(patch: Partial<GeneralCalendarFilter>): void {
    this.calendarState.patchForm(patch);
  }

  submitGeneralCalendarFilters(): void {
    const filters = { ...this.calendarState.form };

    if (this.calendarState.editingItemId) {
      this.generalCalendarService.update(this.calendarState.editingItemId, filters);
      this.resetGeneralCalendarFilters();
      this.loadCalendarEntries();
      return;
    }

    this.appliedCalendarFilters = filters;
    this.calendarState.setPage(1);
    this.loadCalendarEntries();
  }

  editGeneralCalendarEntry(entry: GeneralCalendarEntry): void {
    this.calendarState.startEditing(entry.id, {
      level: entry.level,
      semester: entry.semester,
      eventName: entry.eventName,
    });
  }

  deleteGeneralCalendarEntry(entryId: string): void {
    this.calendarState.closeActionMenu();
    this.generalCalendarService.delete(entryId);
    if (this.calendarState.editingItemId === entryId) {
      this.resetGeneralCalendarFilters();
    }
    this.loadCalendarEntries();
  }

  cancelGeneralCalendarEdition(): void {
    this.resetGeneralCalendarFilters();
  }

  toggleGeneralCalendarActionMenu(entryId: string): void {
    this.calendarState.toggleActionMenu(entryId);
  }

  setGeneralCalendarPage(page: number): void {
    this.calendarState.setPage(page);
  }

  previousGeneralCalendarPage(): void {
    this.calendarState.previousPage();
  }

  nextGeneralCalendarPage(): void {
    this.calendarState.nextPage();
  }

  setGeneralCalendarPageSize(value: string): void {
    this.calendarState.setPageSize(value);
  }

  private resetGeneralCalendarFilters(): void {
    this.calendarState.reset();
    this.appliedCalendarFilters = this.createCalendarFilters();
  }

  private createCalendarFilters(): GeneralCalendarFilter {
    return { level: '', semester: '', eventName: '' };
  }
}
