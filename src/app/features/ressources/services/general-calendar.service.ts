import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { GeneralCalendarEntry, GeneralCalendarFilter } from '../models';

const RESSOURCES_DATA = APP_DATA.features.ressources as {
  generalCalendarEntries: GeneralCalendarEntry[];
};

@Injectable({
  providedIn: 'root',
})
export class GeneralCalendarService {
  private entries: GeneralCalendarEntry[];

  constructor() {
    this.entries = [...structuredClone(RESSOURCES_DATA.generalCalendarEntries)];
  }

  getAll(): GeneralCalendarEntry[] {
    return [...this.entries];
  }

  getById(id: string): GeneralCalendarEntry | undefined {
    return this.entries.find(entry => entry.id === id);
  }

  update(id: string, filters: Partial<GeneralCalendarFilter>): GeneralCalendarEntry | undefined {
    const index = this.entries.findIndex(entry => entry.id === id);
    if (index === -1) {
      return undefined;
    }
    this.entries[index] = {
      ...this.entries[index],
      ...filters,
    } as GeneralCalendarEntry;
    return this.entries[index];
  }

  delete(id: string): boolean {
    const initialLength = this.entries.length;
    this.entries = this.entries.filter(entry => entry.id !== id);
    return this.entries.length < initialLength;
  }

  filter(filters: GeneralCalendarFilter): GeneralCalendarEntry[] {
    return this.entries.filter(entry => {
      const levelMatch = !filters.level || entry.level === filters.level;
      const semesterMatch = !filters.semester || entry.semester === filters.semester;
      const eventMatch = !filters.eventName || entry.eventName === filters.eventName;
      return levelMatch && semesterMatch && eventMatch;
    });
  }

  getEventNames(): string[] {
    return [...new Set(this.entries.map(entry => entry.eventName))];
  }
}
