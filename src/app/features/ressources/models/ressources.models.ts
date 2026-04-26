import { AcademicYear, GeneralCalendarEntry, SpecialtyCatalogItem, SpecialtySectionKey, TrackedEvent } from '../services/ressources.service';

/**
 * Academic Years page models
 */
export interface AcademicYearsFilter {
  searchTerm: string;
}

/**
 * Tracked Events page models
 */
export interface TrackedEventForm {
  level: string;
  semester: string;
  name: string;
}

export interface TrackedEventsState {
  editingId: string | null;
  form: TrackedEventForm;
}

/**
 * General Calendar page models
 */
export interface GeneralCalendarFilter {
  level: string;
  semester: string;
  eventName: string;
}

export interface GeneralCalendarState {
  editingId: string | null;
  filters: GeneralCalendarFilter;
  appliedFilters: GeneralCalendarFilter;
}

/**
 * Specialty Catalog page models
 */
export interface SpecialtyCatalogForm {
  category: SpecialtySectionKey;
  name: string;
  domainName?: string;
  status: 'Actif' | 'Inactif';
}

export interface SpecialtyCatalogState {
  editingId: string | null;
  form: SpecialtyCatalogForm;
}