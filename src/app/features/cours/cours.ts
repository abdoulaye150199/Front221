import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Course {
  id: string;
  ue: string;
  module: string;
  professor: string;
  credits: number;
  hours: string;
  students: number;
  specialite: string;
  niveau: string;
  classe: string;
  semestre: string;
}

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './cours.html',
  styleUrl: './cours.scss',
})
export class CoursComponent {
  searchTerm = '';
  page = 1;
  pageSize = 8;

  specialites = [
    { value: 'toutes', label: 'Toutes les spécialités' },
    { value: 'informatique', label: 'Informatique' },
    { value: 'reseaux', label: 'Réseaux' },
    { value: 'data', label: 'Data' },
  ];

  niveaux = [
    { value: 'tous', label: 'Tous les niveaux' },
    { value: 'L1', label: 'Licence 1' },
    { value: 'L2', label: 'Licence 2' },
    { value: 'L3', label: 'Licence 3' },
  ];

  classes = [
    { value: 'toutes', label: 'Toutes les classes' },
    { value: 'A', label: 'Classe A' },
    { value: 'B', label: 'Classe B' },
    { value: 'C', label: 'Classe C' },
  ];

  semestres = [
    { value: 'tous', label: 'Tous les semestres' },
    { value: 'S1', label: 'Semestre 1' },
    { value: 'S2', label: 'Semestre 2' },
  ];

  selectedSpecialite = 'toutes';
  selectedNiveau = 'tous';
  selectedClasse = 'toutes';
  selectedSemestre = 'tous';

  courses: Course[] = [
    {
      id: '1',
      ue: 'UE1 - Développement',
      module: 'Développement Web Avancé',
      professor: 'Dr. Fatou Sall',
      credits: 6,
      hours: '48h',
      students: 45,
      specialite: 'informatique',
      niveau: 'L2',
      classe: 'A',
      semestre: 'S1',
    },
    {
      id: '2',
      ue: 'UE2 - Intelligence Artificielle',
      module: 'Machine Learning',
      professor: 'Prof. Moussa Ndiaye',
      credits: 8,
      hours: '60h',
      students: 38,
      specialite: 'data',
      niveau: 'L3',
      classe: 'B',
      semestre: 'S1',
    },
    {
      id: '3',
      ue: 'UE1 - Bases de Données',
      module: 'Systèmes de Gestion de BD',
      professor: 'Dr. Aïssatou Diop',
      credits: 6,
      hours: '48h',
      students: 52,
      specialite: 'informatique',
      niveau: 'L2',
      classe: 'C',
      semestre: 'S1',
    },
    {
      id: '4',
      ue: 'UE3 - Sécurité',
      module: 'Sécurité Informatique',
      professor: 'Prof. Ibrahima Fall',
      credits: 7,
      hours: '54h',
      students: 41,
      specialite: 'reseaux',
      niveau: 'L3',
      classe: 'A',
      semestre: 'S2',
    },
    {
      id: '5',
      ue: 'UE2 - Mobile',
      module: 'Développement Android',
      professor: 'Dr. Aminata Sy',
      credits: 6,
      hours: '48h',
      students: 36,
      specialite: 'informatique',
      niveau: 'L2',
      classe: 'B',
      semestre: 'S2',
    },
    {
      id: '6',
      ue: 'UE1 - Programmation',
      module: 'Algorithmes Avancés',
      professor: 'Prof. Ousmane Ba',
      credits: 7,
      hours: '54h',
      students: 48,
      specialite: 'informatique',
      niveau: 'L1',
      classe: 'A',
      semestre: 'S1',
    },
    {
      id: '7',
      ue: 'UE3 - Réseaux',
      module: 'Architecture Réseaux',
      professor: 'Dr. Mariama Diallo',
      credits: 6,
      hours: '48h',
      students: 32,
      specialite: 'reseaux',
      niveau: 'L2',
      classe: 'C',
      semestre: 'S2',
    },
    {
      id: '8',
      ue: 'UE2 - Data',
      module: 'Big Data Analytics',
      professor: 'Prof. Cheikh Ndiaye',
      credits: 8,
      hours: '60h',
      students: 28,
      specialite: 'data',
      niveau: 'L3',
      classe: 'B',
      semestre: 'S2',
    },
  ];

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.page = 1;
  }

  get filteredCourses(): Course[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.courses.filter(course => {
      const matchesSearch = term
        ? `${course.ue} ${course.module} ${course.professor}`.toLowerCase().includes(term)
        : true;
      const matchesSpecialite =
        this.selectedSpecialite === 'toutes' || course.specialite === this.selectedSpecialite;
      const matchesNiveau = this.selectedNiveau === 'tous' || course.niveau === this.selectedNiveau;
      const matchesClasse = this.selectedClasse === 'toutes' || course.classe === this.selectedClasse;
      const matchesSemestre =
        this.selectedSemestre === 'tous' || course.semestre === this.selectedSemestre;
      return matchesSearch && matchesSpecialite && matchesNiveau && matchesClasse && matchesSemestre;
    });
  }

  get totalResults(): number {
    return this.filteredCourses.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    if (this.totalResults === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    if (this.totalResults === 0) return 0;
    return Math.min(this.currentPage * this.pageSize, this.totalResults);
  }

  get canPrev(): boolean {
    return this.currentPage > 1;
  }

  get canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  previousPage() {
    if (this.canPrev) this.page -= 1;
  }

  nextPage() {
    if (this.canNext) this.page += 1;
  }
}
