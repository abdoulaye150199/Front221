import { Component } from '@angular/core';
import { APP_DATA } from '../../shared/data';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';
import { SelectOption } from '../../shared/models';

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

interface ReferentielDataSource {
  domainOptions: SelectOption[];
  specialiteOptions: SelectOption[];
  mentionOptions: SelectOption[];
  gradeOptions: SelectOption[];
  niveauOptions: SelectOption[];
  semestreOptions: SelectOption[];
  semesterTabs: string[];
  professors: SelectOption[];
  ueList: UEItem[];
}

const referentielData = APP_DATA.features.referentiel as ReferentielDataSource;

@Component({
  selector: 'app-referentiel',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './referentiel.html',
  styleUrl: './referentiel.scss',
})
export class ReferentielComponent {
  readonly domainOptions = referentielData.domainOptions;
  readonly specialiteOptions = referentielData.specialiteOptions;
  readonly mentionOptions = referentielData.mentionOptions;
  readonly gradeOptions = referentielData.gradeOptions;
  readonly niveauOptions = referentielData.niveauOptions;
  readonly semestreOptions = referentielData.semestreOptions;

  selectedDomain = this.domainOptions[0]?.value ?? '';
  selectedSpecialite = this.specialiteOptions[0]?.value ?? '';
  selectedMention = this.mentionOptions[0]?.value ?? '';
  selectedGrade = this.gradeOptions[0]?.value ?? '';
  selectedNiveau = this.niveauOptions[0]?.value ?? '';
  selectedSemestre = this.semestreOptions[0]?.value ?? '';

  referentielName = '';
  readonly semesterTabs = referentielData.semesterTabs;
  activeSemestre = 0;

  readonly professors = referentielData.professors;
  readonly ueList = referentielData.ueList;

  setActiveSemestre(index: number) {
    this.activeSemestre = index;
  }

  getLabel(options: SelectOption[], value: string): string {
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
