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

type EditableReferentielField =
  | 'code'
  | 'title'
  | 'credit'
  | 'name'
  | 'coef'
  | 'professor'
  | 'vhp'
  | 'tpe'
  | 'vht';

const referentielData = APP_DATA.features.referentiel as ReferentielDataSource;

@Component({
  selector: 'app-referentiel',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './referentiel.html',
  styleUrls: ['./referentiel.scss'],
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

  editingKey: string | null = null;
  editingField: EditableReferentielField | null = null;
  editingValue = '';

  setActiveSemestre(index: number) {
    this.activeSemestre = index;
  }

  trackByUe(_: number, ue: UEItem): string {
    return ue.id;
  }

  trackByModule(_: number, module: ModuleItem): string {
    return module.id;
  }

  editKey(id: string, field: EditableReferentielField): string {
    return `${id}:${field}`;
  }

  startEditing(key: string, value: string | number, field: EditableReferentielField): void {
    if (this.editingKey === key && this.editingField === field) {
      return;
    }

    this.editingKey = key;
    this.editingField = field;
    this.editingValue = String(value);

    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement | HTMLSelectElement>(
          '.referentiel .inline-edit-input',
        );
        input?.focus();
        if (input instanceof HTMLInputElement && input.type !== 'number') {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
    }
  }

  isEditing(key: string, field: EditableReferentielField): boolean {
    return this.editingKey === key && this.editingField === field;
  }

  updateEditingValue(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | null;
    if (target) {
      this.editingValue = target.value;
    }
  }

  protectInlineEditing(event: KeyboardEvent): void {
    if (this.editingKey && event.key !== 'Enter' && event.key !== 'Escape') {
      event.stopPropagation();
    }
  }

  cancelEditing(): void {
    this.editingKey = null;
    this.editingField = null;
    this.editingValue = '';
  }

  saveEditing(ue: UEItem, module: ModuleItem | null, field: EditableReferentielField): void {
    const id = module?.id ?? ue.id;
    const key = this.editKey(id, field);
    if (!this.isEditing(key, field)) {
      return;
    }

    const value = this.editingValue.trim();
    if (module) {
      if (field === 'name') {
        module.name = value || module.name;
      } else if (field === 'professor') {
        module.professor = value;
      } else if (field === 'coef') {
        module.coef = this.numberValue(value, module.coef);
      } else if (field === 'vhp') {
        module.vhp = this.numberValue(value, module.vhp);
      } else if (field === 'tpe') {
        module.tpe = this.numberValue(value, module.tpe);
      } else if (field === 'vht') {
        module.vht = this.numberValue(value, module.vht);
      }
    } else if (field === 'code') {
      ue.code = value || ue.code;
    } else if (field === 'title') {
      ue.title = value || ue.title;
    } else if (field === 'credit') {
      ue.credit = this.numberValue(value, ue.credit);
    }

    this.cancelEditing();
  }

  private numberValue(value: string, fallback: number): number {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  getLabel(options: SelectOption[], value: string): string {
    const match = options.find((option) => option.value === value);
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
