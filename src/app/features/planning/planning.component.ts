import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './planning.html',
  styleUrl: './planning.scss',
})
export class PlanningComponent implements OnInit {
  currentDate: Date = new Date(2025, 0, 1);
  monthName = 'Janvier';
  yearNumber = 2025;
  viewMode: 'mois' | 'semaine' | 'jour' = 'semaine';

  selectedClass: string = 'toutes';
  selectedModule: string = 'tous';
  selectedStatus: StatusValue = 'tous';

  classes = [
    { value: 'toutes', label: 'Toutes les classes' },
    { value: 'L1', label: 'L1 - Informatique' },
    { value: 'L2', label: 'L2 - Informatique' },
    { value: 'L3', label: 'L3 - Informatique' },
  ];

  modules = [
    { value: 'tous', label: 'Tous les modules' },
    { value: 'web', label: 'Développement Web' },
    { value: 'mobile', label: 'Développement Mobile' },
    { value: 'ai', label: 'Intelligence Artificielle' },
    { value: 'bd', label: 'Base de Données' },
  ];

  statuses: StatusItem[] = [
    { value: 'tous', label: 'Tous statuts', color: '#111827' },
    { value: 'en_cours', label: 'En cours', color: '#10b981' },
    { value: 'planifie', label: 'Planifié', color: '#f59e0b' },
    { value: 'termine', label: 'Terminé', color: '#9ca3af' },
    { value: 'annule', label: 'Annulé', color: '#f87171' },
  ];

  sessionStatusOptions: SessionStatusItem[] = [
    { value: 'en_cours', label: 'En cours', color: '#10b981' },
    { value: 'planifie', label: 'Planifié', color: '#f59e0b' },
    { value: 'termine', label: 'Terminé', color: '#9ca3af' },
    { value: 'annule', label: 'Annulé', color: '#f87171' },
  ];

  weekDays = [
    { label: 'Lundi', date: 27, isNextMonth: false },
    { label: 'Mardi', date: 28, isNextMonth: false },
    { label: 'Mercredi', date: 29, isNextMonth: false },
    { label: 'Jeudi', date: 30, isNextMonth: false },
    { label: 'Vendredi', date: 31, isNextMonth: false },
    { label: 'Samedi', date: 1, isNextMonth: true },
    { label: 'Dimanche', date: 2, isNextMonth: true },
  ];

  timeSlots = ['08:00', '09:00', '10:00'];

  modalModules = [
    { value: '', label: 'Sélectionner' },
    { value: 'Algorithme & programmation', label: 'Algorithme & programmation' },
    { value: 'Soft Skills', label: 'Soft Skills' },
    { value: 'Droit public', label: 'Droit public' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Wordpress', label: 'Wordpress' },
    { value: 'Gestion de projet agile SCRUM', label: 'Gestion de projet agile SCRUM' },
  ];

  modalClasses = [
    { value: '', label: 'Sélectionner' },
    { value: 'L1 DEV WEB', label: 'L1 DEV WEB' },
    { value: 'L1 GRH', label: 'L1 GRH' },
    { value: 'L1 Droit public', label: 'L1 Droit public' },
    { value: 'L1 Ref Dig', label: 'L1 Ref Dig' },
    { value: 'L2 Ref Dig', label: 'L2 Ref Dig' },
  ];

  modalTeachers = [
    { value: '', label: 'Sélectionner' },
    { value: 'Birane B. Wane', label: 'Birane B. Wane' },
    { value: 'Fatou Sall', label: 'Fatou Sall' },
    { value: 'Moussa Ndiaye', label: 'Moussa Ndiaye' },
    { value: 'Aïssatou Diop', label: 'Aïssatou Diop' },
    { value: 'Aminata Sy', label: 'Aminata Sy' },
    { value: 'Ibrahima Fall', label: 'Ibrahima Fall' },
  ];

  modalRooms = [
    { value: '', label: 'Sélectionner' },
    { value: 'Amphi 1', label: 'Amphi 1' },
    { value: 'Salle A', label: 'Salle A' },
    { value: 'Salle B', label: 'Salle B' },
  ];

  timeOptions = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00'];

  isModalOpen = false;
  modalMode: ModalMode = 'create';
  modalForm = {
    module: '',
    class: '',
    teacher: '',
    room: '',
    date: '01/02/2025',
    startTime: '09:00',
    endTime: '11:00',
    status: 'planifie' as SessionStatus,
  };

  sessions: SessionItem[] = [
    {
      id: '1',
      title: 'Algorithme & programmation',
      time: '08:00 à 12:00',
      teacher: 'Birane B. Wane',
      classLabel: 'L1 DEV WEB',
      status: 'en_cours',
      dayIndex: 0,
      slot: '08:00',
    },
    {
      id: '2',
      title: 'Soft Skills',
      time: '08:00 à 12:00',
      teacher: 'Birane B. Wane',
      classLabel: 'L1 GRH',
      status: 'planifie',
      dayIndex: 1,
      slot: '08:00',
    },
    {
      id: '3',
      title: 'Droit public',
      time: '08:00 à 12:00',
      teacher: 'Birane B. Wane',
      classLabel: 'L1 Droit p...',
      status: 'planifie',
      dayIndex: 2,
      slot: '08:00',
    },
    {
      id: '4',
      title: 'UI/UX Design',
      time: '08:00 à 12:00',
      teacher: 'Fatou Sall',
      classLabel: 'L1 Ref Dig',
      status: 'termine',
      dayIndex: 3,
      slot: '08:00',
    },
    {
      id: '5',
      title: 'Wordpress',
      time: '08:00 à 12:00',
      teacher: 'Moussa Ndiaye',
      classLabel: 'L2 Ref Dig',
      status: 'planifie',
      dayIndex: 4,
      slot: '08:00',
    },
    {
      id: '6',
      title: 'Gestion de projet agile SCRUM',
      time: '08:00 à 12:00',
      teacher: 'Ibrahima Fall',
      classLabel: 'L2 Ref Dig',
      status: 'planifie',
      dayIndex: 5,
      slot: '08:00',
    },
    {
      id: '7',
      title: 'Algorithme & programmation',
      time: '09:00 à 13:00',
      teacher: 'Birane B. Wane',
      classLabel: 'L1 DEV WEB',
      status: 'planifie',
      dayIndex: 0,
      slot: '09:00',
    },
    {
      id: '8',
      title: 'Soft Skills',
      time: '09:00 à 13:00',
      teacher: 'Aminata Sy',
      classLabel: 'L1 GRH',
      status: 'planifie',
      dayIndex: 1,
      slot: '09:00',
    },
    {
      id: '9',
      title: 'Droit public',
      time: '09:00 à 13:00',
      teacher: 'Aïssatou Diop',
      classLabel: 'L1 Droit p...',
      status: 'annule',
      dayIndex: 2,
      slot: '09:00',
    },
    {
      id: '10',
      title: 'UI/UX Design',
      time: '09:00 à 13:00',
      teacher: 'Fatou Sall',
      classLabel: 'L1 Ref Dig',
      status: 'planifie',
      dayIndex: 3,
      slot: '09:00',
    },
    {
      id: '11',
      title: 'Wordpress',
      time: '09:00 à 13:00',
      teacher: 'Moussa Ndiaye',
      classLabel: 'L2 Ref Dig',
      status: 'planifie',
      dayIndex: 4,
      slot: '09:00',
    },
    {
      id: '12',
      title: 'Droit public',
      time: '10:00 à 14:00',
      teacher: 'Birane B. Wane',
      classLabel: 'L1 Droit p...',
      status: 'termine',
      dayIndex: 0,
      slot: '10:00',
    },
    {
      id: '13',
      title: 'UI/UX Design',
      time: '10:00 à 14:00',
      teacher: 'Fatou Sall',
      classLabel: 'L1 Ref Dig',
      status: 'planifie',
      dayIndex: 1,
      slot: '10:00',
    },
    {
      id: '14',
      title: 'Wordpress',
      time: '10:00 à 14:00',
      teacher: 'Moussa Ndiaye',
      classLabel: 'L2 Ref Dig',
      status: 'planifie',
      dayIndex: 2,
      slot: '10:00',
    },
  ];

  private sessionMap: Record<string, SessionItem> = {};

  ngOnInit() {
    this.updateMonthLabel();
    this.buildSessionMap();
  }

  updateMonthLabel() {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];
    this.monthName = months[this.currentDate.getMonth()];
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
        room: 'Amphi 1',
        date: '29/01/2025',
        startTime: session.slot,
        endTime: '12:00',
        status: session.status,
      };
    } else {
      this.modalForm = {
        module: '',
        class: '',
        teacher: '',
        room: '',
        date: '01/02/2025',
        startTime: '09:00',
        endTime: '11:00',
        status: 'planifie',
      };
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
