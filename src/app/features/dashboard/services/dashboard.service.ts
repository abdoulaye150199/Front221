import { Injectable } from '@angular/core';
import { Event } from '../../../shared/components/event-card/event-card';
import { Course } from '../../../shared/components/course-card/course-card';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  getEvents(): Event[] {
    return [
      {
        id: '1',
        title: 'Examen Final - Développement Web',
        date: '25 Jan 2025',
        time: '09:00 - 12:00',
        location: 'Salle A101',
        icon: 'assignment',
        color: '#dc2626',
      },
      {
        id: '2',
        title: 'Conférence Tech Innovation',
        date: '28 Jan 2025',
        time: '14:00 - 17:00',
        location: 'Amphithéâtre',
        icon: 'school',
        color: '#f59e0b',
      },
      {
        id: '3',
        title: 'Réunion Pédagogique',
        date: '30 Jan 2025',
        time: '10:00 - 11:30',
        location: 'Salle de Réunion',
        icon: 'group',
        color: '#10b981',
      },
      {
        id: '4',
        title: 'Journée Portes Ouvertes',
        date: '02 Fév 2025',
        time: '08:00 - 18:00',
        location: 'Campus Principal',
        icon: 'calendar_today',
        color: '#8b5cf6',
      },
    ];
  }

  getCourses(): Course[] {
    return [
      {
        id: '1',
        title: 'Développement Web Avancé',
        instructor: 'Dr. Fatou Sall',
        time: '14:00',
        dayOfWeek: 'Aujourd\'hui',
        room: 'Salle B203',
        students: 45,
        icon: 'book',
        color: '#f59e0b',
      },
      {
        id: '2',
        title: 'Intelligence Artificielle',
        instructor: 'Prof. Moussa Ndiaye',
        time: '09:00',
        dayOfWeek: 'Demain',
        room: 'Salle A105',
        students: 38,
        icon: 'book',
        color: '#3b82f6',
      },
      {
        id: '3',
        title: 'Base de Données',
        instructor: 'Dr. Aïssatou Diop',
        time: '11:00',
        dayOfWeek: 'Demain',
        room: 'Salle C301',
        students: 52,
        icon: 'book',
        color: '#10b981',
      },
      {
        id: '4',
        title: 'Sécurité Informatique',
        instructor: 'Prof. Ibrahima Fall',
        time: '15:00',
        dayOfWeek: 'Ven',
        room: 'Salle B104',
        students: 41,
        icon: 'book',
        color: '#8b5cf6',
      },
    ];
  }
}
