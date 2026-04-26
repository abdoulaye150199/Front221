export interface TrackedEvent {
  id: string;
  level: string;
  semester: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'À venir' | 'Terminé';
}

export interface TrackedEventForm {
  level: string;
  semester: string;
  name: string;
}

export interface TrackedEventsState {
  items: TrackedEvent[];
  page: number;
  pageSize: number;
  editingId: string | null;
  form: TrackedEventForm;
}

export type TrackedEventStatus = TrackedEvent['status'];
