export interface GeneralCalendarEntry {
  id: string;
  level: string;
  semester: string;
  eventName: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'En attente' | 'Terminé';
}

export interface GeneralCalendarFilter {
  level: string;
  semester: string;
  eventName: string;
}

export interface GeneralCalendarState {
  items: GeneralCalendarEntry[];
  page: number;
  pageSize: number;
  filters: GeneralCalendarFilter;
  appliedFilters: GeneralCalendarFilter;
  editingId: string | null;
}

export type CalendarEntryStatus = GeneralCalendarEntry['status'];
