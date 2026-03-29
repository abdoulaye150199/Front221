import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ModuleItem {
  id: string;
  name: string;
  coef: number;
  professor: string;
  vhp: number;
  tpe: number;
  vht: number;
}

interface UEItem {
  id: string;
  code: string;
  title: string;
  credit: number;
  modules: ModuleItem[];
}

interface OptionItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-referentiel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './referentiel.html',
  styleUrl: './referentiel.scss',
})
export class ReferentielComponent {
  domainOptions: OptionItem[] = [
    { value: 'science-tech', label: 'Sciences et Technologies' },
    { value: 'gestion', label: 'Sciences de Gestion' },
    { value: 'sante', label: 'Sciences de la Santé' },
  ];

  specialiteOptions: OptionItem[] = [
    { value: 'web-mobile', label: 'Développement Web Mobile' },
    { value: 'data', label: 'Data & IA' },
    { value: 'reseaux', label: 'Réseaux & Sécurité' },
  ];

  mentionOptions: OptionItem[] = [
    { value: 'informatique', label: 'Informatique' },
    { value: 'genie-logiciel', label: 'Génie Logiciel' },
  ];

  gradeOptions: OptionItem[] = [
    { value: 'licence', label: 'Licence' },
    { value: 'master', label: 'Master' },
  ];

  niveauOptions: OptionItem[] = [
    { value: 'L1', label: 'Licence 1' },
    { value: 'L2', label: 'Licence 2' },
    { value: 'L3', label: 'Licence 3' },
  ];

  semestreOptions: OptionItem[] = [
    { value: 'S1', label: 'Semestre 1' },
    { value: 'S2', label: 'Semestre 2' },
  ];

  selectedDomain = 'science-tech';
  selectedSpecialite = 'web-mobile';
  selectedMention = 'informatique';
  selectedGrade = 'licence';
  selectedNiveau = 'L1';
  selectedSemestre = 'S1';

  referentielName = '';
  semesterTabs = ['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6'];
  activeSemestre = 0;

  professors: OptionItem[] = [
    { value: 'birane', label: 'Birane B. Wane' },
    { value: 'fatou', label: 'Fatou Sall' },
    { value: 'moussa', label: 'Moussa Ndiaye' },
    { value: 'aissatou', label: 'Aïssatou Diop' },
  ];

  ueList: UEItem[] = [
    {
      id: 'ue-1283',
      code: 'UE-1283',
      title: 'Outils mathématiques et algorithmique',
      credit: 7,
      modules: [
        {
          id: 'algo',
          name: 'Algorithme',
          coef: 3,
          professor: 'birane',
          vhp: 48,
          tpe: 32,
          vht: 80,
        },
        {
          id: 'java',
          name: 'Java',
          coef: 2,
          professor: 'birane',
          vhp: 48,
          tpe: 32,
          vht: 80,
        },
        {
          id: 'python',
          name: 'Python',
          coef: 2,
          professor: '',
          vhp: 48,
          tpe: 32,
          vht: 80,
        },
      ],
    },
    {
      id: 'ue-1284',
      code: 'UE-1284',
      title: 'Développement Web Fondamentaux',
      credit: 6,
      modules: [
        {
          id: 'html',
          name: 'HTML & CSS',
          coef: 2,
          professor: 'fatou',
          vhp: 32,
          tpe: 16,
          vht: 48,
        },
        {
          id: 'js',
          name: 'JavaScript',
          coef: 3,
          professor: 'fatou',
          vhp: 48,
          tpe: 32,
          vht: 80,
        },
        {
          id: 'php',
          name: 'PHP',
          coef: 1,
          professor: 'moussa',
          vhp: 24,
          tpe: 16,
          vht: 40,
        },
      ],
    },
    {
      id: 'ue-1285',
      code: 'UE-1285',
      title: 'Bases de Données',
      credit: 5,
      modules: [
        {
          id: 'sql',
          name: 'SQL',
          coef: 3,
          professor: 'aissatou',
          vhp: 40,
          tpe: 24,
          vht: 64,
        },
        {
          id: 'uml',
          name: 'Modélisation UML',
          coef: 2,
          professor: 'aissatou',
          vhp: 32,
          tpe: 16,
          vht: 48,
        },
      ],
    },
  ];

  setActiveSemestre(index: number) {
    this.activeSemestre = index;
  }

  getLabel(options: OptionItem[], value: string): string {
    const match = options.find(option => option.value === value);
    return match ? match.label : '';
  }

  get selectedDomainLabel(): string {
    return this.getLabel(this.domainOptions, this.selectedDomain);
  }

  get selectedSpecialiteLabel(): string {
    return this.getLabel(this.specialiteOptions, this.selectedSpecialite);
  }

  get selectedMentionLabel(): string {
    return this.getLabel(this.mentionOptions, this.selectedMention);
  }

  get selectedGradeLabel(): string {
    return this.getLabel(this.gradeOptions, this.selectedGrade);
  }

  get selectedNiveauLabel(): string {
    return this.getLabel(this.niveauOptions, this.selectedNiveau);
  }
}
