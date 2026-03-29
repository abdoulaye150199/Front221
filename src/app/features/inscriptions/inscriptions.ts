import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface Student {
  id: string;
  matricule: string;
  name: string;
  address: string;
  phone: string;
  classe: string;
  status: 'Actif' | 'Inactif';
}

interface OptionItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-inscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './inscriptions.html',
  styleUrl: './inscriptions.scss',
})
export class InscriptionsComponent {
  searchTerm = '';
  page = 1;
  pageSize = 10;

  pageSizeOptions: OptionItem[] = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
  ];

  classOptions: OptionItem[] = [
    { value: 'toutes', label: 'Filtre par classe' },
    { value: 'Dev_Web/Mobile', label: 'Dev_Web/Mobile' },
    { value: 'Data', label: 'Data' },
    { value: 'Réseaux', label: 'Réseaux' },
  ];

  statusOptions: OptionItem[] = [
    { value: 'tous', label: 'Filtre par statut' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
  ];

  selectedClass = 'toutes';
  selectedStatus = 'tous';

  openMenuId: string | null = null;
  selectedStudent: Student | null = null;

  students: Student[] = [
    {
      id: '1',
      matricule: '1058215',
      name: 'Seydina Mouhammad Diop',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '2',
      matricule: '1058216',
      name: 'Mamadou Gueye',
      address: 'Keur Mbaye Fall Dakar, Sénégal',
      phone: '783116655',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '3',
      matricule: '1058217',
      name: 'Ndiaga Lo',
      address: 'Sicap Derklé Dakar, Sénégal',
      phone: '784559930',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '4',
      matricule: '1058218',
      name: 'Seydina Mouhammad Diop',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '5',
      matricule: '1058219',
      name: 'Ibrahima Sarr',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '6',
      matricule: '1058220',
      name: 'Aminata Diallo',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '7',
      matricule: '1058221',
      name: 'Oumar Faye',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '8',
      matricule: '1058222',
      name: 'Fatou Ndiaye',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '9',
      matricule: '1058223',
      name: 'Cheikh Tidiane Ba',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '10',
      matricule: '1058224',
      name: 'Moussa Diop',
      address: 'Sicap Liberté 6 villa 6059 Dakar, Sénégal',
      phone: '785993546',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '11',
      matricule: '1058225',
      name: 'Awa Fall',
      address: 'Yoff Dakar, Sénégal',
      phone: '786554433',
      classe: 'Data',
      status: 'Actif',
    },
    {
      id: '12',
      matricule: '1058226',
      name: 'Cheikh Ndao',
      address: 'Parcelles Assainies Dakar, Sénégal',
      phone: '770112233',
      classe: 'Réseaux',
      status: 'Inactif',
    },
    {
      id: '13',
      matricule: '1058227',
      name: 'Mariama Diouf',
      address: 'Hann Maristes Dakar, Sénégal',
      phone: '771234980',
      classe: 'Data',
      status: 'Actif',
    },
    {
      id: '14',
      matricule: '1058228',
      name: 'Babacar Seck',
      address: 'Point E Dakar, Sénégal',
      phone: '781001122',
      classe: 'Réseaux',
      status: 'Actif',
    },
    {
      id: '15',
      matricule: '1058229',
      name: 'Khadija Ba',
      address: 'Sicap Liberté 5 Dakar, Sénégal',
      phone: '775554433',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '16',
      matricule: '1058230',
      name: 'Ibrahima Kane',
      address: 'Dakar Plateau, Sénégal',
      phone: '780909090',
      classe: 'Data',
      status: 'Actif',
    },
    {
      id: '17',
      matricule: '1058231',
      name: 'Astou Gaye',
      address: 'Guédiawaye, Sénégal',
      phone: '785551122',
      classe: 'Réseaux',
      status: 'Actif',
    },
    {
      id: '18',
      matricule: '1058232',
      name: 'Cheikh Sarr',
      address: 'Keur Massar, Sénégal',
      phone: '782332211',
      classe: 'Dev_Web/Mobile',
      status: 'Actif',
    },
    {
      id: '19',
      matricule: '1058233',
      name: 'Mame Diarra Fall',
      address: 'Rufisque, Sénégal',
      phone: '773330000',
      classe: 'Data',
      status: 'Actif',
    },
    {
      id: '20',
      matricule: '1058234',
      name: 'Aliou Ndiaye',
      address: 'Pikine, Sénégal',
      phone: '776661234',
      classe: 'Réseaux',
      status: 'Actif',
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

  get filteredStudents(): Student[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.students.filter(student => {
      const matchesSearch = term
        ? `${student.name} ${student.matricule} ${student.address} ${student.classe}`
            .toLowerCase()
            .includes(term)
        : true;
      const matchesClass =
        this.selectedClass === 'toutes' || student.classe === this.selectedClass;
      const matchesStatus = this.selectedStatus === 'tous' || student.status === this.selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    });
  }

  get totalResults(): number {
    return this.filteredStudents.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get currentPage(): number {
    return Math.min(this.page, this.totalPages);
  }

  get pagedStudents(): Student[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
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

  openDetails(student: Student) {
    this.selectedStudent = student;
    this.openMenuId = null;
  }

  closeDetails() {
    this.selectedStudent = null;
  }
}
