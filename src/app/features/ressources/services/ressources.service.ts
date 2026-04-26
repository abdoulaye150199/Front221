import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APP_DATA } from '../../../shared/data';

/**
 * Academic Year model
 */
export interface AcademicYear {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  semester: string;
  students: number;
  courses: number;
  status: 'En cours' | 'Terminé';
}

/**
 * Tracked Event model
 */
export interface TrackedEvent {
  id: string;
  level: string;
  semester: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'À venir' | 'Terminé';
}

/**
 * General Calendar Entry model
 */
export interface GeneralCalendarEntry {
  id: string;
  level: string;
  semester: string;
  eventName: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'En attente' | 'Terminé';
}

/**
 * Specialty Catalog Item model
 */
export interface SpecialtyCatalogItem {
  id: string;
  category: SpecialtySectionKey;
  name: string;
  domainName?: string;
  status: 'Actif' | 'Inactif';
}

export type SpecialtySectionKey =
  | 'Domaines'
  | 'Mention'
  | 'Spécialité'
  | 'Cycle'
  | 'Niveau'
  | 'Semestres';

/**
 * Resource Tab model
 */
export interface ResourceTab {
  title: string;
  subtitle?: string;
  icon: string;
}

/**
 * Ressources data source interface
 */
export interface RessourcesDataSource {
  mainTabs: ResourceTab[];
  subTabs: string[];
  specialityTabs: SpecialtySectionKey[];
  levelOptions: string[];
  semesterOptions: string[];
  pageSizeOptions: number[];
  academicYears: AcademicYear[];
  trackedEvents: TrackedEvent[];
  generalCalendarEntries: GeneralCalendarEntry[];
  specialityCatalogItems: SpecialtyCatalogItem[];
}

/**
 * Ressources Service
 * Manages application resources data (academic years, events, calendar, specialties)
 */
@Injectable({
  providedIn: 'root',
})
export class RessourcesService {
  private readonly data = APP_DATA.features.ressources as RessourcesDataSource;

  private readonly academicYearsSubject = new BehaviorSubject<AcademicYear[]>(
    this.deepClone(this.data.academicYears)
  );
  private readonly trackedEventsSubject = new BehaviorSubject<TrackedEvent[]>(
    this.deepClone(this.data.trackedEvents)
  );
  private readonly generalCalendarSubject = new BehaviorSubject<GeneralCalendarEntry[]>(
    this.deepClone(this.data.generalCalendarEntries)
  );
  private readonly specialtyCatalogSubject = new BehaviorSubject<SpecialtyCatalogItem[]>(
    this.deepClone(this.data.specialityCatalogItems)
  );

  // Observables
  public academicYears$: Observable<AcademicYear[]> = this.academicYearsSubject.asObservable();
  public trackedEvents$: Observable<TrackedEvent[]> = this.trackedEventsSubject.asObservable();
  public generalCalendar$: Observable<GeneralCalendarEntry[]> = this.generalCalendarSubject.asObservable();
  public specialtyCatalog$: Observable<SpecialtyCatalogItem[]> = this.specialtyCatalogSubject.asObservable();

  /**
   * Get configuration data
   */
  get config(): Readonly<{
    mainTabs: ResourceTab[];
    subTabs: string[];
    specialityTabs: SpecialtySectionKey[];
    levelOptions: string[];
    semesterOptions: string[];
    pageSizeOptions: number[];
  }> {
    return Object.freeze({
      mainTabs: this.data.mainTabs,
      subTabs: this.data.subTabs,
      specialityTabs: this.data.specialityTabs,
      levelOptions: this.data.levelOptions,
      semesterOptions: this.data.semesterOptions,
      pageSizeOptions: this.data.pageSizeOptions,
    });
  }

  /**
   * Get current academic years
   */
  getAcademicYears(): AcademicYear[] {
    return this.academicYearsSubject.value;
  }

  /**
   * Add academic year
   */
  addAcademicYear(year: Omit<AcademicYear, 'id'>): void {
    const newYear: AcademicYear = {
      ...year,
      id: this.generateId(),
    };
    const updated = [...this.getAcademicYears(), newYear];
    this.academicYearsSubject.next(updated);
  }

  /**
   * Update academic year
   */
  updateAcademicYear(id: string, updates: Partial<AcademicYear>): void {
    const current = this.getAcademicYears();
    const updated = current.map(year =>
      year.id === id ? { ...year, ...updates } : year
    );
    this.academicYearsSubject.next(updated);
  }

  /**
   * Delete academic year
   */
  deleteAcademicYear(id: string): void {
    const updated = this.getAcademicYears().filter(year => year.id !== id);
    this.academicYearsSubject.next(updated);
  }

  /**
   * Get current tracked events
   */
  getTrackedEvents(): TrackedEvent[] {
    return this.trackedEventsSubject.value;
  }

  /**
   * Add tracked event
   */
  addTrackedEvent(event: Omit<TrackedEvent, 'id'>): void {
    const newEvent: TrackedEvent = {
      ...event,
      id: this.generateId(),
    };
    const updated = [...this.getTrackedEvents(), newEvent];
    this.trackedEventsSubject.next(updated);
  }

  /**
   * Update tracked event
   */
  updateTrackedEvent(id: string, updates: Partial<TrackedEvent>): void {
    const current = this.getTrackedEvents();
    const updated = current.map(event =>
      event.id === id ? { ...event, ...updates } : event
    );
    this.trackedEventsSubject.next(updated);
  }

  /**
   * Delete tracked event
   */
  deleteTrackedEvent(id: string): void {
    const updated = this.getTrackedEvents().filter(event => event.id !== id);
    this.trackedEventsSubject.next(updated);
  }

  /**
   * Get current general calendar entries
   */
  getGeneralCalendarEntries(): GeneralCalendarEntry[] {
    return this.generalCalendarSubject.value;
  }

  /**
   * Add general calendar entry
   */
  addGeneralCalendarEntry(entry: Omit<GeneralCalendarEntry, 'id'>): void {
    const newEntry: GeneralCalendarEntry = {
      ...entry,
      id: this.generateId(),
    };
    const updated = [...this.getGeneralCalendarEntries(), newEntry];
    this.generalCalendarSubject.next(updated);
  }

  /**
   * Update general calendar entry
   */
  updateGeneralCalendarEntry(id: string, updates: Partial<GeneralCalendarEntry>): void {
    const current = this.getGeneralCalendarEntries();
    const updated = current.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    );
    this.generalCalendarSubject.next(updated);
  }

  /**
   * Delete general calendar entry
   */
  deleteGeneralCalendarEntry(id: string): void {
    const updated = this.getGeneralCalendarEntries().filter(entry => entry.id !== id);
    this.generalCalendarSubject.next(updated);
  }

  /**
   * Get current specialty catalog items
   */
  getSpecialtyCatalogItems(): SpecialtyCatalogItem[] {
    return this.specialtyCatalogSubject.value;
  }

  /**
   * Add specialty catalog item
   */
  addSpecialtyCatalogItem(item: Omit<SpecialtyCatalogItem, 'id'>): void {
    const newItem: SpecialtyCatalogItem = {
      ...item,
      id: this.generateId(),
    };
    const updated = [...this.getSpecialtyCatalogItems(), newItem];
    this.specialtyCatalogSubject.next(updated);
  }

  /**
   * Update specialty catalog item
   */
  updateSpecialtyCatalogItem(id: string, updates: Partial<SpecialtyCatalogItem>): void {
    const current = this.getSpecialtyCatalogItems();
    const updated = current.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    this.specialtyCatalogSubject.next(updated);
  }

  /**
   * Delete specialty catalog item
   */
  deleteSpecialtyCatalogItem(id: string): void {
    const updated = this.getSpecialtyCatalogItems().filter(item => item.id !== id);
    this.specialtyCatalogSubject.next(updated);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Deep clone object
   */
  private deepClone<T>(obj: T): T {
    try {
      return structuredClone(obj);
    } catch {
      // Fallback for browsers that don't support structuredClone
      return JSON.parse(JSON.stringify(obj));
    }
  }
}