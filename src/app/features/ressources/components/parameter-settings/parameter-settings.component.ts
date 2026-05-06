import { Component, inject } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { hasRequiredTextValues, parseAllowedNumberOption } from '@shared/validation';
import {
  ParameterCivilityItem,
  ParameterDocumentForm,
  ParameterDocumentItem,
  ParameterDocumentType,
  ParameterEventForm,
  ParameterEventItem,
  ParameterRoomForm,
  ParameterRoomItem,
  ParameterScheduleForm,
  ParameterScheduleItem,
  ResourceParameterTab,
} from '../../models';
import { ParameterSettingsService } from '../../services';

@Component({
  selector: 'app-parameter-settings',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './parameter-settings.component.html',
  styleUrls: ['./parameter-settings.component.scss'],
})
export class ParameterSettingsComponent {
  private readonly parameterSettingsService = inject(ParameterSettingsService);

  readonly tabs = this.parameterSettingsService.config.tabs;
  readonly levelOptions = this.parameterSettingsService.config.levelOptions;
  readonly semesterOptions = this.parameterSettingsService.config.semesterOptions;
  readonly roomCapacityOptions = this.parameterSettingsService.config.roomCapacityOptions;
  readonly documentTypeOptions = this.parameterSettingsService.config.documentTypeOptions;
  readonly pageSizeOptions = this.parameterSettingsService.config.pageSizeOptions;

  activeTabIndex = 0;

  eventItems: ParameterEventItem[] = [];
  civilityItems: ParameterCivilityItem[] = [];
  roomItems: ParameterRoomItem[] = [];
  documentItems: ParameterDocumentItem[] = [];
  scheduleItems: ParameterScheduleItem[] = [];

  eventForm: ParameterEventForm = { level: '', semester: '', name: '' };
  civilityLabel = '';
  roomForm: ParameterRoomForm = { code: '', name: '', capacity: this.roomCapacityOptions[0] ?? 20 };
  documentForm: ParameterDocumentForm = {
    label: '',
    levelName: '',
    type: this.documentTypeOptions[0] ?? 'A ramener',
  };
  scheduleForm: ParameterScheduleForm = { label: '', levelName: '' };

  eventPage = 1;
  civilityPage = 1;
  roomPage = 1;
  documentPage = 1;
  schedulePage = 1;

  eventPageSize = this.pageSizeOptions[0] ?? 5;
  civilityPageSize = this.pageSizeOptions[0] ?? 5;
  roomPageSize = this.pageSizeOptions[0] ?? 5;
  documentPageSize = this.pageSizeOptions[0] ?? 5;
  schedulePageSize = this.pageSizeOptions[0] ?? 5;

  openEventActionId: string | null = null;
  openCivilityActionId: string | null = null;
  openRoomActionId: string | null = null;
  openDocumentActionId: string | null = null;
  openScheduleActionId: string | null = null;

  editingEventId: string | null = null;
  editingCivilityId: string | null = null;
  editingRoomId: string | null = null;
  editingDocumentId: string | null = null;
  editingScheduleId: string | null = null;

  constructor() {
    this.loadItems();
  }

  get currentTab(): ResourceParameterTab {
    return this.tabs[this.activeTabIndex] ?? 'Événements';
  }

  get isEventsTab(): boolean {
    return this.currentTab === 'Événements';
  }

  get isCivilitiesTab(): boolean {
    return this.currentTab === 'Civilité';
  }

  get isRoomsTab(): boolean {
    return this.currentTab === 'Salles';
  }

  get isDocumentsTab(): boolean {
    return this.currentTab === 'Documents';
  }

  get isSchedulesTab(): boolean {
    return this.currentTab === 'Horaires';
  }

  get isEventFormValid(): boolean {
    return hasRequiredTextValues(this.eventForm.level, this.eventForm.semester, this.eventForm.name);
  }

  get isCivilityFormValid(): boolean {
    return hasRequiredTextValues(this.civilityLabel);
  }

  get isRoomFormValid(): boolean {
    return hasRequiredTextValues(this.roomForm.code, this.roomForm.name)
      && Number.isFinite(this.roomForm.capacity)
      && this.roomForm.capacity > 0;
  }

  get isDocumentFormValid(): boolean {
    return hasRequiredTextValues(
      this.documentForm.label,
      this.documentForm.levelName,
      this.documentForm.type
    );
  }

  get isScheduleFormValid(): boolean {
    return hasRequiredTextValues(this.scheduleForm.label, this.scheduleForm.levelName);
  }

  get pagedEventItems(): ParameterEventItem[] {
    return this.paginate(this.eventItems, this.currentEventPage, this.eventPageSize);
  }

  get pagedCivilityItems(): ParameterCivilityItem[] {
    return this.paginate(this.civilityItems, this.currentCivilityPage, this.civilityPageSize);
  }

  get pagedRoomItems(): ParameterRoomItem[] {
    return this.paginate(this.roomItems, this.currentRoomPage, this.roomPageSize);
  }

  get pagedDocumentItems(): ParameterDocumentItem[] {
    return this.paginate(this.documentItems, this.currentDocumentPage, this.documentPageSize);
  }

  get pagedScheduleItems(): ParameterScheduleItem[] {
    return this.paginate(this.scheduleItems, this.currentSchedulePage, this.schedulePageSize);
  }

  get totalEventPages(): number {
    return this.getTotalPages(this.eventItems.length, this.eventPageSize);
  }

  get totalCivilityPages(): number {
    return this.getTotalPages(this.civilityItems.length, this.civilityPageSize);
  }

  get totalRoomPages(): number {
    return this.getTotalPages(this.roomItems.length, this.roomPageSize);
  }

  get totalDocumentPages(): number {
    return this.getTotalPages(this.documentItems.length, this.documentPageSize);
  }

  get totalSchedulePages(): number {
    return this.getTotalPages(this.scheduleItems.length, this.schedulePageSize);
  }

  get currentEventPage(): number {
    return Math.min(this.eventPage, this.totalEventPages);
  }

  get currentCivilityPage(): number {
    return Math.min(this.civilityPage, this.totalCivilityPages);
  }

  get currentRoomPage(): number {
    return Math.min(this.roomPage, this.totalRoomPages);
  }

  get currentDocumentPage(): number {
    return Math.min(this.documentPage, this.totalDocumentPages);
  }

  get currentSchedulePage(): number {
    return Math.min(this.schedulePage, this.totalSchedulePages);
  }

  get eventPages(): number[] {
    return this.buildPages(this.totalEventPages);
  }

  get civilityPages(): number[] {
    return this.buildPages(this.totalCivilityPages);
  }

  get roomPages(): number[] {
    return this.buildPages(this.totalRoomPages);
  }

  get documentPages(): number[] {
    return this.buildPages(this.totalDocumentPages);
  }

  get schedulePages(): number[] {
    return this.buildPages(this.totalSchedulePages);
  }

  get canPrevEventPage(): boolean {
    return this.currentEventPage > 1;
  }

  get canNextEventPage(): boolean {
    return this.currentEventPage < this.totalEventPages;
  }

  get canPrevCivilityPage(): boolean {
    return this.currentCivilityPage > 1;
  }

  get canNextCivilityPage(): boolean {
    return this.currentCivilityPage < this.totalCivilityPages;
  }

  get canPrevRoomPage(): boolean {
    return this.currentRoomPage > 1;
  }

  get canNextRoomPage(): boolean {
    return this.currentRoomPage < this.totalRoomPages;
  }

  get canPrevDocumentPage(): boolean {
    return this.currentDocumentPage > 1;
  }

  get canNextDocumentPage(): boolean {
    return this.currentDocumentPage < this.totalDocumentPages;
  }

  get canPrevSchedulePage(): boolean {
    return this.currentSchedulePage > 1;
  }

  get canNextSchedulePage(): boolean {
    return this.currentSchedulePage < this.totalSchedulePages;
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
    this.closeActionMenus();
  }

  submitEvent(): void {
    if (!this.isEventFormValid) {
      return;
    }

    if (this.editingEventId) {
      this.parameterSettingsService.updateEvent(this.editingEventId, this.eventForm);
    } else {
      this.parameterSettingsService.createEvent(this.eventForm);
    }

    this.resetEventForm();
    this.refreshEvents();
  }

  editEvent(item: ParameterEventItem): void {
    this.openEventActionId = null;
    this.editingEventId = item.id;
    this.eventForm = {
      level: item.level,
      semester: item.semester,
      name: item.name,
    };
  }

  deleteEvent(id: string): void {
    this.openEventActionId = null;
    this.parameterSettingsService.deleteEvent(id);
    if (this.editingEventId === id) {
      this.resetEventForm();
    }
    this.refreshEvents();
    this.ensureEventPageBounds();
  }

  submitCivility(): void {
    if (!this.isCivilityFormValid) {
      return;
    }

    if (this.editingCivilityId) {
      this.parameterSettingsService.updateCivility(this.editingCivilityId, this.civilityLabel);
    } else {
      this.parameterSettingsService.createCivility(this.civilityLabel);
    }

    this.resetCivilityForm();
    this.refreshCivilities();
  }

  editCivility(item: ParameterCivilityItem): void {
    this.openCivilityActionId = null;
    this.editingCivilityId = item.id;
    this.civilityLabel = item.label;
  }

  deleteCivility(id: string): void {
    this.openCivilityActionId = null;
    this.parameterSettingsService.deleteCivility(id);
    if (this.editingCivilityId === id) {
      this.resetCivilityForm();
    }
    this.refreshCivilities();
    this.ensureCivilityPageBounds();
  }

  submitRoom(): void {
    if (!this.isRoomFormValid) {
      return;
    }

    if (this.editingRoomId) {
      this.parameterSettingsService.updateRoom(this.editingRoomId, this.roomForm);
    } else {
      this.parameterSettingsService.createRoom(this.roomForm);
    }

    this.resetRoomForm();
    this.refreshRooms();
  }

  editRoom(item: ParameterRoomItem): void {
    this.openRoomActionId = null;
    this.editingRoomId = item.id;
    this.roomForm = {
      code: item.code,
      name: item.name,
      capacity: item.capacity,
    };
  }

  deleteRoom(id: string): void {
    this.openRoomActionId = null;
    this.parameterSettingsService.deleteRoom(id);
    if (this.editingRoomId === id) {
      this.resetRoomForm();
    }
    this.refreshRooms();
    this.ensureRoomPageBounds();
  }

  submitDocument(): void {
    if (!this.isDocumentFormValid) {
      return;
    }

    if (this.editingDocumentId) {
      this.parameterSettingsService.updateDocument(this.editingDocumentId, this.documentForm);
    } else {
      this.parameterSettingsService.createDocument(this.documentForm);
    }

    this.resetDocumentForm();
    this.refreshDocuments();
  }

  editDocument(item: ParameterDocumentItem): void {
    this.openDocumentActionId = null;
    this.editingDocumentId = item.id;
    this.documentForm = {
      label: item.label,
      levelName: item.levelNames[0] ?? '',
      type: item.type,
    };
  }

  deleteDocument(id: string): void {
    this.openDocumentActionId = null;
    this.parameterSettingsService.deleteDocument(id);
    if (this.editingDocumentId === id) {
      this.resetDocumentForm();
    }
    this.refreshDocuments();
    this.ensureDocumentPageBounds();
  }

  submitSchedule(): void {
    if (!this.isScheduleFormValid) {
      return;
    }

    if (this.editingScheduleId) {
      this.parameterSettingsService.updateSchedule(this.editingScheduleId, this.scheduleForm);
    } else {
      this.parameterSettingsService.createSchedule(this.scheduleForm);
    }

    this.resetScheduleForm();
    this.refreshSchedules();
  }

  editSchedule(item: ParameterScheduleItem): void {
    this.openScheduleActionId = null;
    this.editingScheduleId = item.id;
    this.scheduleForm = {
      label: item.label,
      levelName: item.levelNames[0] ?? '',
    };
  }

  deleteSchedule(id: string): void {
    this.openScheduleActionId = null;
    this.parameterSettingsService.deleteSchedule(id);
    if (this.editingScheduleId === id) {
      this.resetScheduleForm();
    }
    this.refreshSchedules();
    this.ensureSchedulePageBounds();
  }

  toggleEventActionMenu(id: string): void {
    this.openEventActionId = this.openEventActionId === id ? null : id;
  }

  toggleCivilityActionMenu(id: string): void {
    this.openCivilityActionId = this.openCivilityActionId === id ? null : id;
  }

  toggleRoomActionMenu(id: string): void {
    this.openRoomActionId = this.openRoomActionId === id ? null : id;
  }

  toggleDocumentActionMenu(id: string): void {
    this.openDocumentActionId = this.openDocumentActionId === id ? null : id;
  }

  toggleScheduleActionMenu(id: string): void {
    this.openScheduleActionId = this.openScheduleActionId === id ? null : id;
  }

  cancelEventEdition(): void {
    this.resetEventForm();
  }

  cancelCivilityEdition(): void {
    this.resetCivilityForm();
  }

  cancelRoomEdition(): void {
    this.resetRoomForm();
  }

  cancelDocumentEdition(): void {
    this.resetDocumentForm();
  }

  cancelScheduleEdition(): void {
    this.resetScheduleForm();
  }

  setEventPage(page: number): void {
    this.eventPage = page;
  }

  previousEventPage(): void {
    if (this.canPrevEventPage) {
      this.eventPage -= 1;
    }
  }

  nextEventPage(): void {
    if (this.canNextEventPage) {
      this.eventPage += 1;
    }
  }

  setCivilityPage(page: number): void {
    this.civilityPage = page;
  }

  previousCivilityPage(): void {
    if (this.canPrevCivilityPage) {
      this.civilityPage -= 1;
    }
  }

  nextCivilityPage(): void {
    if (this.canNextCivilityPage) {
      this.civilityPage += 1;
    }
  }

  setRoomPage(page: number): void {
    this.roomPage = page;
  }

  previousRoomPage(): void {
    if (this.canPrevRoomPage) {
      this.roomPage -= 1;
    }
  }

  nextRoomPage(): void {
    if (this.canNextRoomPage) {
      this.roomPage += 1;
    }
  }

  setDocumentPage(page: number): void {
    this.documentPage = page;
  }

  previousDocumentPage(): void {
    if (this.canPrevDocumentPage) {
      this.documentPage -= 1;
    }
  }

  nextDocumentPage(): void {
    if (this.canNextDocumentPage) {
      this.documentPage += 1;
    }
  }

  setSchedulePage(page: number): void {
    this.schedulePage = page;
  }

  previousSchedulePage(): void {
    if (this.canPrevSchedulePage) {
      this.schedulePage -= 1;
    }
  }

  nextSchedulePage(): void {
    if (this.canNextSchedulePage) {
      this.schedulePage += 1;
    }
  }

  setEventPageSize(value: string | number): void {
    const nextValue = parseAllowedNumberOption(value, this.pageSizeOptions);
    if (nextValue !== null) {
      this.eventPageSize = nextValue;
      this.eventPage = 1;
    }
  }

  setCivilityPageSize(value: string | number): void {
    const nextValue = parseAllowedNumberOption(value, this.pageSizeOptions);
    if (nextValue !== null) {
      this.civilityPageSize = nextValue;
      this.civilityPage = 1;
    }
  }

  setRoomPageSize(value: string | number): void {
    const nextValue = parseAllowedNumberOption(value, this.pageSizeOptions);
    if (nextValue !== null) {
      this.roomPageSize = nextValue;
      this.roomPage = 1;
    }
  }

  setDocumentPageSize(value: string | number): void {
    const nextValue = parseAllowedNumberOption(value, this.pageSizeOptions);
    if (nextValue !== null) {
      this.documentPageSize = nextValue;
      this.documentPage = 1;
    }
  }

  setSchedulePageSize(value: string | number): void {
    const nextValue = parseAllowedNumberOption(value, this.pageSizeOptions);
    if (nextValue !== null) {
      this.schedulePageSize = nextValue;
      this.schedulePage = 1;
    }
  }

  setRoomCapacity(value: string | number): void {
    const nextValue = parseAllowedNumberOption(value, this.roomCapacityOptions);
    if (nextValue !== null) {
      this.roomForm = {
        ...this.roomForm,
        capacity: nextValue,
      };
    }
  }

  getStatusClass(status: string): 'active' | 'pending' | 'done' | 'danger' {
    switch (status) {
      case 'En cours':
      case 'Actif':
      case 'Disponible':
        return 'active';
      case 'En attente':
        return 'pending';
      case 'Terminé':
        return 'done';
      case 'Inactif':
      case 'Indisponible':
        return 'danger';
      default:
        return 'done';
    }
  }

  getDocumentTypeClass(type: ParameterDocumentType): 'document-tag--provide' | 'document-tag--withdraw' {
    return type === 'A ramener' ? 'document-tag--provide' : 'document-tag--withdraw';
  }

  trackById(index: number, item: { id: string }): string {
    return item.id;
  }

  private loadItems(): void {
    this.refreshEvents();
    this.refreshCivilities();
    this.refreshRooms();
    this.refreshDocuments();
    this.refreshSchedules();
  }

  private refreshEvents(): void {
    this.eventItems = this.parameterSettingsService.getEventItems();
  }

  private refreshCivilities(): void {
    this.civilityItems = this.parameterSettingsService.getCivilities();
  }

  private refreshRooms(): void {
    this.roomItems = this.parameterSettingsService.getRooms();
  }

  private refreshDocuments(): void {
    this.documentItems = this.parameterSettingsService.getDocuments();
  }

  private refreshSchedules(): void {
    this.scheduleItems = this.parameterSettingsService.getSchedules();
  }

  private resetEventForm(): void {
    this.editingEventId = null;
    this.eventForm = { level: '', semester: '', name: '' };
  }

  private resetCivilityForm(): void {
    this.editingCivilityId = null;
    this.civilityLabel = '';
  }

  private resetRoomForm(): void {
    this.editingRoomId = null;
    this.roomForm = { code: '', name: '', capacity: this.roomCapacityOptions[0] ?? 20 };
  }

  private resetDocumentForm(): void {
    this.editingDocumentId = null;
    this.documentForm = {
      label: '',
      levelName: '',
      type: this.documentTypeOptions[0] ?? 'A ramener',
    };
  }

  private resetScheduleForm(): void {
    this.editingScheduleId = null;
    this.scheduleForm = { label: '', levelName: '' };
  }

  private closeActionMenus(): void {
    this.openEventActionId = null;
    this.openCivilityActionId = null;
    this.openRoomActionId = null;
    this.openDocumentActionId = null;
    this.openScheduleActionId = null;
  }

  private getTotalPages(totalItems: number, pageSize: number): number {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }

  private buildPages(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  private paginate<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }

  private ensureEventPageBounds(): void {
    if (this.eventPage > this.totalEventPages) {
      this.eventPage = this.totalEventPages;
    }
  }

  private ensureCivilityPageBounds(): void {
    if (this.civilityPage > this.totalCivilityPages) {
      this.civilityPage = this.totalCivilityPages;
    }
  }

  private ensureRoomPageBounds(): void {
    if (this.roomPage > this.totalRoomPages) {
      this.roomPage = this.totalRoomPages;
    }
  }

  private ensureDocumentPageBounds(): void {
    if (this.documentPage > this.totalDocumentPages) {
      this.documentPage = this.totalDocumentPages;
    }
  }

  private ensureSchedulePageBounds(): void {
    if (this.schedulePage > this.totalSchedulePages) {
      this.schedulePage = this.totalSchedulePages;
    }
  }
}
