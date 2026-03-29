import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Professor {
  id: string;
  name: string;
  grade: string;
  phone: string;
  email: string;
  hours: number;
  status: 'Actif' | 'Inactif';
  classe: string;
}

interface OptionItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-professeurs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './professeurs.html',
  styleUrl: './professeurs.scss',
})
export class ProfesseursComponent {
  searchTerm = '';
  page = 1;
  pageSize = 10;

  pageSizeOptions: OptionItem[] = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  classOptions: OptionItem[] = [
    { value: 'toutes', label: 'Toutes les classes' },
    { value: 'L1', label: 'Licence 1' },
    { value: 'L2', label: 'Licence 2' },
    { value: 'L3', label: 'Licence 3' },
  ];

  statusOptions: OptionItem[] = [
    { value: 'tous', label: 'Tous les statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
  ];

  selectedClass = 'toutes';
  selectedStatus = 'tous';

  openMenuId: string | null = null;
  selectedProfessor: Professor | null = null;

  professors: Professor[] = [
    {
      id: '1',
      name: 'Seydina Mouhammad Diop',
      grade: 'Professeur universitaire',
      phone: '785993546',
      email: 'mouhaleecr7@gmail.com',
      hours: 173,
      status: 'Actif',
      classe: 'L3 Informatique',
    },
    {
      id: '2',
      name: 'Fatou Sall',
      grade: 'Maître de conférences',
      phone: '771234567',
      email: 'fatou.sall@ecole221.sn',
      hours: 148,
      status: 'Actif',
      classe: 'L2 Informatique',
    },
    {
      id: '3',
      name: 'Moussa Ndiaye',
      grade: 'Professeur universitaire',
      phone: '769876543',
      email: 'moussa.ndiaye@ecole221.sn',
      hours: 210,
      status: 'Actif',
      classe: 'L3 Informatique',
    },
    {
      id: '4',
      name: 'Aïssatou Diop',
      grade: 'Maître assistante',
      phone: '783456789',
      email: 'aissatou.diop@ecole221.sn',
      hours: 96,
      status: 'Actif',
      classe: 'L2 Informatique',
    },
    {
      id: '5',
      name: 'Ibrahima Fall',
      grade: 'Professeur titulaire',
      phone: '776543210',
      email: 'ibrahima.fall@ecole221.sn',
      hours: 185,
      status: 'Actif',
      classe: 'L3 Informatique',
    },
    {
      id: '6',
      name: 'Aminata Sy',
      grade: 'Maître de conférences',
      phone: '781122334',
      email: 'aminata.sy@ecole221.sn',
      hours: 132,
      status: 'Actif',
      classe: 'L2 Mobile',
    },
    {
      id: '7',
      name: 'Ousmane Ba',
      grade: 'Chargé de cours',
      phone: '779988776',
      email: 'ousmane.ba@ecole221.sn',
      hours: 64,
      status: 'Inactif',
      classe: 'L1 Informatique',
    },
    {
      id: '8',
      name: 'Birane B. Wane',
      grade: 'Professeur universitaire',
      phone: '785001122',
      email: 'birane.wane@ecole221.sn',
      hours: 200,
      status: 'Actif',
      classe: 'L3 Informatique',
    },
    {
      id: '9',
      name: 'Aly T. Niang',
      grade: 'Maître assistant',
      phone: '772334455',
      email: 'aly.niang@ecole221.sn',
      hours: 118,
      status: 'Actif',
      classe: 'L2 Informatique',
    },
    {
      id: '10',
      name: 'Cheikh Tidiane Mbaye',
      grade: 'Professeur universitaire',
      phone: '786677889',
      email: 'cheikh.mbaye@ecole221.sn',
      hours: 155,
      status: 'Actif',
      classe: 'L3 Informatique',
    },
    {
      id: '11',
      name: 'Mariama Diallo',
      grade: 'Maître de conférences',
      phone: '773221144',
      email: 'mariama.diallo@ecole221.sn',
      hours: 102,
      status: 'Actif',
      classe: 'L2 Réseaux',
    },
    {
      id: '12',
      name: 'Cheikh Ndiaye',
      grade: 'Professeur universitaire',
      phone: '784443322',
      email: 'cheikh.ndiaye@ecole221.sn',
      hours: 140,
      status: 'Actif',
      classe: 'L3 Data',
    },
  ];

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.page = 1;
  }

  onPageSizeChange(value: string) {
    this.pageSize = Number(value);
    this.page = 1;
  }

  get filteredProfessors(): Professor[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.professors.filter(prof => {
      const matchesSearch = term
        ? `${prof.name} ${prof.grade} ${prof.email}`.toLowerCase().includes(term)
        : true;
      const matchesClass =
        this.selectedClass === 'toutes' || prof.classe.startsWith(this.selectedClass);
      const matchesStatus = this.selectedStatus === 'tous' || prof.status === this.selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }

  get totalResults(): number {
    return this.filteredProfessors.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedProfessors(): Professor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProfessors.slice(start, start + this.pageSize);
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

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  previousPage() {
    if (this.canPrev) this.page -= 1;
  }

  nextPage() {
    if (this.canNext) this.page += 1;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openProfile(professor: Professor) {
    this.selectedProfessor = professor;
    this.openMenuId = null;
  }

  closeProfile() {
    this.selectedProfessor = null;
  }
}
