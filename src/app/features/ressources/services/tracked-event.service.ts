import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
import { TrackedEvent, TrackedEventForm } from '../models';

const RESSOURCES_DATA = APP_DATA.features.ressources as {
  trackedEvents: TrackedEvent[];
};

@Injectable({
  providedIn: 'root',
})
export class TrackedEventService {
  private trackedEvents: TrackedEvent[];
  private nextId: number;

  constructor() {
    this.trackedEvents = [...structuredClone(RESSOURCES_DATA.trackedEvents)];
    this.nextId = this.trackedEvents.length + 1;
  }

  getAll(): TrackedEvent[] {
    return [...this.trackedEvents];
  }

  getById(id: string): TrackedEvent | undefined {
    return this.trackedEvents.find(event => event.id === id);
  }

  create(form: TrackedEventForm): TrackedEvent {
    const defaultWindow = this.getDefaultEventWindow(form.semester);
    const newEvent: TrackedEvent = {
      id: `${this.nextId}`,
      level: form.level,
      semester: form.semester,
      name: form.name.trim(),
      startDate: defaultWindow.startDate,
      endDate: defaultWindow.endDate,
      status: 'En cours',
    };
    this.trackedEvents.unshift(newEvent);
    this.nextId += 1;
    return newEvent;
  }

  update(id: string, form: TrackedEventForm): TrackedEvent | undefined {
    const index = this.trackedEvents.findIndex(event => event.id === id);
    if (index === -1) {
      return undefined;
    }
    this.trackedEvents[index] = {
      ...this.trackedEvents[index],
      level: form.level,
      semester: form.semester,
      name: form.name.trim(),
    };
    return this.trackedEvents[index];
  }

  delete(id: string): boolean {
    const initialLength = this.trackedEvents.length;
    this.trackedEvents = this.trackedEvents.filter(event => event.id !== id);
    return this.trackedEvents.length < initialLength;
  }

  private getDefaultEventWindow(semester: string): { startDate: string; endDate: string } {
    switch (semester) {
      case 'Semestre 1':
        return { startDate: '07/10/2024', endDate: '10/10/2024' };
      case 'Semestre 2':
        return { startDate: '17/02/2025', endDate: '20/02/2025' };
      case 'Session intensive':
        return { startDate: '05/05/2025', endDate: '09/05/2025' };
      default:
        return { startDate: '--/--/----', endDate: '--/--/----' };
    }
  }
}
