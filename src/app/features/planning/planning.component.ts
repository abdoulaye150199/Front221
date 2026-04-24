import { Component, OnInit } from '@angular/core';
import { APP_DATA } from '../../shared/data';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { SelectOption } from '../../shared/models';

type SessionStatus = 'en_cours' | 'planifie' | 'termine' | 'annule';
type StatusValue = 'tous' | SessionStatus;
type ModalMode = 'create' | 'details';

interface SessionItem {
  id: string;
  title: string;
  time: string;
  teacher: string;
  classLabel: string;
  status: SessionStatus;
  dayIndex: number;
  slot: string;
}

interface StatusItem {
  value: StatusValue;
  label: string;
  color: string;
}

interface SessionStatusItem {
  value: SessionStatus;
  label: string;
  color: string;
}

interface WeekDayItem {
  label: string;
  date: number;
  isNextMonth: boolean;
}

interface ModalFormModel {
  module: string;
  class: string;
  teacher: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
}

interface SessionDetailsDefaults {
  room: string;
  date: string;
  endTime: string;
}

interface PlanningDataSource {
  currentDate: string;
  monthNames: string[];
  classes: SelectOption[];
  modules: SelectOption[];
  statuses: StatusItem[];
  sessionStatusOptions: SessionStatusItem[];
  weekDays: WeekDayItem[];
  timeSlots: string[];
  modalModules: SelectOption[];
  modalClasses: SelectOption[];
  modalTeachers: SelectOption[];
  modalRooms: SelectOption[];
  timeOptions: string[];
  defaultModalForm: ModalFormModel;
  sessionDetailsDefaults: SessionDetailsDefaults;
  sessions: SessionItem[];
}

const planningData = APP_DATA.features.planning as PlanningDataSource;

function createDefaultModalForm(): ModalFormModel {
  return structuredClone(planningData.defaultModalForm);
}

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './planning.html',
  styleUrl: './planning.scss',
})
export class PlanningComponent implements OnInit {
  currentDate: Date = new Date(planningData.currentDate);
  monthName = '';
  yearNumber = this.currentDate.getFullYear();
  viewMode: 'mois' | 'semaine' | 'jour' = 'semaine';

  selectedClass = planningData.classes[0]?.value ?? '';
  selectedModule = planningData.modules[0]?.value ?? '';
  selectedStatus = (planningData.statuses[0]?.value ?? 'tous') as StatusValue;

  readonly classes = planningData.classes;
  readonly modules = planningData.modules;
  readonly statuses = planningData.statuses;
  readonly sessionStatusOptions = planningData.sessionStatusOptions;
  readonly weekDays = planningData.weekDays;
  readonly timeSlots = planningData.timeSlots;
  readonly modalModules = planningData.modalModules;
  readonly modalClasses = planningData.modalClasses;
  readonly modalTeachers = planningData.modalTeachers;
  readonly modalRooms = planningData.modalRooms;
  readonly timeOptions = planningData.timeOptions;
  readonly sessions = planningData.sessions;

  isModalOpen = false;
  modalMode: ModalMode = 'create';
  modalForm: ModalFormModel = createDefaultModalForm();

  private readonly monthNames = planningData.monthNames;
  private readonly sessionDetailsDefaults = planningData.sessionDetailsDefaults;
  private sessionMap: Record<string, SessionItem> = {};

  ngOnInit() {
    this.updateMonthLabel();
    this.buildSessionMap();
  }

  updateMonthLabel() {
    this.monthName = this.monthNames[this.currentDate.getMonth()];
    this.yearNumber = this.currentDate.getFullYear();
  }

  buildSessionMap() {
    this.sessionMap = {};
    this.sessions.forEach(session => {
      this.sessionMap[`${session.dayIndex}-${session.slot}`] = session;
    });
  }

  getSession(dayIndex: number, slot: string): SessionItem | null {
    return this.sessionMap[`${dayIndex}-${slot}`] ?? null;
  }

  getStatusLabel(value: SessionStatus): string {
    return this.sessionStatusOptions.find(status => status.value === value)?.label ?? '';
  }

  getStatusColor(value: SessionStatus): string {
    return this.sessionStatusOptions.find(status => status.value === value)?.color ?? '#9ca3af';
  }

  formatDay(day: number): string {
    return day.toString().padStart(2, '0');
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentDate = new Date(this.currentDate);
    this.updateMonthLabel();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.currentDate = new Date(this.currentDate);
    this.updateMonthLabel();
  }

  addSession() {
    this.openModal('create');
  }

  openModal(mode: ModalMode, session?: SessionItem) {
    this.modalMode = mode;

    if (mode === 'details' && session) {
      this.modalForm = {
        module: session.title,
        class: session.classLabel,
        teacher: session.teacher,
        room: this.sessionDetailsDefaults.room,
        date: this.sessionDetailsDefaults.date,
        startTime: session.slot,
        endTime: this.sessionDetailsDefaults.endTime,
        status: session.status,
      };
    } else {
      this.modalForm = createDefaultModalForm();
    }

    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  setModalStatus(status: SessionStatus) {
    this.modalForm = { ...this.modalForm, status };
  }
}
