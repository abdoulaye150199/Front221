export type ResourceParameterTab = 'Événements' | 'Civilité' | 'Salles' | 'Documents' | 'Horaires';

export type ParameterEventStatus = 'En cours' | 'En attente' | 'Terminé';
export type ParameterCivilityStatus = 'Actif' | 'Inactif';
export type ParameterAvailabilityStatus = 'Disponible' | 'Indisponible';
export type ParameterDocumentType = 'A ramener' | 'A retirer';

export interface ParameterEventItem {
  id: string;
  level: string;
  semester: string;
  name: string;
  status: ParameterEventStatus;
}

export interface ParameterCivilityItem {
  id: string;
  label: string;
  status: ParameterCivilityStatus;
}

export interface ParameterRoomItem {
  id: string;
  code: string;
  name: string;
  capacity: number;
  status: ParameterAvailabilityStatus;
}

export interface ParameterDocumentItem {
  id: string;
  label: string;
  levelNames: string[];
  type: ParameterDocumentType;
  status: ParameterAvailabilityStatus;
}

export interface ParameterScheduleItem {
  id: string;
  label: string;
  levelNames: string[];
  status: ParameterAvailabilityStatus;
}

export interface ParameterEventForm {
  level: string;
  semester: string;
  name: string;
}

export interface ParameterRoomForm {
  code: string;
  name: string;
  capacity: number;
}

export interface ParameterDocumentForm {
  label: string;
  levelName: string;
  type: ParameterDocumentType;
}

export interface ParameterScheduleForm {
  label: string;
  levelName: string;
}
