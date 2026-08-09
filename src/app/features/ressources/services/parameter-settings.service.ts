import { Injectable } from '@angular/core';
import { APP_DATA } from '../../../shared/data';
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
} from '../models';

interface ParameterSettingsDataSource {
  levelOptions?: string[];
  semesterOptions?: string[];
  pageSizeOptions?: number[];
  parameterTabs?: ResourceParameterTab[];
  parameterLevelOptions?: string[];
  parameterSemesterOptions?: string[];
  parameterRoomCapacityOptions?: number[];
  parameterDocumentTypeOptions?: ParameterDocumentType[];
  parameterEventItems?: ParameterEventItem[];
  parameterCivilities?: ParameterCivilityItem[];
  parameterRooms?: ParameterRoomItem[];
  parameterDocuments?: ParameterDocumentItem[];
  parameterSchedules?: ParameterScheduleItem[];
}

const RESSOURCES_DATA = APP_DATA.features.ressources as ParameterSettingsDataSource;

@Injectable({
  providedIn: 'root',
})
export class ParameterSettingsService {
  private eventItems: ParameterEventItem[] = structuredClone(
    RESSOURCES_DATA.parameterEventItems ?? [],
  );
  private civilityItems: ParameterCivilityItem[] = structuredClone(
    RESSOURCES_DATA.parameterCivilities ?? [],
  );
  private roomItems: ParameterRoomItem[] = structuredClone(RESSOURCES_DATA.parameterRooms ?? []);
  private documentItems: ParameterDocumentItem[] = structuredClone(
    RESSOURCES_DATA.parameterDocuments ?? [],
  );
  private scheduleItems: ParameterScheduleItem[] = structuredClone(
    RESSOURCES_DATA.parameterSchedules ?? [],
  );

  private nextEventId = this.eventItems.length + 1;
  private nextCivilityId = this.civilityItems.length + 1;
  private nextRoomId = this.roomItems.length + 1;
  private nextDocumentId = this.documentItems.length + 1;
  private nextScheduleId = this.scheduleItems.length + 1;

  get config(): Readonly<{
    tabs: ResourceParameterTab[];
    levelOptions: string[];
    semesterOptions: string[];
    roomCapacityOptions: number[];
    documentTypeOptions: ParameterDocumentType[];
    pageSizeOptions: number[];
  }> {
    return Object.freeze({
      tabs: RESSOURCES_DATA.parameterTabs ?? [
        'Événements',
        'Civilité',
        'Salles',
        'Documents',
        'Horaires',
      ],
      levelOptions: RESSOURCES_DATA.parameterLevelOptions ??
        RESSOURCES_DATA.levelOptions ?? ['Licence', 'Master 1', 'Master 2'],
      semesterOptions: RESSOURCES_DATA.parameterSemesterOptions ??
        RESSOURCES_DATA.semesterOptions ?? ['Semestre 1', 'Semestre 2'],
      roomCapacityOptions: RESSOURCES_DATA.parameterRoomCapacityOptions ?? [20, 30, 40, 50, 60],
      documentTypeOptions: RESSOURCES_DATA.parameterDocumentTypeOptions ?? [
        'A ramener',
        'A retirer',
      ],
      pageSizeOptions: RESSOURCES_DATA.pageSizeOptions ?? [5, 10, 15],
    });
  }

  getEventItems(): ParameterEventItem[] {
    return [...this.eventItems];
  }

  createEvent(form: ParameterEventForm): ParameterEventItem {
    const item: ParameterEventItem = {
      id: `${this.nextEventId}`,
      level: form.level.trim(),
      semester: form.semester.trim(),
      name: form.name.trim(),
      status: 'En attente',
    };

    this.nextEventId += 1;
    this.eventItems.unshift(item);
    return item;
  }

  updateEvent(id: string, form: ParameterEventForm): ParameterEventItem | undefined {
    const index = this.eventItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.eventItems[index] = {
      ...this.eventItems[index],
      level: form.level.trim(),
      semester: form.semester.trim(),
      name: form.name.trim(),
    };

    return this.eventItems[index];
  }

  deleteEvent(id: string): boolean {
    return this.deleteById(this.eventItems, id);
  }

  getCivilities(): ParameterCivilityItem[] {
    return [...this.civilityItems];
  }

  createCivility(label: string): ParameterCivilityItem {
    const item: ParameterCivilityItem = {
      id: `${this.nextCivilityId}`,
      label: label.trim(),
      status: 'Actif',
    };

    this.nextCivilityId += 1;
    this.civilityItems.unshift(item);
    return item;
  }

  updateCivility(id: string, label: string): ParameterCivilityItem | undefined {
    const index = this.civilityItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.civilityItems[index] = {
      ...this.civilityItems[index],
      label: label.trim(),
    };

    return this.civilityItems[index];
  }

  deleteCivility(id: string): boolean {
    return this.deleteById(this.civilityItems, id);
  }

  getRooms(): ParameterRoomItem[] {
    return [...this.roomItems];
  }

  createRoom(form: ParameterRoomForm): ParameterRoomItem {
    const item: ParameterRoomItem = {
      id: `${this.nextRoomId}`,
      code: form.code.trim(),
      name: form.name.trim(),
      capacity: form.capacity,
      status: 'Disponible',
    };

    this.nextRoomId += 1;
    this.roomItems.unshift(item);
    return item;
  }

  updateRoom(id: string, form: ParameterRoomForm): ParameterRoomItem | undefined {
    const index = this.roomItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.roomItems[index] = {
      ...this.roomItems[index],
      code: form.code.trim(),
      name: form.name.trim(),
      capacity: form.capacity,
    };

    return this.roomItems[index];
  }

  deleteRoom(id: string): boolean {
    return this.deleteById(this.roomItems, id);
  }

  getDocuments(): ParameterDocumentItem[] {
    return [...this.documentItems];
  }

  createDocument(form: ParameterDocumentForm): ParameterDocumentItem {
    const item: ParameterDocumentItem = {
      id: `${this.nextDocumentId}`,
      label: form.label.trim(),
      levelNames: [form.levelName.trim()],
      type: form.type,
      status: 'Disponible',
    };

    this.nextDocumentId += 1;
    this.documentItems.unshift(item);
    return item;
  }

  updateDocument(id: string, form: ParameterDocumentForm): ParameterDocumentItem | undefined {
    const index = this.documentItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.documentItems[index] = {
      ...this.documentItems[index],
      label: form.label.trim(),
      levelNames: [form.levelName.trim()],
      type: form.type,
    };

    return this.documentItems[index];
  }

  deleteDocument(id: string): boolean {
    return this.deleteById(this.documentItems, id);
  }

  getSchedules(): ParameterScheduleItem[] {
    return [...this.scheduleItems];
  }

  createSchedule(form: ParameterScheduleForm): ParameterScheduleItem {
    const item: ParameterScheduleItem = {
      id: `${this.nextScheduleId}`,
      label: form.label.trim(),
      levelNames: [form.levelName.trim()],
      status: 'Disponible',
    };

    this.nextScheduleId += 1;
    this.scheduleItems.unshift(item);
    return item;
  }

  updateSchedule(id: string, form: ParameterScheduleForm): ParameterScheduleItem | undefined {
    const index = this.scheduleItems.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }

    this.scheduleItems[index] = {
      ...this.scheduleItems[index],
      label: form.label.trim(),
      levelNames: [form.levelName.trim()],
    };

    return this.scheduleItems[index];
  }

  deleteSchedule(id: string): boolean {
    return this.deleteById(this.scheduleItems, id);
  }

  private deleteById<T extends { id: string }>(items: T[], id: string): boolean {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    items.splice(index, 1);
    return true;
  }
}
